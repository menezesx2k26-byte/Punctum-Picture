# Opções de custo

Valores são referências do briefing, não cotação nem garantia.

## A — Cloudflare-first (implementada e recomendada)

Aproximadamente US$ 0 a US$ 5/mês em cenário pequeno. Workers, CDN, Access, D1,
R2 e transforms ficam no mesmo ecossistema, reduzindo integração e operação.
Uso excedente, Images e planos contratados podem alterar o total.

## B — Netlify + S3 (não implementada)

Baseline citado de cerca de US$ 0,23/mês para 10 GB no S3, além de custos
variáveis de credits, requests, egress e transformações. Para este caso, tende
a ser mais fragmentada e menos previsível.

## C — Vercel + S3 (não implementada)

Mesmo baseline citado de cerca de US$ 0,23/mês para 10 GB no S3, com bandwidth,
image optimization e compute variáveis. Também tende a ser mais fragmentada e
menos previsível.

Antes de produção, conferir preços atuais nos fornecedores e configurar alertas
de uso na Cloudflare. Nenhuma variante B/C faz parte do código.
