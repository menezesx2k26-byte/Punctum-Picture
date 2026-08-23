# Migração do Punctum para Cloudflare própria

Estado: **destino isolado provisionado em `workers.dev`, sem cutover**.

## Regra de ouro: migrar primeiro, redesenhar depois

A migração deve alcançar **100% de paridade de estado** com o `punctumpicture.com` atual antes de qualquer aplicação, reconstrução ou refinamento visual no site público.

Enquanto a paridade não estiver comprovada:

- não aplicar o visual atual do Studio ao site público por código;
- não reconstruir manualmente presets, tipografia, variantes ou conteúdo do Studio;
- não alterar a direção visual para "aproximar" o destino da produção;
- tratar diferenças visuais como sinal de estado ainda não migrado, não como tarefa de redesign.

Somente após D1, R2, Studio, histórico, admin e conteúdo estarem integralmente migrados e auditados é que a etapa visual poderá começar.

## Regras de segurança

- O domínio `punctumpicture.com` permanece no ChatGPT Sites até validação completa.
- Nenhum deploy de produção é automático.
- Produção exige confirmação explícita no workflow.
- O destino de migração permanece em `workers.dev`, sem custom domain.
- D1, R2 e secrets da nova conta devem ser validados antes de qualquer troca de DNS.
- O visual do Studio não será aplicado ao site público antes da paridade integral do estado de produção.

## Fonte atual

- Código: GitHub (`main`).
- Hosting atual: ChatGPT Sites, project id registrado em `.openai/hosting.json`.
- Estado persistente atual: D1 + R2 gerenciados pelo Sites.
- Produção auditada em `punctumpicture.com`.

## Destino atual

Cloudflare própria com:

- Worker isolado `punctum-picture-migration` em `workers.dev`;
- D1 `punctum-picture`;
- R2 `punctum-picture-originals`;
- R2 `punctum-picture-backups`;
- Images binding;
- sem custom domain;
- sem cutover.

O build, typecheck, lint e testes passaram antes do deploy isolado.

## Baseline de paridade observada

A auditoria entre produção e destino mostrou que o código/runtime está funcional, mas o estado vivo ainda não foi migrado por completo.

Produção atual:

- 16 álbuns publicados;
- 192 fotografias públicas;
- 7 categorias;
- configuração publicada do Studio diferente dos defaults das migrations.

Destino isolado atual:

- 13 álbuns publicados;
- 112 fotografias públicas;
- 7 categorias;
- configuração do Studio ainda baseada no estado/default inicial.

Portanto ainda faltam, no mínimo, os dados criados no ambiente administrado após o seed inicial, além de histórico/drafts e objetos R2 associados.

## Credenciais de migração

Princípio de menor privilégio:

- `CLOUDFLARE_API_TOKEN`: Worker + R2, usado pelo Wrangler.
- `CLOUDFLARE_D1_API_TOKEN`: token dedicado ao D1, com apenas `Account -> D1 -> Edit`, usado pela REST API oficial.
- `CLOUDFLARE_ACCOUNT_ID`: identificador da conta de destino.

Os workflows nunca gravam os valores dos tokens no repositório e os resultados persistidos são sanitizados.

## Sequência bloqueante

1. Validar tokens/API da Cloudflare de destino. **Concluído.**
2. Criar recursos isolados na Cloudflare própria. **Concluído.**
3. Aplicar migrations, build/test e deploy em `workers.dev`. **Concluído.**
4. Extrair e migrar **todo o D1 vivo** do ChatGPT Sites, incluindo settings, admin data, inquiries, audit, Studio draft/published, ponteiros e `site_config_versions`.
5. Extrair e migrar **todo o R2 vivo**, incluindo originals e qualquer objeto não versionado no Git.
6. Recriar secrets administrativos sem versioná-los.
7. Validar paridade de contagens, registros críticos, URLs de mídia, Studio publicado, draft e histórico.
8. Validar `/acesso`, `/admin`, todos os painéis, Studio, upload, contatos, backups e crons.
9. Rodar auditoria pública e exigir paridade do estado antes de qualquer redesign.
10. Fazer último sync de dados.
11. Somente depois liberar a etapa de aplicação/refinamento visual do Studio no site público.
12. Criar/ajustar recursos finais de produção e virar DNS/domínio apenas com autorização explícita.
13. Validar SSL e produção.
14. Só depois retirar o ChatGPT Site do ar.
