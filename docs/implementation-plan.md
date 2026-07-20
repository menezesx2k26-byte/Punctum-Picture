# Plano de implementação

```mermaid
timeline
  title Punctum Picture MVP
  Etapa 1 : Base do projeto
  Etapa 2 : D1 schema e migrations
  Etapa 3 : Site público premium
  Etapa 4 : Cloudflare Access e segurança
  Etapa 5 : CRUD de ensaios e categorias
  Etapa 6 : Upload multiarquivo para R2
  Etapa 7 : Reorder, capa e alt text
  Etapa 8 : /media, formulário e settings
  Etapa 9 : Testes, backup, QA e deploy final
```

## Estado

- Etapas 1–8: implementadas no código.
- Etapa 9: automação e documentação implementadas; QA manual com conteúdo real,
  provisionamento Cloudflare e troca de DNS permanecem operacionais.

Cada etapa está separada por módulos e migrations, permitindo revisão e rollback
de código sem misturar dados.
