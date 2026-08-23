# Migração do Punctum para Cloudflare própria

Estado: **preparação, sem cutover**.

## Regras de segurança

- O domínio `punctumpicture.com` permanece no ChatGPT Sites até validação completa.
- Nenhum deploy de produção é automático.
- Produção exige confirmação explícita no workflow.
- Primeiro destino: Worker de preview em `workers.dev`, sem custom domain.
- D1, R2 e secrets da nova conta devem ser validados antes de qualquer troca de DNS.

## Fonte atual

- Código: GitHub (`main`).
- Hosting atual: ChatGPT Sites, project id registrado em `.openai/hosting.json`.
- Estado persistente atual: D1 + R2 gerenciados pelo Sites.

## Destino

Cloudflare própria com:

- Worker `punctum-picture`;
- D1 `punctum-picture`;
- R2 `punctum-picture-originals`;
- R2 `punctum-picture-backups`;
- Images binding;
- cron triggers;
- secrets administrativos;
- domínio somente no cutover final.

## Credenciais de migração

Princípio de menor privilégio:

- `CLOUDFLARE_API_TOKEN`: Worker + R2, usado pelo Wrangler.
- `CLOUDFLARE_D1_API_TOKEN`: token dedicado ao D1, com apenas `Account -> D1 -> Edit`, usado pela REST API oficial.
- `CLOUDFLARE_ACCOUNT_ID`: identificador da conta de destino.

Os workflows nunca gravam os valores dos tokens no repositório e os resultados persistidos são sanitizados.

## Sequência

1. Validar tokens/API da Cloudflare de destino.
2. Criar recursos de preview na Cloudflare própria.
3. Aplicar migrations e deploy em `workers.dev`.
4. Migrar D1 do ChatGPT Sites.
5. Migrar objetos do R2 do ChatGPT Sites.
6. Recriar secrets sem versioná-los.
7. Validar site público, `/acesso`, `/admin`, Studio, upload, contatos e backups.
8. Criar recursos finais de produção.
9. Fazer último sync de dados.
10. Virar DNS/domínio.
11. Validar SSL e produção.
12. Só depois retirar o ChatGPT Site do ar.
