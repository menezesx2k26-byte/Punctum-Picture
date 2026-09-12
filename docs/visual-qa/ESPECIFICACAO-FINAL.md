# Especificação final — Punctum Picture

## Direção e requisitos preservados

O visitante entra pela lente e continua percorrendo fotografias reais. Roxo profundo organiza o ambiente; as fotos conservam suas cores. Escrita direta, títulos com personalidade e legendas em repouso. Não introduzir frases motivacionais, números decorativos, cursor ornamental na home ou cartões com aparência de painel de software.

Preservar abertura da lente, geometria do carrossel 3D, Studio, rotas de ensaios/portfólio/arquivo, formulário, WhatsApp, SEO e contratos de API/D1/R2. Não reimplementar backend para acomodar a apresentação.

## Integração

HomeExperience coordena as seções existentes e aplica immersive-home. app/immersive.css concentra o acabamento. A página pública normaliza a abertura para LensHero cinematic e o percurso de fotos para SpatialCarousel horizontal. FeaturedStories usa StorySequence no modo interno projector, apresentado como Percorrer; Grade e Composição continuam disponíveis. HomePhotoReelSection conserva SpatialCarousel e seu visualizador.

Defaults: palette nocturne-plum, mode dark, headingFamily instrument-serif, bodyFamily manrope, headingScale display, bodyScale comfortable, headingWeight regular, headingTracking tight, radius square, density balanced, container wide, image treatment natural. Usar tokens/registro existentes; background padrão #120a17 e primary #e0c8eb. A configuração persistida prevalece em conteúdo, fotos, identidade e seções secundárias, exceto pelos valores distribuídos pela própria versão anterior e reconhecidos por igualdade exata. O contrato de apresentação protege somente a lente e o carrossel 3D. Não criar outro sistema de tema.

## Contrato do Studio

- O Studio continua sendo a fonte de verdade para textos, foto do Hero, envio de uma nova foto do Hero, fotografias e ordem do carrossel, paleta, tipografia, tratamento de imagem, fundo global, intensidade do movimento, seções secundárias, quantidade de trabalhos e histórico de publicação.
- Hero e photo-reel são sempre visíveis. Hero permanece primeiro e cinematic; photo-reel permanece horizontal. O painel não oferece ações que desativem ou troquem essas duas composições.
- Configurações antigas, rascunhos e versões restauradas são normalizados no cliente e novamente no render público. Essa proteção não apaga heroMedia, photoIds, aparência, conteúdo editorial ou escolhas de tema.
- Sem movimento: lente sem transição e grade acessível no lugar do cilindro animado. Suave: lente e reenquadramentos discretos. Mais vivo: lente e reenquadramentos mais amplos. A preferência de redução do visitante ou do sistema sempre prevalece.
- A escolha do carrossel aceita zero ou de três a seis fotos únicas. Uma seleção parcial de uma ou duas fotos fica local no painel e não substitui o rascunho válido. Ao chegar a três, a ordem escolhida é persistida. Limpar volta à seleção automática do acervo.
- A foto do Hero escolhida no acervo ou enviada pelo celular continua dentro da lente. Restaurar o Hero remove somente a escolha explícita e volta a public/photos/p002.jpg.
- Ao ler uma publicação antiga, legacy-refresh.ts troca somente as frases padrão anteriores pelas frases diretas atuais. A tipografia Cormorant muda para Instrument Serif apenas quando toda a assinatura editorial antiga ainda está presente. A mídia a66bbe1b-d1f8-449f-bc08-481f73253ed5 é removida somente quando ainda acompanha o título padrão “O que pulsa,”; assim o Hero volta à vela aprovada. Qualquer divergência indica edição no Studio e é preservada.
- Rascunho, salvamento automático, prévia, descarte, publicação, restauração e detecção de conflito continuam usando o fluxo existente. Toda alteração passa pelo mesmo schema e pela política imersiva antes de ser salva.

## Entrada pela câmera

