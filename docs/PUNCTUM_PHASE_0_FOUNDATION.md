# Punctum Picture — Fase 0: Fundação e fontes de verdade

Data: 22 de agosto de 2026  
Escopo: saneamento local de conteúdo, settings, SEO, migrations, autenticação,
mídia e testes  
Fora do escopo: Punctum Studio, editor visual, temas, tokens editáveis,
sections, variants, presets, preview e draft/publish de configuração

## 1. Problemas encontrados

1. `app/lib/portfolio.ts` repetia o catálogo persistido no D1. Componentes
   públicos iniciavam com essa cópia e substituíam parte dela após hidratação.
2. Um álbum arquivado ou removido do D1 podia sobreviver visualmente pelo
   fallback estático; uma página de ensaio inexistente também recebia conteúdo
   inventado de outro álbum.
3. Metadata de ensaio lia somente o catálogo estático e ignorava `seo_title`,
   `seo_description`, capa e status reais.
4. `site_settings` armazenava oito campos públicos, mas quase todo o renderer
   ignorava esses valores. `brand_name` não era editável nem salvo no painel.
5. `/media/:id/:preset` validava a imagem, mas não o status do álbum. Uma
   imagem pronta de rascunho podia ser obtida por ID.
6. `/arquivo` não constava no sitemap.
7. `--line-admin` era usado sem declaração e a regra visual do carrossel usava
   `.carousel-slide`, enquanto o componente renderiza `.photo-carousel-slide`.
8. `migrations/` e `drizzle/` formavam duas histórias diferentes. Wrangler e a
   documentação apontavam para `migrations/`, enquanto o empacotamento de Sites
   copiava `drizzle/`.
9. A documentação descrevia Access-only e upload presigned, mas o código possui
   sessão própria por senha e upload intermediado pelo Worker.

## 2. Decisões tomadas

- O D1 é a única fonte de verdade do conteúdo publicado.
- API pública e Server Components usam as mesmas funções de consulta em
  `shared/public-content.ts`.
- Não existe fallback de álbum. Falha/ausência no D1 resulta em lista vazia ou
  404, nunca na ressurreição do catálogo estático.
- `app/lib/portfolio.ts` permanece apenas como curadoria editorial do carrossel:
  uma lista de IDs. Cada ID de álbum precisa ser resolvido como publicado no D1.
  A fotografia local de Maria Helena continua como asset editorial da home.
- Defaults de settings ficam centralizados em `SITE_DEFAULTS`. Valores
  persistidos e não vazios têm precedência; seeds `UNSPECIFIED` são tratados
  como ausência.
- Metadata global e de ensaio é construída por funções puras testáveis.
- Mídia pública e mídia de admin usam rotas e políticas distintas.
- `migrations/` é a fonte canônica daqui para frente. `drizzle/` fica congelada
  como histórico legado; não foi apagada nem reescrita.
- Nenhum mecanismo de autenticação foi removido nesta fase.

## 3. Arquivos alterados

### Fonte pública e renderização

- `shared/public-content.ts`
- `app/lib/server-content.ts`
- `app/lib/metadata.ts`
- `app/lib/portfolio.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/portfolio/page.tsx`
- `app/arquivo/page.tsx`
- `app/contato/page.tsx`
- `app/ensaios/[slug]/page.tsx`
- `app/components/FeaturedStories.tsx`
- `app/components/PortfolioGrid.tsx`
- `app/components/ArchiveGrid.tsx`
- `app/components/LiveAlbum.tsx`
- `app/components/PublicStats.tsx`
- `app/components/SiteChrome.tsx`
- `app/components/WhatsAppLink.tsx`
- `app/components/ContactForm.tsx`
- `app/components/PhotoCarousel.tsx`

### Admin, Worker e segurança

- `app/admin/components/SettingsManager.tsx`
- `app/admin/components/AlbumEditor.tsx`
- `worker/api/public.ts`
- `worker/api/admin.ts`
- `worker/media/serve.ts`
- `worker/index.ts`
- `worker/test-entry.ts`
- `worker/seo.ts`
- `worker/utils/validation.ts`
- `app/globals.css`

### Migrations, build, testes e documentação

- `migrations/0005_foundation_reconcile.sql`
- `drizzle.config.ts`
- `build/sites-vite-plugin.ts`
- `.gitignore`
- `tests/unit/portfolio.spec.ts`
- `tests/unit/public-content.spec.ts`
- `tests/integration/worker.spec.ts`
- `README.md`
- `docs/architecture.md`
- `docs/panel-flows.md`
- `docs/security.md`
- `docs/api-contracts.md`
- `docs/public-pages.md`
- `docs/decisions.md`
- este documento

