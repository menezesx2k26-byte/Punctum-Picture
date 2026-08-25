"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { SECTION_REGISTRY, siteConfigSchema, type SiteConfig } from "../../../../shared/config";

export type StudioPhoto = { id:string; altText:string|null; width:number|null; height:number|null; albumTitle:string; thumbUrl:string };
type PhotoTarget = "hero" | "global" | "patch" | `section:${string}`;

export function StudioPhotosPanel({ config, photos, loading, error, onLoad, onChange }: {
  config:SiteConfig; photos:StudioPhoto[]; loading:boolean; error:string|null; onLoad:()=>void; onChange:(next:SiteConfig,message:string)=>void;
}) {
  const [target,setTarget]=useState<PhotoTarget>("hero");
  const [query,setQuery]=useState("");
  useEffect(()=>{ onLoad(); },[onLoad]);
  const hero=config.pages.home.sections.find((section)=>section.type==="hero");
  const reel=config.pages.home.sections.find((section)=>section.type==="photo-reel");
  const photoSections=config.pages.home.sections.filter((section)=>section.type!=="hero" && (SECTION_REGISTRY[section.type].allowedSurfaces as readonly string[]).includes("photo"));
  const filtered=useMemo(()=>{ const q=query.trim().toLocaleLowerCase("pt-BR"); return q?photos.filter((p)=>`${p.albumTitle} ${p.altText??""}`.toLocaleLowerCase("pt-BR").includes(q)):photos; },[photos,query]);

  function selectedIds():string[]{
    if(target==="hero") return hero?.type==="hero" && hero.appearance.backgroundImageId?[hero.appearance.backgroundImageId]:[];
    if(target==="global") return config.theme.background.imageId?[config.theme.background.imageId]:[];
    if(target==="patch") return reel?.type==="photo-reel"?reel.photoIds:[];
    const section=config.pages.home.sections.find((candidate)=>candidate.id===target.slice("section:".length));
    return section?.appearance.backgroundImageId?[section.appearance.backgroundImageId]:[];
  }
  const selected=selectedIds();

  function choose(photoId:string){
    const next=structuredClone(config);
    if(target==="hero"){
      const targetHero=next.pages.home.sections.find((section)=>section.type==="hero");
      if(!targetHero || targetHero.type!=="hero") return;
      targetHero.appearance.surface="photo";
      targetHero.appearance.backgroundImageId=photoId;
      onChange(siteConfigSchema.parse(next),"Hero da página inicial atualizado. Publique para colocar no site."); return;
    }
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
    const next=structuredClone(config);
    if(target==="hero"){
      const targetHero=next.pages.home.sections.find((section)=>section.type==="hero");
      if(targetHero?.type==="hero"){ targetHero.appearance.surface="default"; targetHero.appearance.backgroundImageId=null; }
    } else if(target==="global") next.theme.background={...next.theme.background,style:"soft-image",assetId:"manifesto-portrait",imageId:null};
    else if(target==="patch"){ const targetReel=next.pages.home.sections.find((section)=>section.type==="photo-reel"); if(targetReel?.type==="photo-reel")targetReel.photoIds=[]; }
    else { const section=next.pages.home.sections.find((candidate)=>candidate.id===target.slice("section:".length)); if(section){section.appearance.surface="default";section.appearance.backgroundImageId=null;} }
    onChange(siteConfigSchema.parse(next),target==="hero"?"Hero restaurado para a foto padrão.":"Seleção de fotografias restaurada.");
  }

  return <section className="studio-panel studio-photos-panel" aria-labelledby="studio-photos-title">
    <div className="studio-panel-heading"><p className="eyebrow">Imagem principal</p><h2 id="studio-photos-title">Hero da página inicial</h2><p>Esta é a foto grande que aparece no topo do site. Escolha uma foto publicada abaixo ou envie uma nova para o acervo.</p></div>
    <div className="studio-photo-guidance"><div><strong>{selected.length?"Hero escolhido":"Usando o Hero padrão"}</strong><span>{selected.length?"A mudança entra no site quando você publicar.":"Escolha uma fotografia para trocar."}</span></div><Link href="/admin/ensaios" className="button"><UploadCloud size={16} aria-hidden="true"/> Enviar nova foto</Link></div>

    <div className="studio-photo-targets" role="group" aria-label="Onde usar as fotografias">
      <button type="button" aria-pressed={target==="hero"} onClick={()=>setTarget("hero")}>Hero da página inicial</button>
      <button type="button" aria-pressed={target==="global"} onClick={()=>setTarget("global")}>Fundo do site</button>
      {reel?<button type="button" aria-pressed={target==="patch"} onClick={()=>setTarget("patch")}>Fotos do Patch</button>:null}
      {photoSections.map((section)=><button type="button" aria-pressed={target===`section:${section.id}`} onClick={()=>setTarget(`section:${section.id}`)} key={section.id}>Fundo · {SECTION_REGISTRY[section.type].label}</button>)}
    </div>

    {target!=="hero"?<div className="studio-photo-guidance"><div><strong>{target==="patch"?"Escolha de 3 a 6 fotos.":"Escolha uma fotografia."}</strong><span>{selected.length?`${selected.length} selecionada${selected.length>1?"s":""}`:"Nenhuma foto do acervo escolhida"}</span></div>{selected.length?<button type="button" onClick={clearSelection}><X size={16}/> Limpar escolha</button>:null}</div>:selected.length?<div className="studio-photo-guidance"><div><strong>Quer voltar ao Hero original?</strong><span>A foto 4K atual continua como fallback seguro.</span></div><button type="button" onClick={clearSelection}><X size={16}/> Restaurar Hero padrão</button></div>:null}

    <label className="studio-photo-search"><span>Encontrar pelo ensaio</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Ex.: Fé e Tradição"/></label>
    {loading?<div className="studio-photo-state" role="status"><ImageIcon/> Preparando suas fotografias…</div>:null}
    {error?<div className="studio-photo-state error" role="alert">{error}<button type="button" onClick={onLoad}>Tentar novamente</button></div>:null}
    {!loading&&!error?<div className="studio-photo-grid">{filtered.map((photo)=>{const active=selected.includes(photo.id);return <button type="button" className={active?"selected":""} aria-pressed={active} onClick={()=>choose(photo.id)} key={photo.id}><Image src={photo.thumbUrl} alt={photo.altText||`Fotografia do ensaio ${photo.albumTitle}`} width={photo.width??600} height={photo.height??750} sizes="(max-width: 640px) 42vw, 12rem" unoptimized/><span>{photo.albumTitle}</span><i aria-hidden="true">{active?"✓":""}</i></button>;})}</div>:null}
  </section>;
}