- Seção animada de 190svh; palco sticky de 100svh. Progresso = clamp(-top / (altura da seção − altura da viewport), 0, 1).
- Seis lâminas SVG, aro físico, reflexo discreto e abertura central; sem WebGL ou biblioteca nova. SVG 28 px para dentro do aro.
- Aro móvel: 280 px; telas baixas: 230 px; desktop ≥900 px: 420 px. Centro mobile 50%/61%; desktop 70%/50%.
- Foto do Studio expande por clip-path circular. Aro amplia até 4× e gira até −24°; lâminas se afastam até −350 px. Título sai no primeiro terço; legenda entra na segunda metade. Rolagem reversa reverte a cena.
- Ver fotografias leva à âncora após a lente. CTA secundário vem do Studio. Em largura <360 px, esse CTA é oculto por espaço; Portfólio segue no cabeçalho.
- Usar fluxo normal se a fonte raiz exceder 24 px, o título exceder max(220 px, 50% da altura da tela) ou a navegação exceder 112 px. A regra anterior de 55% desativava a câmera em janelas normais e foi removida.
- Movimento reduzido mostra a fotografia sem animação; modo normal mantém a lente aprovada.

### Correção após retorno da usuária

Sem uma seleção explícita no Studio, a variante cinematic usa a foto aprovada da vela, public/photos/p002.jpg, nas dimensões originais 1080×1440. Não usar o retrato legado hero-maria.webp como fallback dessa variante. Seleções explícitas de mídia continuam respeitadas. A imagem cobre o palco mantendo proporção, com recorte, sem esticar pixels para preencher a tela. Regras de câmera para telas baixas e estreitas se limitam a largura inferior a 900 px; no desktop, centro da foto e centro do aro permanecem alinhados em 70%/50%.

## Rolagem e composição

useSceneProgress usa IntersectionObserver para limitar trabalho às cenas próximas, requestAnimationFrame para agrupar atualizações e ResizeObserver para verificar espaço. Escritas de ajuste são adiadas ao próximo quadro para evitar ciclo de resize. Remover observadores, eventos e frames ao desmontar. Sem scroll hijacking.

Ensaios: fotos grandes, legenda atravessando a borda inferior, alternância esquerda/direita. Imagem reduz escala de 1,1 para 1 e muda enquadramento de 42% para 50%; chegada abre o recorte lateral. Em altura ≥700 px e movimento normal: seção mínima 125svh, palco sticky a 4svh. Conteúdo alto ou foco de teclado libera o palco para fluxo normal. Sem capa: texto e link, sem placeholder vazio artificial.

Desktop ≥900 px: 12 colunas; imagem ocupa 1–9, legenda 9–12, espelhadas no próximo ensaio; foto até 78svh. Mobile: imagem até 65svh; legenda sobe 2rem sobre a borda com fundo sólido. Mesa de fotos: quatro colunas desktop, duas mobile, itens pares deslocados 2rem. Não colocar numeração ou categorias ornamentais embaixo das miniaturas.

Cabeçalho, Hero, manifesto, títulos do carrossel e dos ensaios, rodapé do carrossel, mesa de fotos, Sobre, Contato, rodapé e controle de movimento compartilham a mesma margem editorial. Em telas mais largas que o conteúdo máximo, --frame-edge centraliza esse eixo; em telas menores, usa o gutter responsivo. Imagens e palco 3D podem atravessar essa moldura, mas os pontos de leitura retornam ao mesmo eixo.

Sobre: retrato chega com até 24 px e escala 1,06→1. Contato: título chega com até 28 px; anéis decorativos discretos apenas em telas maiores. Inputs permanecem estáveis. Cada trecho tem composição própria, sem animação automática uniforme em todos os elementos.

## Carrossel e diálogo

Preservar radius = max(380, round(count × 180 / (2π))), intervalo 360/count, perspectiva e construção do cilindro. Não substituir por slider ou grade no modo normal. A alternativa de movimento reduzido pertence ao comportamento acessível do componente.

Pointer Events: deslocamento >6 px distingue toque de gesto. Horizontal captura ponteiro e gira 0,25° por pixel; vertical não gira. Arraste não abre foto ao soltar. Cancelamento encerra gesto/inércia; setas param inércia e avançam um intervalo. Cards dianteiros recebem tabulação; traseiros não disputam foco.

Diálogo nativo mostra a foto, bloqueia scroll do documento, aceita Escape e devolve foco ao disparador. Desmontagem restaura overflow/foco. Não permitir WhatsApp sobre o diálogo.

## WhatsApp e contato

