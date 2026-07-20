# Domínio Hostinger + Cloudflare

O domínio `punctumpicture.com` continua comprado e renovado na Hostinger. Como o
Worker é a origem e Access/CDN fazem parte da arquitetura, a Cloudflare precisa
ser o DNS autoritativo.

## 1. Preparar a zona

1. Adicionar `punctumpicture.com` à conta Cloudflare existente.
2. Revisar todos os registros importados, especialmente MX, SPF, DKIM e DMARC.
3. Se DNSSEC estiver ativo na Hostinger, desativá-lo antes da troca e reativar
   pela Cloudflare depois que a zona estiver ativa.
4. Copiar os dois nameservers exclusivos mostrados pela Cloudflare.

## 2. Alterar na Hostinger

No hPanel: **Domínios → Portfólio de domínios → Gerenciar → DNS /
Nameservers**. Substituir os nameservers atuais pelos dois valores exatos da
Cloudflare. Não usar valores de exemplo.

A partir da propagação, registros DNS passam a ser editados na Cloudflare, não
na Hostinger. A compra/renovação continua na Hostinger. Não remover registros de
e-mail durante a migração.

## 3. Associar ao Worker

Depois de a zona ficar “Active”:

1. Fazer deploy do Worker e aplicar migrations.
2. Adicionar Custom Domain `punctumpicture.com` ao Worker.
3. Adicionar `www.punctumpicture.com`; o código redireciona para o apex.
4. Criar a aplicação Access para `punctumpicture.com/admin/*` e também cobrir
   `/admin`.
5. Testar público em janela anônima e admin com/sem autenticação.

O `wrangler.jsonc` já declara os Custom Domains. A Cloudflare cria os registros
e certificados correspondentes quando o deploy ocorre em uma zona ativa.

## 4. Verificação

```bash
nslookup -type=ns punctumpicture.com
curl -I https://punctumpicture.com
curl -I https://www.punctumpicture.com
```

Confirmar HTTPS, redirect 308 de `www`, `Cache-Control` em `/media/*`, bloqueio
Access em `/admin` e funcionamento do e-mail.

Propagação pode levar até 24 horas. Durante a troca, manter o endpoint temporário
do deploy disponível para validação.
