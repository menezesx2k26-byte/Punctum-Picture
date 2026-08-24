# Punctum Picture

MVP do portfólio de fotografia da Punctum Picture. O projeto reúne site
público, painel administrativo e API em um único Cloudflare Worker, com D1 para
metadados, R2 para originais privados, Image Transformations para entrega e
duas formas atuais de autenticação administrativa: sessão própria por senha e
Cloudflare Access como fallback validado pelo Worker.

## O que está incluído

- Home editorial, portfólio, página de ensaio e contato em pt-BR.
- Painel responsivo para ensaios, categorias, configurações e contatos.
- Upload ao R2 por endpoint autenticado do Worker, três arquivos em paralelo, progresso
  individual/total e repetição isolada de falha.
- Rascunho, publicação, arquivamento, soft delete, capa, alt text e ordenação.
- Presets fixos de imagem, negociação AVIF/WebP/JPEG, sitemap, robots e JSON-LD.
- Sessão administrativa assinada ou Access JWT validado no Worker, proteção de Origin, rate limit,
  honeypot, CSP, auditoria e respostas admin `no-store`.
- Snapshot lógico agendado no R2 e limpeza horária de uploads órfãos.

## Identidade visual pública

- `public/logo-punctum.png` preserva a arte original recebida.
- `public/logo-punctum-transparent.png` é a versão com alfa usada no cabeçalho.
- `public/favicon.svg` reduz a câmera e a espiral da marca para leitura em abas e atalhos.
- As referências públicas ficam centralizadas em `app/lib/public-visuals.ts` e
  `app/lib/metadata.ts`.

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

## Configuração e deploy Cloudflare

1. Crie os bancos `punctum-picture` e `punctum-picture-preview`.
2. Crie os buckets privados de originais e backups para produção e preview.
3. Confirme o `account_id` e os IDs D1 do ambiente em `wrangler.jsonc`.
4. Aplique `config/r2-cors.json` ao bucket de originais.
5. Cadastre os segredos listados em `.env.example` com `wrangler secret put`.
6. Aplique as migrations remotas.
7. Crie no Access uma aplicação self-hosted para
   `punctumpicture.com/admin/*` e uma regra Allow para o e-mail da Maria Helena.
8. Preencha `CLOUDFLARE_TEAM_DOMAIN` e `CLOUDFLARE_ACCESS_AUD`.

Quando um commit com alterações da aplicação chega à `main`, o workflow
`.github/workflows/cloudflare-git-main.yml` executa instalação, typecheck, lint,
build, testes, resolução do D1, deploy e smoke test de produção. O resultado
sanitizado é registrado em `requests/cloudflare-git-deploy-result.json`.

Para publicar manualmente a mesma configuração de produção:

```bash
npx wrangler whoami
npm run typecheck
npm run lint
npm test
npm run deploy
```

Execute `npm run db:migrate:remote` separadamente apenas quando houver migrations
novas revisadas. O deploy padrão preserva os segredos cadastrados no Worker.

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
| `npm run deploy` | build e deploy manual de produção |
| `npm test` / `npm run test:watch` | testes |
| `npm run typecheck` / `npm run lint` | validação estática |
| `npm run db:migrate:local` | migrations locais |
| `npm run db:migrate:remote` | migrations de produção |
| `npm run backup:d1` | export SQL manual |
| `npm run restore:d1` | restore do export |

## Conteúdo e fonte de verdade

Álbuns, categorias e imagens publicados vêm exclusivamente do D1. Os assets em
`public/photos` são originais históricos do acervo e também podem ser
referenciados pelo seed idempotente; `app/lib/portfolio.ts` mantém apenas uma
seleção editorial de IDs para o carrossel, validada contra o estado publicado.
Settings públicos possuem defaults centralizados e são substituídos pelos
valores administrados em `site_settings`.

## Migrations

`migrations/` é a trilha canônica aplicada pelo Wrangler e empacotada para
Sites. `drizzle-kit generate` escreve diffs de revisão em
`.drizzle-generated/`; depois de revisado, o SQL deve ser promovido para o
próximo arquivo imutável em `migrations/`. A pasta `drizzle/` permanece somente
como histórico legado e não deve receber migrations novas.

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
