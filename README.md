# Punctum Picture

MVP do portfólio de fotografia da Punctum Picture. O projeto reúne site
público, painel administrativo e API em um único Cloudflare Worker, com D1 para
metadados, R2 para originais privados, Image Transformations para entrega e
Cloudflare Access protegendo todo o `/admin/*`.

## O que está incluído

- Home editorial, portfólio, página de ensaio e contato em pt-BR.
- Painel responsivo para ensaios, categorias, configurações e contatos.
- Upload direto ao R2 por URL assinada, três arquivos em paralelo, progresso
  individual/total e repetição isolada de falha.
- Rascunho, publicação, arquivamento, soft delete, capa, alt text e ordenação.
- Presets fixos de imagem, negociação AVIF/WebP/JPEG, sitemap, robots e JSON-LD.
- Access JWT validado também no Worker, proteção de Origin, rate limit,
  honeypot, CSP, auditoria e respostas admin `no-store`.
- Snapshot lógico agendado no R2 e limpeza horária de uploads órfãos.

## Requisitos

- Node.js 22.13 ou superior.
- Conta Cloudflare com Workers, D1, R2, Images e Zero Trust.
- Wrangler autenticado (`npx wrangler login`) ou token via ambiente.

## Desenvolvimento local

```bash
npm ci
npm run db:migrate:local
npm run dev
```

Abra `http://localhost:3000`. O bypass de Access funciona somente quando
`ENVIRONMENT=local` e o hostname é `localhost` ou `127.0.0.1`.

Para simular o build:

```bash
npm run build
npm run preview
```

## Configuração Cloudflare

1. Crie os bancos `punctum-picture` e `punctum-picture-preview`.
2. Crie os buckets privados de originais e backups para produção e preview.
3. Substitua os IDs marcados no `wrangler.jsonc`.
4. Aplique `config/r2-cors.json` ao bucket de originais.
5. Cadastre os segredos listados em `.env.example` com `wrangler secret put`.
6. Aplique as migrations remotas.
7. Crie no Access uma aplicação self-hosted para
   `punctumpicture.com/admin/*` e uma regra Allow para o e-mail da Maria Helena.
8. Preencha `CLOUDFLARE_TEAM_DOMAIN` e `CLOUDFLARE_ACCESS_AUD`.

```bash
npm run db:migrate:remote
npm run deploy
```

O domínio permanece registrado na Hostinger, mas usa a Cloudflare como DNS
autoritativo. O procedimento seguro está em
[`docs/deploy-hostinger-cloudflare.md`](docs/deploy-hostinger-cloudflare.md).

## Qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

A suíte roda handlers reais em Miniflare com D1 e R2 isolados. O entrypoint de
teste exclui apenas os módulos virtuais do vinext, gerados exclusivamente no
build.

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | ambiente local com HMR |
| `npm run build` | build Worker + assets |
| `npm run preview` | servidor do build |
| `npm run deploy` | build e deploy padrão |
| `npm test` / `npm run test:watch` | testes |
| `npm run typecheck` / `npm run lint` | validação estática |
| `npm run db:migrate:local` | migrations locais |
| `npm run db:migrate:remote` | migrations de produção |
| `npm run backup:d1` | export SQL manual |
| `npm run restore:d1` | restore do export |

## Conteúdo provisório

As cinco fotos em `public/demo` são placeholders de demonstração do Unsplash.
Antes da abertura pública, substitua-as pelas imagens e brand assets fornecidos
pela Maria Helena e complete os valores `UNSPECIFIED` registrados em
[`docs/decisions.md`](docs/decisions.md).

## Documentação

- [Arquitetura](docs/architecture.md)
- [Fluxos do painel](docs/panel-flows.md)
- [Páginas públicas](docs/public-pages.md)
- [Contratos da API](docs/api-contracts.md)
- [Segurança](docs/security.md)
- [QA](docs/qa-checklist.md)
- [Backup e restore](docs/backup-restore.md)
- [Decisões e pendências](docs/decisions.md)
- [Opções de custo](docs/cost-options.md)
- [Plano de implementação](docs/implementation-plan.md)
