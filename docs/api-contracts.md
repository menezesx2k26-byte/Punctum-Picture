# Contratos da API

Todas as respostas JSON de erro seguem:

```json
{
  "error": {
    "code": "STRING_CONSTANT",
    "message": "Mensagem legível em pt-BR",
    "field": "campoOpcional",
    "requestId": "uuid"
  }
}
```

## Público

| Método e rota | Resultado |
| --- | --- |
| `GET /api/health` | estado do serviço |
| `GET /api/public/site` | configurações públicas |
| `GET /api/public/categories` | categorias visíveis |
| `GET /api/public/albums?category=&featured=&page=&limit=` | publicados paginados |
| `GET /api/public/albums/:slug` | ensaio e imagens prontas |
| `POST /api/public/inquiries` | cria contato |
| `GET /media/:imageId/:preset` | imagem transformada de álbum publicado |
| `GET /sitemap.xml` / `GET /robots.txt` | descoberta SEO |

Inquiry aceita `name`, `email`, `phone`, `instagram`, `service`,
`desiredDate`, `message` e o honeypot `website`. Sucesso retorna `201` com
`inquiryId`. Um honeypot preenchido recebe o mesmo formato de sucesso, sem
persistência.

## Admin

| Área | Rotas |
| --- | --- |
| sessão | `GET /admin/api/me` |
| álbuns | `GET/POST /admin/api/albums`; `GET/PATCH/DELETE /admin/api/albums/:id` |
| estado | `POST .../:id/publish`; `POST .../:id/archive` |
| fotos | `POST .../:id/reorder`; `POST .../:id/cover`; `PATCH/DELETE /admin/api/images/:id` |
| upload | `POST /admin/api/uploads/intents`; `POST /admin/api/uploads/:intentId/complete` |
| categorias | `GET/POST /admin/api/categories`; `PATCH/DELETE .../:id` |
| site | `GET/PATCH /admin/api/settings` |
| contatos | `GET /admin/api/inquiries`; `PATCH .../:id` |
| preview de mídia | `GET /admin/media/:imageId/:preset` |

## Upload

### Criar intent

```json
{
  "albumId": "uuid",
  "filename": "foto-01.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 18493822
}
```

`201` retorna `intentId`, `imageId`, `objectKey`, `uploadUrl`, `expiresAt` e
`requiredHeaders`. O PUT usa exatamente o `Content-Type` indicado e passa por
um endpoint autenticado do Worker, que grava no binding R2.

### Finalizar

```json
{
  "etag": "opcional",
  "clientChecksum": "opcional"
}
```

O servidor confere existência, tamanho e tipo do objeto antes de marcar a imagem
como `ready`. Repetir uma intent completa retorna conflito.

## Códigos relevantes

- `400`: validação, MIME, tamanho ou preset inválido.
- `403`: Access ausente/inválido ou Origin recusada.
- `404`: recurso não encontrado ou imagem não publicável.
- `409`: conflito de estado, intent ou checklist.
- `429`: rate limit.

Respostas administrativas usam `Cache-Control: no-store`.
