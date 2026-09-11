# Especificação final — Punctum Picture

## Direção e requisitos preservados

O visitante entra pela lente e continua percorrendo fotografias reais. Roxo profundo organiza o ambiente; as fotos conservam suas cores. Escrita direta, títulos com personalidade e legendas em repouso. Não introduzir frases motivacionais, números decorativos, cursor ornamental na home ou cartões com aparência de painel de software.

Preservar abertura da lente, geometria do carrossel 3D, Studio, rotas de ensaios/portfólio/arquivo, formulário, WhatsApp, SEO e contratos de API/D1/R2. Não reimplementar backend para acomodar a apresentação.

## Integração

HomeExperience coordena as seções existentes e aplica immersive-home. app/immersive.css concentra o acabamento. HomeHeroSection usa LensHero apenas na variante cinematic; outras variantes permanecem válidas. FeaturedStories usa StorySequence no modo interno projector, apresentado como Percorrer; Grade e Composição continuam disponíveis. HomePhotoReelSection conserva SpatialCarousel e seu visualizador.

Defaults: palette nocturne-plum, mode dark, headingFamily instrument-serif, bodyFamily manrope, headingScale display, bodyScale comfortable, headingWeight regular, headingTracking tight, radius square, density balanced, container wide, image treatment natural. Usar tokens/registro existentes; background padrão #120a17 e primary #e0c8eb. Configuração persistida prevalece. Não criar outro sistema de tema.

## Entrada pela câmera

- Seção animada de 190svh; palco sticky de 100svh. Progresso = clamp(-top / (altura da seção − altura da viewport), 0, 1).
- Seis lâminas SVG, aro físico, reflexo discreto e abertura central; sem WebGL ou biblioteca nova. SVG 28 px para dentro do aro.
- Aro móvel: 280 px; telas baixas: 230 px; desktop ≥900 px: 420 px. Centro mobile 50%/61%; desktop 70%/50%.
- Foto do Studio expande por clip-path circular. Aro amplia até 4× e gira até −24°; lâminas se afastam até −350 px. Título sai no primeiro terço; legenda entra na segunda metade. Rolagem reversa reverte a cena.
- Ver fotografias leva à âncora após a lente. CTA secundário vem do Studio. Em largura <360 px, esse CTA é oculto por espaço; Portfólio segue no cabeçalho.
- Se título + navegação + 120 px excederem 55% da altura da tela, usar fluxo normal, cabeçalho com quebra e título sem corte. Não diminuir artificialmente o conteúdo para sustentar o efeito.
- Movimento reduzido mostra a fotografia sem animação; modo normal mantém a lente aprovada.

## Rolagem e composição

useSceneProgress usa IntersectionObserver para limitar trabalho às cenas próximas, requestAnimationFrame para agrupar atualizações e ResizeObserver para verificar espaço. Escritas de ajuste são adiadas ao próximo quadro para evitar ciclo de resize. Remover observadores, eventos e frames ao desmontar. Sem scroll hijacking.

Ensaios: fotos grandes, legenda atravessando a borda inferior, alternância esquerda/direita. Imagem reduz escala de 1,1 para 1 e muda enquadramento de 42% para 50%; chegada abre o recorte lateral. Em altura ≥700 px e movimento normal: seção mínima 125svh, palco sticky a 4svh. Conteúdo alto ou foco de teclado libera o palco para fluxo normal. Sem capa: texto e link, sem placeholder vazio artificial.

Desktop ≥900 px: 12 colunas; imagem ocupa 1–9, legenda 9–12, espelhadas no próximo ensaio; foto até 78svh. Mobile: imagem até 65svh; legenda sobe 2rem sobre a borda com fundo sólido. Mesa de fotos: quatro colunas desktop, duas mobile, itens pares deslocados 2rem. Não colocar numeração ou categorias ornamentais embaixo das miniaturas.

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
