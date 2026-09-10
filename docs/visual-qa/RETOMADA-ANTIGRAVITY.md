# Retomada — experiência imersiva Punctum

Branch: `feat/immersive-lens-mobile`. Base: `b22a93bef189f5f73211b9263e9c0700f231ea1b`.

## O que já está implementado

- `LensHero`: abertura da lente na variante existente `cinematic`, usando imagem e textos configurados no Studio. Sem schema novo ou mudança de API.
- `StorySequence`: modo Percorrer de FeaturedStories com fotos grandes, composições alternadas, enquadramento por scroll e legendas em repouso. Modos Grade e Composição preservados.
- `useSceneProgress`: observação de cenas, uma atualização por quadro, desmontagem e movimento reduzido.
- `immersive.css`: integração escopada à home; controles de tamanho confortável, legendas naturais, sem números ornamentais; WhatsApp com safe area e ocultação durante diálogo/campos focados.
- SpatialCarousel continua sendo o cilindro 3D original. Melhorias de Pointer Events distinguem scroll vertical de giro horizontal, tratam cancelamento e oferecem botões acessíveis.
- Defaults editoriais mais diretos, citação do print fornecido de Maria, Instrument Serif + Manrope e modo roxo escuro. Configuração publicada tem precedência; não sobrescrever D1 para aplicar defaults.

## Próximas verificações obrigatórias

1. Revalidar o candidato após novas mudanças. Typecheck passou; 30 testes em quatro suites passaram; lint focado sem erros (warnings existentes de img); build passou. A rodada final de build está registrada no Director.
2. Abrir home real, confirmar se a configuração ativa usa hero `cinematic`, reel `horizontal` e ensaios habilitados. Não forçar outras variantes sem analisar configuração.
3. Validar 320/390/430px e desktop, rolagem reversa, skip da lente, navegação aos ensaios, giro/toque/cancelamento do carrossel, foco e dialog/WhatsApp.
4. Revisar tamanho de texto, fotos reais, enquadramento e sobreposição. Sticky não pode prender legenda maior que a viewport. Telas baixas e movimento reduzido têm fluxo normal.
5. O mapa de progresso precisa refletir a altura visual real, inclusive barra do navegador móvel. Refinar conforme inspeção.
6. A autenticação GitHub local está ausente. Push tentado sem interação falhou; não assumir que esta branch existe no remoto.

## Restrições

Carrossel 3D original, câmera abrindo lente e mobile são inegociáveis. Não substituir por slider ou grade. Preservar API/Studio/D1/R2/contato/SEO. Não usar números decorativos, frases vagas ou citação inventada. O router frontend-director fornecido no handoff dirige a revisão. Não publicar em main automaticamente; preparar branch e evidências.

Estado: IN_PROGRESS. Isto é código de implementação em revisão, não aprovação visual final. A prévia antiga em 4188 é um protótipo separado e não prova integração. Servidor do checkout foi iniciado em 4190.

## Evidência obtida nesta sessão

- Home real respondeu HTTP 200 após aplicar as migrations existentes somente ao D1 LOCAL.
- Dados locais de exemplo tinham capas vazias: foram associadas à primeira imagem do próprio álbum somente no banco local, sem alterar migrations ou dados remotos.
- Inspeção em 390×844 e 1440×900: nenhuma rolagem horizontal na página; abertura da lente e hierarquia tipográfica renderizadas; fotografias da sequência carregadas.
- Seta direita girou o cilindro de 0 para -45 graus. Clique em Fé e Tradição abriu o diálogo; WhatsApp ficou oculto; fechamento devolveu foco ao botão da foto e restaurou o scroll do documento.
- Removida a citação fixa sem fonte “Não busco o momento perfeito...” da seção Sobre. Texto persistido no banco ainda pode conter redação antiga: revisar no Studio sem sobrescrever automaticamente.
- Cursor ornamental desativado na home; componente preservado nas outras páginas.
- Não foram realizados testes de toque em aparelho físico, auditoria de desempenho, avaliação integral de todas as variantes do CMS ou publicação.