## 4. Fonte de verdade final de conteúdo

```text
Admin
  -> tabelas albums/images/categories/album_categories no D1
  -> shared/public-content.ts aplica status, soft delete e capa pronta
  -> Server Components e API pública usam o mesmo resultado
  -> componentes públicos recebem dados canônicos
```

Regras públicas:

- álbum: `status = 'published'`, `deleted_at IS NULL` e capa pronta pertencente
  ao próprio álbum;
- imagem: `status = 'ready'`, `deleted_at IS NULL` e álbum publicado;
- categoria: somente categorias visíveis são expostas;
- ensaio ausente, draft ou archived: 404 na API e `notFound()` na página;
- metadata: os mesmos dados do ensaio renderizado.

O seed histórico continua materializando as 113 imagens no D1. O código React
não contém mais os 13 álbuns como banco alternativo.

## 5. Fluxo final de settings

```text
SettingsManager
  -> PATCH /admin/api/settings
  -> site_settings (D1)
  -> shared/public-content.ts + defaults centralizados
  -> Server Components / generateMetadata / API pública
```

Superfícies conectadas:

| Campo | Superfícies |
| --- | --- |
| `brandName` | formulário/save, header acessível, footer, metadata global e Open Graph |
| `tagline` | footer |
| `aboutText` | seção Sobre da home |
| `whatsappE164` / `whatsappMessage` | CTA inline e botão flutuante, resolvidos no servidor |
| `instagramUrl` | footer e JSON-LD quando configurado |
| `contactEmail` | footer e JSON-LD quando configurado |
| `seoTitle` / `seoDescription` | metadata global, Open Graph, Twitter e JSON-LD |

O update administrativo cria a linha default caso uma instalação ainda não
tenha `site_settings.id = 1`. Não foi criado `SiteConfig`.

## 6. Fluxo SSR/client

As leituras pós-hidratação foram removidas de:

- `FeaturedStories.tsx`;
- `PortfolioGrid.tsx`;
- `ArchiveGrid.tsx`;
- `LiveAlbum.tsx`;
- `PublicStats.tsx`;
- `WhatsAppLink.tsx`.

O app usa `cloudflare:workers` para acessar o binding D1 durante renderização no
Worker. `React.cache` deduplica as mesmas consultas dentro de uma renderização.
`FeaturedStories`, `LiveAlbum` e stats são server-first. `PortfolioGrid` e
`ArchiveGrid` continuam Client Components apenas porque filtros e lightbox
exigem estado de interface; seus dados iniciais e canônicos chegam do servidor.

Fetch client-side público que permanece:

- `ContactForm`: `POST` de uma ação do visitante, não leitura de conteúdo.

O admin continua client-side por ser uma aplicação autenticada e interativa.

## 7. Estratégia de migrations

### Trilha canônica

`migrations/` é canônica porque:

- `wrangler.jsonc` usa `migrations_dir: "migrations"` em todos os ambientes;
- `db:migrate:local` e `db:migrate:remote` usam Wrangler;
- a documentação histórica já atribui essa responsabilidade à pasta.

Workflow daqui para frente:

1. alterar `db/schema.ts`;
2. executar `npm run db:generate`; o Drizzle Kit grava o diff descartável em
   `.drizzle-generated/`;
3. revisar SQL, compatibilidade e dados;
4. criar manualmente o próximo arquivo imutável numerado em `migrations/`;
5. aplicar localmente com `npm run db:migrate:local`;
6. executar testes/build;
7. somente após autorização, aplicar remotamente com
   `npm run db:migrate:remote`.

`migrations/` continua sendo a fonte canônica para Wrangler e para toda nova
migration. Como a produção foi comprovadamente inicializada pelo histórico
legado do Sites, o artefato preserva `drizzle/` como baseline imutável que o
provedor reconhece e acrescenta somente as migrations canônicas a partir da
`0005`. Isso evita reaplicar a criação de tabelas sem reintroduzir uma segunda
trilha para mudanças futuras.

### Papel de `drizzle/`

`drizzle/` preserva a trilha histórica usada por deploys anteriores do Sites e
os snapshots correspondentes. Ela está congelada: não apagar, editar ou aplicar
como nova fonte. A migration canônica `0005_foundation_reconcile.sql` é
idempotente e completa instalações criadas somente pelas migrations Wrangler.

Nenhuma migration remota foi executada nesta fase.

## 8. Estado da autenticação

Fluxo atual de `requireAdmin`:

