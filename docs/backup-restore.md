# Backup e restore

## Export manual do D1

```bash
npx wrangler d1 export punctum-picture --remote --output=./backups/database.sql
```

## Restore manual

Restaurar primeiro em preview e validar:

```bash
npx wrangler d1 execute punctum-picture-preview --remote --file=./backups/database.sql
```

Após aprovação, executar no banco correto:

```bash
npx wrangler d1 execute punctum-picture --remote --file=./backups/database.sql
```

## Time Travel

Consultar o bookmark disponível antes de restaurar:

```bash
npx wrangler d1 time-travel info punctum-picture
npx wrangler d1 time-travel restore punctum-picture --bookmark=BOOKMARK
```

Confirmar a sintaxe na versão instalada do Wrangler com `--help`; nunca testar
restore diretamente em produção.

## Automação

O cron `0 3 * * *` cria snapshot lógico JSON das tabelas no binding `BACKUPS`:

- diário: retenção de 7 dias;
- domingo: retenção de 4 semanas;
- primeiro dia do mês: retenção de 6 meses.

O mesmo arquivo pode pertencer a mais de uma classe; a limpeza preserva a maior
janela aplicável. Cada execução entra em `backup_runs`.

O cron `0 * * * *` expira intents, remove objetos de uploads órfãos elegíveis e
limpa buckets antigos de rate limit. Teste local:

```bash
npx wrangler dev --test-scheduled
curl "http://localhost:8787/__scheduled?cron=0+3+*+*+*"
```

## Originais

Originais nunca são sobrescritos. Soft delete não remove imediatamente o
objeto. A exclusão física definitiva e sua janela são `UNSPECIFIED`; a decisão
mínima segura é não executar purge automático no MVP.

## Ensaio de recuperação

Trimestralmente: exportar, restaurar em preview, aplicar migrations, comparar
contagens por tabela, abrir três álbuns e registrar tempo de recuperação.
