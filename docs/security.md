# Segurança

## Controles implementados

- O Worker protege páginas, API e mídia sob `/admin/*` aceitando sessão própria
  assinada ou JWT válido do Cloudflare Access.
- O Worker valida `cf-access-jwt-assertion` com JWKS remoto, issuer e audience.
- Mutações admin exigem `Origin` igual a `SITE_ORIGIN`.
- D1 guarda somente metadados; R2 permanece privado.
- Originais não têm URL pública, nome original nem parâmetros de transformação.
- `/media/*` exige imagem pronta em álbum publicado; `/admin/media/*` permite
  preview de conteúdo não publicado somente após autenticação administrativa.
- Presets de imagem são allowlist fechada.
- MIME e tamanho são validados no cliente, intent e finalização.
- URL assinada expira em 15 minutos e inclui `Content-Type`.
- Rate limit persistido no D1 para contato e mutações sensíveis.
- Honeypot evita confirmação distinguível para bots.
- Zod aplica limites e rejeita campos extras nos payloads.
- Soft delete, auditoria e timestamps UTC.
- CSP, `frame-ancestors 'none'`, `nosniff`, política de referrer e permissões.
- Stack traces e segredos não são enviados ao cliente.

## Configuração obrigatória

Segredos entram somente por `wrangler secret put` ou cofre do CI:

- `CLOUDFLARE_TEAM_DOMAIN`
- `CLOUDFLARE_ACCESS_AUD`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `ADMIN_ALLOWED_EMAILS`
- `ADMIN_PASSWORD_HASH` (fallback inicial até existir credencial no D1)
- `ADMIN_SESSION_SECRET`

Não versionar `.dev.vars`, tokens ou credenciais R2. Limitar o token de CI aos
recursos do projeto.

## Access

Criar aplicação self-hosted para `punctumpicture.com/admin/*` e Allow somente
para identidades aprovadas. O path `/admin` sem barra também deve ser incluído
ou coberto por uma segunda regra. O JWT continua sendo validado no Worker para
proteger contra roteamento incorreto. A policy efetiva do Zero Trust não pode
ser inferida pelo repositório e requer inspeção remota antes de remover ou
consolidar qualquer mecanismo.

## Riscos residuais

- `npm audit --omit=dev` está limpo. O audit completo ainda aponta quatro
  avisos moderados no loader antigo empacotado pelo `drizzle-kit`; ele roda
  somente no terminal de desenvolvimento. O “fix --force” propõe downgrade
  quebrado e não foi aplicado.
- Rate limit em D1 é suficiente para o MVP, mas não é uma barreira anti-DDoS;
  regras WAF podem ser adicionadas sem mudar o app.
- O restore precisa ser ensaiado; possuir backup não prova recuperabilidade.
- Dados de contato são pessoais. Definir prazo de retenção e processo de
  exclusão antes de operação real.
