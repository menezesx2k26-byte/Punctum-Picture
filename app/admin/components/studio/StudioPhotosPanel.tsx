"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { SECTION_REGISTRY, siteConfigSchema, type SiteConfig } from "../../../../shared/config";
import { restoreDefaultHero, selectPortfolioHero, selectSiteMediaHero } from "./hero-media";

export type StudioPhoto = { id:string; altText:string|null; width:number|null; height:number|null; albumTitle:string; thumbUrl:string };
type PhotoTarget = "hero" | "global" | "patch" | `section:${string}`;
type SiteMediaIntentResponse = {
  media?: { id:string; role:"hero"; status:string };
  uploadUrl?: string;
  requiredHeaders?: Record<string,string>;
  error?: { message?: string };
};
type SiteMediaCompleteResponse = {
  media?: { id:string; status:string; width:number|null; height:number|null; url:string|null };
  error?: { message?: string };
};

async function responseMessage(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => null) as { error?: { message?: string } } | null;
  return body?.error?.message || fallback;
}

export function StudioPhotosPanel({ config, photos, loading, error, onLoad, onChange }: {
  config:SiteConfig; photos:StudioPhoto[]; loading:boolean; error:string|null; onLoad:()=>void; onChange:(next:SiteConfig,message:string)=>void;
}) {
  const [target,setTarget]=useState<PhotoTarget>("hero");
  const [query,setQuery]=useState("");
  const [uploading,setUploading]=useState(false);
  const [uploadError,setUploadError]=useState<string|null>(null);
  useEffect(()=>{ onLoad(); },[onLoad]);
  const hero=config.pages.home.sections.find((section)=>section.type==="hero");
  const reel=config.pages.home.sections.find((section)=>section.type==="photo-reel");
  const photoSections=config.pages.home.sections.filter((section)=>section.type!=="hero" && (SECTION_REGISTRY[section.type].allowedSurfaces as readonly string[]).includes("photo"));
  const filtered=useMemo(()=>{ const q=query.trim().toLocaleLowerCase("pt-BR"); return q?photos.filter((p)=>`${p.albumTitle} ${p.altText??""}`.toLocaleLowerCase("pt-BR").includes(q)):photos; },[photos,query]);
  const siteMediaHero=hero?.type==="hero"&&hero.heroMedia?.kind==="site-media"?hero.heroMedia.id:null;

  function selectedIds():string[]{
    if(target==="hero"){
      if(hero?.type==="hero"&&hero.heroMedia?.kind==="portfolio-image") return [hero.heroMedia.id];
      return hero?.type==="hero"&&hero.appearance.backgroundImageId?[hero.appearance.backgroundImageId]:[];
    }
    if(target==="global") return config.theme.background.imageId?[config.theme.background.imageId]:[];
    if(target==="patch") return reel?.type==="photo-reel"?reel.photoIds:[];
    const section=config.pages.home.sections.find((candidate)=>candidate.id===target.slice("section:".length));
    return section?.appearance.backgroundImageId?[section.appearance.backgroundImageId]:[];
  }
  const selected=selectedIds();

  async function uploadHero(file:File){
    setUploadError(null);
    setUploading(true);
    try{
      if(!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("Escolha uma foto JPG, PNG ou WebP.");
      if(file.size>26_214_400) throw new Error("A foto ultrapassa 25 MB.");

      const intentResponse=await fetch("/admin/api/site-media/intents",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({filename:file.name,mimeType:file.type,sizeBytes:file.size,role:"hero"}),
      });
      if(!intentResponse.ok) throw new Error(await responseMessage(intentResponse,"Não foi possível preparar o envio."));
      const intent=await intentResponse.json() as SiteMediaIntentResponse;
      if(!intent.media?.id||!intent.uploadUrl) throw new Error("O envio não retornou uma referência válida.");

      const uploadResponse=await fetch(intent.uploadUrl,{
        method:"PUT",
        headers:intent.requiredHeaders??{"Content-Type":file.type},
        body:file,
      });
      if(!uploadResponse.ok) throw new Error(await responseMessage(uploadResponse,"Não foi possível enviar a foto."));

      const completeResponse=await fetch(`/admin/api/site-media/${encodeURIComponent(intent.media.id)}/complete`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({etag:uploadResponse.headers.get("etag")??undefined}),
      });
      if(!completeResponse.ok) throw new Error(await responseMessage(completeResponse,"Não foi possível finalizar a foto."));
      const completed=await completeResponse.json() as SiteMediaCompleteResponse;
      if(!completed.media?.id||completed.media.status!=="ready") throw new Error("A foto não ficou pronta para uso.");

      onChange(selectSiteMediaHero(config,completed.media.id),"Nova foto do Hero enviada. Publique para colocar no site.");
    }catch(cause){
      setUploadError(cause instanceof Error?cause.message:"Não foi possível enviar esta foto.");
    }finally{
      setUploading(false);
    }
  }

  function choose(photoId:string){
    if(target==="hero"){
      onChange(selectPortfolioHero(config,photoId),"Hero da página inicial atualizado. Publique para colocar no site."); return;
    }
    const next=structuredClone(config);
    if(target==="global"){
      next.theme.background={...next.theme.background,style:"soft-image",assetId:null,imageId:photoId};
      onChange(siteConfigSchema.parse(next),"Fotografia de fundo escolhida."); return;
    }
    if(target==="patch"){
      const targetReel=next.pages.home.sections.find((section)=>section.type==="photo-reel");
      if(!targetReel || targetReel.type!=="photo-reel") return;
      if(targetReel.photoIds.includes(photoId)){ const without=targetReel.photoIds.filter((id)=>id!==photoId); targetReel.photoIds=without.length>=3?without:[]; }
      else { const candidates=[...targetReel.photoIds,photoId,...photos.map((p)=>p.id)].filter((id,index,all)=>all.indexOf(id)===index); if(candidates.length<3)return; targetReel.photoIds=candidates.slice(0,Math.max(3,targetReel.photoIds.length+1)).slice(0,6); }
      onChange(siteConfigSchema.parse(next),"Fotografias do Patch atualizadas."); return;
    }
    const section=next.pages.home.sections.find((candidate)=>candidate.id===target.slice("section:".length));
    if(!section)return; section.appearance.surface="photo"; section.appearance.backgroundImageId=photoId;
    onChange(siteConfigSchema.parse(next),"Fotografia desta parte escolhida.");
  }

  function clearSelection(){
    if(target==="hero"){
      onChange(restoreDefaultHero(config),"Hero restaurado para a foto padrão."); return;
    }
    const next=structuredClone(config);
    if(target==="global") next.theme.background={...next.theme.background,style:"soft-image",assetId:"manifesto-portrait",imageId:null};
    else if(target==="patch"){ const targetReel=next.pages.home.sections.find((section)=>section.type==="photo-reel"); if(targetReel?.type==="photo-reel")targetReel.photoIds=[]; }
    else { const section=next.pages.home.sections.find((candidate)=>candidate.id===target.slice("section:".length)); if(section){section.appearance.surface="default";section.appearance.backgroundImageId=null;} }
    onChange(siteConfigSchema.parse(next),"Seleção de fotografias restaurada.");
  }

  return <section className="studio-panel studio-photos-panel" aria-labelledby="studio-photos-title">
    <div className="studio-panel-heading"><p className="eyebrow">Imagem principal</p><h2 id="studio-photos-title">Hero da página inicial</h2><p>Esta é a foto grande que aparece no topo do site. Você pode escolher uma foto do acervo ou enviar direto do celular.</p></div>
    <div className="studio-photo-guidance"><div><strong>{siteMediaHero?"Hero enviado do celular":selected.length?"Hero escolhido":"Usando o Hero padrão"}</strong><span>{siteMediaHero||selected.length?"A mudança entra no site quando você publicar.":"Escolha uma fotografia para trocar."}</span></div><label className="button" aria-disabled={uploading}><UploadCloud size={16} aria-hidden="true"/> {uploading?"Enviando…":"Enviar foto do celular"}<input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={uploading} onChange={(event)=>{const file=event.target.files?.[0];event.currentTarget.value="";if(file)void uploadHero(file);}}/></label></div>
    {uploadError?<div className="studio-photo-state error" role="alert">{uploadError}</div>:null}

    <div className="studio-photo-targets" role="group" aria-label="Onde usar as fotografias">
      <button type="button" aria-pressed={target==="hero"} onClick={()=>setTarget("hero")}>Hero da página inicial</button>
      <button type="button" aria-pressed={target==="global"} onClick={()=>setTarget("global")}>Fundo do site</button>
      {reel?<button type="button" aria-pressed={target==="patch"} onClick={()=>setTarget("patch")}>Fotos do Patch</button>:null}
      {photoSections.map((section)=><button type="button" aria-pressed={target===`section:${section.id}`} onClick={()=>setTarget(`section:${section.id}`)} key={section.id}>Fundo · {SECTION_REGISTRY[section.type].label}</button>)}
    </div>

    {target!=="hero"?<div className="studio-photo-guidance"><div><strong>{target==="patch"?"Escolha de 3 a 6 fotos.":"Escolha uma fotografia."}</strong><span>{selected.length?`${selected.length} selecionada${selected.length>1?"s":""}`:"Nenhuma foto do acervo escolhida"}</span></div>{selected.length?<button type="button" onClick={clearSelection}><X size={16}/> Limpar escolha</button>:null}</div>:siteMediaHero||selected.length?<div className="studio-photo-guidance"><div><strong>Quer voltar ao Hero original?</strong><span>A foto 4K atual continua como fallback seguro.</span></div><button type="button" onClick={clearSelection}><X size={16}/> Restaurar Hero padrão</button></div>:null}

    <label className="studio-photo-search"><span>Encontrar pelo ensaio</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Ex.: Fé e Tradição"/></label>
    {loading?<div className="studio-photo-state" role="status"><ImageIcon/> Preparando suas fotografias…</div>:null}
    {error?<div className="studio-photo-state error" role="alert">{error}<button type="button" onClick={onLoad}>Tentar novamente</button></div>:null}
    {!loading&&!error?<div className="studio-photo-grid">{filtered.map((photo)=>{const active=selected.includes(photo.id);return <button type="button" className={active?"selected":""} aria-pressed={active} onClick={()=>choose(photo.id)} key={photo.id}><Image src={photo.thumbUrl} alt={photo.altText||`Fotografia do ensaio ${photo.albumTitle}`} width={photo.width??600} height={photo.height??750} sizes="(max-width: 640px) 42vw, 12rem" unoptimized/><span>{photo.albumTitle}</span><i aria-hidden="true">{active?"✓":""}</i></button>;})}</div>:null}
  </section>;
}
