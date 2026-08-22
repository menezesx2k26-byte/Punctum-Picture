# Decisões e itens UNSPECIFIED

| Item | Estado | Decisão mínima segura |
| --- | --- | --- |
| Brand assets e fotos finais | Definidos | acervo em `public/photos` e logo fornecida pela fotógrafa |
| Tagline, sobre e textos SEO finais | UNSPECIFIED | copy editorial provisória, editável no painel |
| WhatsApp, Instagram e e-mail | UNSPECIFIED | CTA externo só aparece quando configurado |
| E-mails autorizados no Access | UNSPECIFIED | Allow explícito para Maria Helena; nenhum acesso amplo |
| Provedor de identidade Access | UNSPECIFIED | One-time PIN por e-mail é a configuração mais simples |
| IDs reais dos bancos D1 | UNSPECIFIED | placeholders inválidos até provisionamento consciente |
| Recursos preview definitivos | UNSPECIFIED | bancos e buckets separados de produção |
| Retenção de contatos/LGPD | UNSPECIFIED | não apagar automaticamente; definir política antes de operar |
| Janela de purge físico dos originais | UNSPECIFIED | sem purge automático no MVP |
| Lighthouse real | UNSPECIFIED | medir com fotos finais e domínio ativo |
| Analytics | UNSPECIFIED | não implementar tracking no MVP |
| Focal point no painel | UNSPECIFIED | backend suporta; UI usa gravity auto até haver requisito |

## Decisões técnicas

- O domínio foi comprado na Hostinger, que permanece como registradora. A zona
  DNS autoritativa será Cloudflare para preservar CDN, SSL, Access e Custom
  Domain do Worker.
- O visual usa CSS modularizado por tokens no stylesheet global em vez de
  Tailwind/shadcn. Isso reduz dependências e mantém a estética editorial
  específica; não altera a arquitetura congelada.
- vinext fornece o app React/Vite com SSR no Worker. O deploy continua único.
- O acervo histórico em `public/photos` é associado ao D1 pelo seed idempotente;
  não existe catálogo público alternativo em código.
- Imagem `pending`, `failed`, deletada ou inexistente retorna 404 para não
  revelar estado interno.
- JPEG é o fallback negociado. A pipeline Cloudflare controla a codificação;
  o app não oferece parâmetro de progressividade ao cliente.
- A versão lógica da mídia é estável pelo estado imutável do objeto e combinação
  `imageId + preset`; alteração de original cria outro ID.
- A compatibility date é `2026-05-22`, a mais recente suportada pelo runtime
  local empacotado; avançar somente após atualizar e validar Workers SDK.
- Arquivamento é reversível por API/dados, embora a UI do MVP não exponha botão
  dedicado de desarquivar.