1. local: hostname `localhost`/`127.0.0.1` + `ENVIRONMENT=local` ativa bypass
   exclusivo de desenvolvimento;
2. produção/preview: tenta validar cookie HMAC `punctum_admin_session`;
3. sem sessão própria válida: tenta validar `cf-access-jwt-assertion` por JWKS,
   issuer e audience;
4. sem identidade válida: retorna 403; páginas HTML `/admin/*` redirecionam para
   `/acesso`.

Login por senha:

- `POST /admin/api/session` exige Origin same-origin e rate limit;
- e-mail precisa constar em `ADMIN_ALLOWED_EMAILS`;
- senha vem de PBKDF2 no D1 quando definida, ou de `ADMIN_PASSWORD_HASH` como
  bootstrap;
- cookie é HttpOnly, Secure, SameSite=Strict, Path=/admin e dura 12 horas;
- a troca de senha invalida a sessão atual.

Cloudflare Access:

- é fallback de identidade no Worker;
- a policy remota deve restringir os e-mails autorizados;
- o código local não comprova a policy aplicada no Zero Trust.

Nenhum ramo comprovadamente morto foi encontrado com segurança suficiente para
remoção.

## 9. Correções de segurança

- `/media/:imageId/:preset` agora faz join com `albums` e exige álbum publicado
  e não deletado.
- O cache público deixou de ser anual/imutável e passou a cinco minutos, pois o
  estado de publicação pode mudar.
- `/admin/media/:imageId/:preset` exige `requireAdmin`, permite visualizar
  draft/archived e responde `private, no-store`.
- URLs retornadas pela API administrativa foram movidas para `/admin/media`.
- Imagens do admin usam a rota já transformada sem passar pelo otimizador
  público do Next.
- `/arquivo` foi incluído no sitemap; a query de ensaios já exige published e
  `deleted_at IS NULL`.

Não houve relaxamento de CSP, Origin, Access, cookies, rate limit ou validação.

## 10. Testes adicionados

Cobertura adicionada/expandida:

- defaults e precedência de settings;
- `brandName` em metadata;
- save admin e leitura pública de todos os settings existentes;
- seleção editorial sem catálogo alternativo;
- álbum publicado e categorias reais;
- campos SEO de álbum na API;
- metadata SEO explícita e fallback derivado;
- álbum arquivado removido da lista e do detalhe;
- mídia publicada disponível, mídia arquivada negada e preview admin permitido;
- `/arquivo` no sitemap e draft ausente;
- aplicação da trilha canônica completa de migrations em D1 isolado.

Validação executada até este ponto:

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` | aprovado |
| `npm test` | 4 arquivos, 21 testes aprovados |
| `npm run lint` | aprovado |
| `npm run build` | aprovado; Worker, RSC, cliente e SSR gerados |

## 11. Itens UNDETERMINED

- **RESOLVIDO EM 23/08/2026:** a primeira tentativa de publicação versionada
  confirmou que a produção usa o tracker legado do Sites (`drizzle/`). O
  artefato mantém esse baseline e anexa apenas migrations canônicas novas.
- **UNDETERMINED — REQUIRES REMOTE ACCESS POLICY INSPECTION:** regras, paths,
  duração e allowlist efetivos no Cloudflare Zero Trust.
- **UNDETERMINED:** se a camada Access intercepta `/admin/api/session` antes do
  login próprio em todos os ambientes remotos.
- **UNDETERMINED:** valores atuais de `site_settings` e estados do conteúdo no
  D1 de produção. O código local não foi usado para inferir dados remotos.

## 12. Dívida técnica restante para o Studio

- Inspecionar e reconciliar uma única vez o histórico remoto de migrations.
- Decidir, com evidência da policy remota, se Access e senha continuarão em
  paralelo ou se haverá uma fonte única de identidade.
- Medir cache/SSR em produção e definir invalidação orientada a publicação.
- Consolidar CSS global e tokens somente na fase apropriada, sem misturar com
  esta fundação.
- Expor focal point e refinar acessibilidade do lightbox.
- Remover `UNSPECIFIED` de decisões operacionais após confirmação da fotógrafa.
- Criar `SiteConfig`, snapshots, preview e Studio apenas nas fases seguintes.

## Confirmação de limite de fase

Esta implementação não criou `SiteConfig`, `ThemeConfig`, registry de sections,
presets, variants, editor visual, drag-and-drop de sections, preview iframe,
draft/publish de configuração ou undo/redo. A aparência pública foi preservada;
as únicas variações de texto possíveis decorrem dos settings que já existiam e
agora finalmente governam suas superfícies.
