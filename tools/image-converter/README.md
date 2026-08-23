# Punctum Image Converter

Ferramenta estática e sem dependências para converter imagens localmente no navegador.

## Objetivo

Evitar o fluxo lento de converter imagens manualmente para Base64 antes de decidir formato, resolução e compressão.

A ferramenta:

- aceita JPEG, PNG e WebP;
- exporta JPEG ou WebP;
- redimensiona preservando proporção;
- permite escolher qualidade;
- mostra tamanho antes/depois;
- calcula SHA-256 do resultado;
- gera Base64 somente sob demanda;
- não envia a imagem para servidor nenhum.

## Uso

Abra `tools/image-converter/index.html` diretamente no navegador.

1. Arraste ou escolha uma imagem.
2. Selecione WebP ou JPEG.
3. Defina qualidade e o maior lado em pixels.
4. Clique em **Converter**.
5. Baixe o resultado.
6. Use **Gerar Base64** apenas quando algum fluxo realmente exigir Base64.

## Padrão recomendado para web

- WebP
- qualidade 84%
- maior lado 2048 px

A ferramenta está isolada em `tools/image-converter/` e não interfere no frontend público nem no build do Punctum.