Botão flutuante 56×56 px; imagem 36×36 px. Direita max(16px, safe-area-inset-right); base 16px + safe-area-inset-bottom; z-index 40. Preservar destino/número/mensagem configurados. Não publicar contato de exemplo.

Ocultar enquanto input, textarea ou select estiver focado e durante dialog[open]; retornar ao encerrar essas condições. Sem pulsação infinita ou popup automático. Formulário conserva validação, envio, feedback e API. Não transmitir pedido real durante QA sem autorização.

## Tipografia e conteúdo

Instrument Serif nos títulos e Manrope no corpo. Caixa normal, entreletra natural nas legendas, corpo mínimo 1rem, links de ação com altura mínima 48 px. Títulos usam clamp e quebra segura para texto longo. Não converter descrições em etiquetas técnicas ou 01—03.

Texto vem do Studio. Defaults descrevem temas e contato de forma direta. Citação fornecida: “Comecei na fotografia na igreja, e desde então nunca mais parei.” Não inventar depoimentos, prêmios, clientes, números ou contexto de fotos. editorial-refresh.ts substitui a antiga biografia distribuída somente por igualdade exata; qualquer texto editado é preservado.

## Mobile e acessibilidade

Priorizar 320–430 px e conferir 844×390 e 1440×900. Nenhuma rolagem horizontal no documento. Respeitar safe areas; object-fit:cover sem deformar fotos. Texto a 200% pode aumentar altura e desativar sticky. Não prender legenda abaixo da tela. Não depender de hover; manter links reais, botões semânticos, foco visível, um h1 e alt adequado.

Reduzir movimento fica após o rodapé e persiste em localStorage na chave punctum-reduce-motion, com fallback em memória. Preferência reduzida do sistema prevalece. O controle apresenta esse estado; não exigir assistir à entrada para acessar o conteúdo.

## Performance

Hero prioritária existente; imagens subsequentes lazy/async onde aplicável; manter pipeline R2 e dimensões. Não duplicar acervo em Base64. CSS/SVG e cenas observadas; nenhuma biblioteca adicionada. Não declarar 60 fps ou nota Lighthouse sem medir.

Chunks do build final, tamanho bruto/gzip: LensHero 1.724/735 bytes; useSceneProgress 1.631/792; motion-preference 1.275/609; FeaturedStories 5.435/1.782. Esses valores excluem dependências compartilhadas, CSS e fotos. Métricas de rede/aparelho físico e Core Web Vitals em produção não foram medidas.

## Importar e executar

1. Clonar o repositório original com histórico; preservar alterações locais.
2. Importar bundle incremental OU patch, nunca ambos; verificar commit base e conflitos.
3. Node ≥22.13; npm ci com o lockfile. Configurar somente bindings/segredos existentes, sem versioná-los.
4. Preparar D1 de desenvolvimento somente com migrations locais. Não executar migrations remotas para reproduzir a entrega.
5. npm run dev -- --host 127.0.0.1 --port 4190. Confirmar HTTP 200, fotos reais e variantes do Studio.
6. npm run typecheck; npm run lint; npm test -- tests/unit; npm run build. Neste Windows foram usados os entrypoints Node equivalentes em node_modules por falha dos wrappers npm da instalação, sem exigir mudança no projeto.
7. Conferir configuração publicada: hero cinematic, ensaios ativos e reel horizontal. Defaults não substituem escolhas salvas. Revisar capas, WhatsApp e conteúdo autoral no Studio.
8. Publicação exige autorização do responsável e revisão da automação GitHub. Não empurrar main apenas para transportar arquivos; há branch dedicada.

## Critérios de regressão

Conferir lente nos dois sentidos; âncora Ver fotografias; Percorrer/Grade/Composição; link de álbum; carrossel por ponteiro e teclado; ausência de clique após arraste; Escape e retorno de foco; WhatsApp fora do teclado; preferência reduzida após reload; título longo/texto 200%; 320 px; imagens ausentes; console; build/testes. Repetir verificações afetadas por futuras mudanças. Não registrar como feito o que foi apenas planejado.

Estado final local e limites: immersive-director-record.json. Aparelhos físicos, métricas de campo, envio real do contato, configuração pública e publicação são verificações externas separadas da implementação concluída.
