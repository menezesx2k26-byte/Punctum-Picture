# Punctum — implementação final

Implementação local concluída e revisada em 11/09/2026. Branch: feat/immersive-lens-mobile. Base: b22a93bef189f5f73211b9263e9c0700f231ea1b.

A prévia integrada é http://127.0.0.1:4190/ enquanto o servidor estiver ativo. A porta 4188 era um protótipo. Não houve deploy ou alteração do banco remoto. GitHub ainda sem autenticação nesta máquina: a branch não foi enviada.

Leia ESPECIFICACAO-FINAL.md para direção, comportamento, mobile e critérios de regressão. O código atual prevalece sobre o HTML histórico do pacote de referências.

## Implementado

- Abertura da lente vinculada à rolagem, usando imagem/textos configurados no Studio e opção de seguir diretamente às fotografias.
- Ensaios em escala grande, composição alternada, legenda sobre a borda e reenquadramento durante a rolagem. Grade e Composição preservadas.
- Carrossel cilíndrico 3D original, gestos por eixo, teclado, cancelamento e prevenção de clique após arraste.
- Visualizador nativo que restaura foco/scroll e oculta WhatsApp enquanto está aberto.
- Instrument Serif + Manrope e roxo escuro nos defaults. Remoção de numeração ornamental e redação genérica de referência.
- Miniaturas escalonadas, retrato com chegada discreta e contato com título animado; formulário estável.
- WhatsApp flutuante de 56 px com safe area; reduz movimento no rodapé, persistente e respeitando o sistema.
- Texto ampliado e composição alta recebem fluxo normal para não cortar conteúdo.

## Verificações concluídas

Typecheck, build completo e 83 testes unitários em 20 arquivos passaram. Lint completo do repositório: zero erros e três avisos de img do pipeline de mídia existente. Matriz renderizada: 320×568, 390×844, 430×932, 844×390 e 1440×900, sem overflow horizontal.

Em 320 px, lente animada e texto sem overflow; WhatsApp 56 px. A rolagem levou o progresso da lente de 0 a 0,811 e expandiu o recorte. Console sem erros na inspeção final. Em 390 px, texto a 200% coube sem corte; cabeçalho ficou acima do título e cenas altas saíram de sticky. O ajuste temporário de teste foi removido.

Reduzir movimento persistiu após reload. Arraste horizontal girou o cilindro sem abrir foto; arraste vertical não girou. Teclado interrompeu inércia. Foto abriu no diálogo; Escape fechou e restaurou o foco. WhatsApp ficou oculto no diálogo e nos campos focados. Ensaio Fé e Tradição abriu /ensaios/ritos-de-luz, com título e dez imagens. Formulário vazio bloqueou envio e focou o campo obrigatório; nenhum pedido real enviado.

## Limites honestos

Não houve teste em aparelho físico, medição de Core Web Vitals em produção, envio real do formulário ou auditoria de todas as variantes do Studio. Antes de publicar, conferir configuração ativa, destino do WhatsApp e capas dos álbuns. Dados locais de exemplo tinham capas vazias: a prévia associou a primeira imagem de cada álbum somente ao D1 local. Álbuns sem capa continuam navegáveis em apresentação textual.

Não forçar configurações sobre escolhas publicadas. Apenas a biografia genérica distribuída pelo código recebe atualização por igualdade exata; conteúdo autoral diferente é preservado e coberto por testes. Não executar deploy, migrations remotas ou push em main por inferência. Há automação de publicação no repositório. O bundle incremental requer o commit base no clone.
