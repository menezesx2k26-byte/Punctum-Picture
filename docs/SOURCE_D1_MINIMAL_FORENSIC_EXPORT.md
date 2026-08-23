# Punctum — export forense mínimo do D1 de origem

## Objetivo

Extrair **somente o banco D1 vivo** do Punctum hospedado no ChatGPT Sites para fechar a migração para a Cloudflare própria.

O R2 público/dinâmico já foi recuperado por outro fluxo. **Não exporte as fotografias novamente.**

## Regras obrigatórias

- SOMENTE LEITURA na origem.
- NÃO alterar código.
- NÃO salvar nova versão.
- NÃO publicar/deployar.
- NÃO alterar domínio, acesso, secrets ou bindings.
- NÃO executar migrations.
- NÃO restaurar versões do Studio na origem.
- NÃO escrever no D1 ou R2 gerenciado.
- Não colocar dados sensíveis no Git.

## Export preferencial

Se a interface do Sites permitir ler/exportar o D1 vivo, produza um único arquivo privado para download:

`punctum-source-d1-forensic.json`

Formato preferido:

```json
{
  "format": "punctum-source-d1-forensic-v1",
  "exportedAt": "ISO-8601",
  "tables": {
    "table_name": [
      { "all": "columns and values exactly as stored" }
    ]
  },
  "rowCounts": {},
  "sha256": "..."
}
```

Um dump SQL completo também é aceitável (`punctum-source-d1-forensic.sql`) se preservar todos os valores e metadados.

## Escopo: todas as tabelas

Liste primeiro as tabelas reais presentes no D1 e exporte **todas**, inclusive tabelas que não estejam nesta lista.

Tabelas conhecidas que precisam ser preservadas:

- `site_settings`
- `categories`
- `albums`
- `album_categories`
- `images`
- `upload_intents`
- `inquiries`
- `audit_log`
- `admin_credentials`
- `rate_limit_buckets`
- `backup_runs`
- `site_config`
- `site_config_versions`
- `site_config_pointers`
- tabela de migrations, se existir

Não filtre `deleted_at`: precisamos também das linhas em soft-delete.

## Prioridade máxima: histórico do Studio

A API administrativa já provou a existência destas três versões publicadas:

1. `site-published-initial`
   - `published_at`: `2026-08-23T00:10:09.239Z`
   - `published_by`: `system-bootstrap`
2. `5dff557e-aca6-4996-bd75-2ef5883f3808`
   - `published_at`: `2026-08-23T00:44:16.681Z`
3. `fc5af17d-56fa-41e8-94ab-021870eaad73`
   - `published_at`: `2026-08-23T01:28:27.155Z`
   - versão atual

Para `site_config_versions`, exporte **todas as colunas e todos os corpos `config_json`**, principalmente a versão intermediária `5dff557e-aca6-4996-bd75-2ef5883f3808`.

Também exporte a linha exata de `site_config_pointers` para preservar IDs e timestamps do draft/publicado.

## Uploads pendentes já investigados

Existem 7 linhas de imagem `pending`, todas ligadas ao álbum **Jogo do Grêmio** e criadas em 2026-08-13. As rotas autenticadas `thumb`, `card` e `gallery` retornam 404 para todas. Portanto, não é necessário tentar reconstruir bytes de mídia por este handoff; precisamos apenas dos registros exatos em `images` e `upload_intents`.

## Entrega

Entregar apenas:

1. arquivo JSON ou SQL do D1;
2. contagem de linhas por tabela;
3. SHA-256 do arquivo;
4. confirmação explícita de que nenhuma escrita/deploy/publicação ocorreu.

Não inclua R2, build, código-fonte ou node_modules no pacote.
