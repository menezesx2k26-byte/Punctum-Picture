# Punctum Picture — Fase 2: Voz e Personalidade Editorial

Data: 22 de agosto de 2026  
Escopo: copy pública editável, escolhas visuais guiadas, fontes locais e Studio V0  
Fora do escopo: editor visual completo, iframe de preview, composição dinâmica,
drag-and-drop, snapshots draft/publish, undo/redo global, cores avançadas,
variants estruturais, collage renderizada e upload arbitrário

## 1. Objetivo

A Fase 2 dá à Maria a primeira autonomia perceptível sobre a personalidade do
Punctum. Ela pode trocar os textos editoriais, escolher um estilo de escrita e
escolher o clima do fundo sem conhecer CSS, design tokens, IDs internos ou
detalhes de implementação.

O estado original continua sendo o default. Uma instalação sem configuração
persistida reproduz a copy e a aparência anteriores à fase. Nenhum conteúdo de
portfólio voltou a depender de catálogo estático, e o renderer público continua
server-first.

## 2. Classificação da copy

### Editorial — editável

Foram movidos para `EditorialConfig` os textos que expressam a voz da
fotógrafa:

- aberturas, títulos, trechos em destaque, subtítulos e CTAs da Home;
- manifesto, apresentação do acervo, histórias, biografia e contato da Home;
- abertura, introdução, percurso e metadata editorial do Portfólio;
- abertura, descrição e metadata editorial do Arquivo;
- abertura, convite do formulário e metadata editorial do Contato;
- títulos e chamadas globais das páginas de ensaio;
- tagline do cabeçalho, chamada do WhatsApp e textos editoriais do rodapé.

Os campos próprios de um ensaio — título, subtítulo, história, capa, categoria
e SEO — continuam no álbum administrado em D1. Eles não foram duplicados em
`EditorialConfig`.

### Navegação — editável com limites

Os nomes visíveis de Portfólio, Arquivo, Sobre e Contato, além das chamadas do
rodapé, podem ser alterados. As rotas, destinos e estrutura da navegação
permanecem fixos e protegidos.

### Sistêmica — mantida em código

Continuam em código: campos e estados do formulário, filtros, mensagens de
validação, loading, erros, mensagens de segurança, textos do painel, estados
técnicos, `aria-label`, rótulos do lightbox, estatísticas dinâmicas e fallbacks
operacionais. Esses textos fazem o sistema funcionar, mas não representam a
voz editorial.

## 3. EditorialConfig

`SiteConfig` passou da versão 1 para a versão 2 e agora possui:

```ts
type SiteConfig = {
  schemaVersion: 2;
  identity: IdentityConfig;
  theme: ThemeConfig;
  editorial: {
    home: {
      hero: EditorialHero;
      statement: EditorialStatement;
      carousel: EditorialCarousel;
      featured: EditorialFeatured;
      about: EditorialAbout;
      contact: EditorialContact;
    };
    portfolio: {
      seo: EditorialSeo;
      hero: EditorialPortfolioHero;
      listing: { intro: string };
      reel: EditorialCarousel;
    };
    archive: {
      seo: EditorialSeo;
      hero: EditorialArchiveHero;
    };
    contact: {
      seo: EditorialSeo;
      hero: EditorialContactHero;
      form: EditorialFormIntro;
    };
    album: {
      storyTitle: string;
      archiveNote: string;
      archiveCta: string;
    };
    chrome: {
      brandSubtitle: string;
      navigation: EditorialNavigation;
      footer: EditorialFooter;
      whatsappCta: string;
    };
  };
};
```

Todos os objetos são estritos. Propriedades desconhecidas são rejeitadas.
Configurações v1 válidas recebem os defaults editoriais por uma migração
explícita em memória; versões desconhecidas caem no default seguro.

## 4. Defaults e limites

`PUNCTUM_DEFAULT_EDITORIAL_CONFIG` centraliza a copy anterior, evitando strings
de fallback duplicadas no JSX. Os limites são definidos por tipo de uso:

| Uso | Limite |
| --- | ---: |
| pequena chamada | 70 |
| título | 110 |
| trecho em destaque | 70 |
| subtítulo | 280 |
| parágrafo | 700 |
| biografia | 1.800 |
| CTA | 42 |
| navegação | 24 |
| nota curta | 100 |
| título SEO | 70 |
| descrição SEO | 180 |

O backend valida novamente todos os limites. A interface usa mensagens como
“Esse texto está perto do limite”, sem expor nomes de schema ou erros técnicos.

Não há HTML armazenado. Campos aceitam texto simples e, onde apropriado,
quebras de linha controladas. `EditorialText` renderiza essas quebras como nós
React e `<br>`, sem `dangerouslySetInnerHTML`.

## 5. Persistência

A menor persistência compatível com a arquitetura futura foi uma unidade
serializada e versionada, não colunas de tema espalhadas:

```text
site_config (singleton id = 1)
  schema_version
  config_json
  updated_at
  updated_by
```

A migration local `0006_editorial_personality.sql` cria a tabela. Não foi
executada migration remota.

Fluxo:

```text
Studio -> PATCH /admin/api/studio -> validação strict no Worker
       -> site_config JSON v2 no D1
       -> leitura server-first
       -> ThemeResolver + copy editorial
       -> renderer público
```

Enquanto ainda não existe uma linha, o loader deriva o default dos settings
legados `tagline` e `aboutText`, preservando a Fase 0. Ao salvar, o config
completo passa a ser a unidade canônica e esses dois settings são espelhados
somente para compatibilidade. A futura fase de snapshots poderá copiar esse
singleton como primeiro snapshot publicado, sem mudar o shape do config.

Não foram criados autosave, draft/publish ou histórico provisórios. O Studio
usa estado local e um botão explícito “Salvar alterações”.

## 6. Studio V0

A rota `/admin/studio` adiciona uma entrada “Studio” ao painel e começa com
três escolhas visuais grandes:

- **Escrita** — pares tipográficos aprovados;
- **Textos** — campos agrupados pelo contexto em que aparecem;
- **Fundo** — quatro atmosferas allowlisted.

Somente uma área é aberta por vez. Os textos usam nomes humanos como “Frase
principal”, “Pequena frase acima”, “Texto de apresentação” e “Botão principal”.
Cada grupo explica discretamente onde aparece.

“Voltar ao original” pede confirmação e restaura o default apenas no estado
local; a alteração só é persistida após “Salvar alterações”. Mensagens claras
indicam estado salvo, edição pendente, escolha realizada e erro.

## 7. Linguagem leiga

A UI evita `Theme`, `font-family`, `token`, `variant`, `asset`, `tracking` e
outros termos técnicos. As opções são descritas pela sensação resultante:
“Elegante”, “Moderna”, “Clássica”, “Limpo”, “Luz suave”, “Com foto” e
“Textura editorial”. IDs internos nunca aparecem.

## 8. Fontes e pacote local

O ZIP `Punctum_Baixar_40_Fontes.zip` foi inspecionado antes da execução. O
downloader usa CSS oficial do Google Fonts e grava somente CSS/WOFF2 no destino
informado. Ele foi executado localmente para `public/fonts/punctum`.

Resultado:

- 40 de 40 famílias obtidas;
- 259 arquivos `.woff2`, em subconjuntos latin e latin-ext quando disponíveis;
- 40 IDs e categorias do manifesto preservados no `FontRegistry`;
- `georgia-editorial` e `system-sans` continuam como opções de sistema;
- os paths dos CSS por família foram normalizados para o diretório local;
- o relatório foi preservado em `public/fonts/punctum/download-report.json`.

Falhas parciais, sem substituição silenciosa:

- `sacramento`: somente peso 400 existe no download;
- `allura`: somente peso 400 existe no download;
- `parisienne`: somente peso 400 existe no download.

As tentativas de 500, 600 e 700 para essas três famílias retornaram HTTP 400.
O registry declara apenas o peso 400 e a validação impede combinar um peso não
disponível.

O stylesheet registra as famílias, mas o navegador baixa os binários somente
quando a família/peso é usado. A inspeção da Home default encontrou 5 WOFF2
ativos: Cormorant 400 e Manrope 400/500/600/700. Nenhuma das outras famílias do
pack foi baixada pela página. O default Cormorant + Manrope foi preservado.

## 9. Pares tipográficos

O Studio expõe primeiro combinações prontas:

| Nome humano | Títulos | Textos | Ajustes internos |
| --- | --- | --- | --- |
| Elegante | Cormorant Garamond | Manrope | display, regular, tight |
| Moderna | Manrope | Manrope | editorial, medium, tight |
| Clássica | Georgia | Manrope | editorial, regular, normal |

Cada card mostra “Histórias que permanecem” com a própria fonte. A escolha
altera vários campos válidos de `ThemeConfig` em conjunto. “Personalizar mais”
e a seleção individual entre todas as 40 famílias foram adiados para evitar
complexidade prematura; o registry já está pronto para essa expansão.

## 10. Fundos

O Studio traduz o `BackgroundRegistry` para quatro opções:

| UI | ID interno | Asset |
| --- | --- | --- |
| Limpo | `plain` | nenhum |
| Luz suave | `organic-glow` | nenhum |
| Com foto | `soft-image` | `manifesto-portrait` |
| Textura editorial | `editorial-texture` | nenhum |

“Com foto” usa somente referência interna allowlisted. Não existe campo de URL,
pathname ou upload livre.

## 11. Collage / patch

Collage permanece metadata validada em `ThemeConfig`. Nenhuma composição foi
renderizada nesta fase. Uma prova visual exigiria escolher uma superfície,
tratamento responsivo e regras de seleção de fotografias com qualidade de
variant; encaixá-la agora aumentaria o escopo e arriscaria a equivalência visual.

## 12. Mobile

O fluxo completo de abrir Studio, editar texto, escolher escrita, escolher
fundo e preparar o salvamento funciona no celular. Cards usam botões reais e
não dependem de hover. Campos inspecionados possuem 52 px de altura; botões
principais possuem 48 px. A navegação inferior foi ajustada para seis entradas
sem rolagem horizontal ou corte de página.

## 13. Acessibilidade

- cards são `button`, com `aria-pressed` para escolhas;
- todos os campos possuem label, contexto e limite legível;
- `details/summary` oferece progressive disclosure nativo;
- estados são anunciados por `role="status"`;
- foco visível é preservado;
- targets atendem uso por toque;
- as opções não alteram focus, breakpoints ou hierarquia;
- motion continua respeitando `prefers-reduced-motion` pelo motor da Fase 1;
- palettes continuam restritas às combinações aprovadas e validadas.

## 14. Segurança

O cliente nunca é a autoridade. `PATCH /admin/api/studio` exige sessão admin e
valida o objeto completo no Worker. São bloqueados:

- propriedades desconhecidas;
- IDs de fonte, background e asset ausentes dos registries;
- URL ou pathname arbitrário;
- HTML e tags;
- padrões de CSS e JavaScript;
- payload maior que 32 KiB;
- texto além do limite;
- peso incompatível com a família escolhida.

Nenhum input é interpolado como CSS. Fontes e fundos são resolvidos por maps
fechados. Copy é renderizada como texto escapado pelo React.

## 15. Testes e verificação

Cobertura adicionada ou ampliada:

- defaults e migração v1 -> v2;
- limites, HTML, propriedades desconhecidas e fallback editorial;
- renderização segura de quebras de linha;
- leitura e persistência de Studio;
- sincronização compatível com settings legados;
- rejeição de fonte, fundo, URL e payload desconhecidos;
- 40 fontes do pack, 42 entradas totais do registry e pesos reais;
- aplicação dos tokens dos três pares tipográficos;
- configuração pública chegando pela API e loader server-first;
- preservação dos testes de portfólio, SEO, mídia e sitemap das fases anteriores.

Validações executadas: typecheck, lint, testes, build, `git diff --check` e QA
manual em Home/Studio desktop e mobile. O QA confirmou ausência de imagens
quebradas, overflow de página e erros/warnings de console.

## 16. Diferenças visuais e limitações

Sem configuração persistida, o site público continua visualmente equivalente.
A única nova superfície é o Studio no admin. A seleção de outra escrita ou
fundo muda os tokens já suportados pelo renderer somente depois de salvar.

Limitações atuais:

- salvar ainda publica diretamente o singleton, pois snapshots não existem;
- não há preview fiel da página, apenas amostras locais nos cards;
- não há seleção individual das 40 fontes na UI;
- não há fonte enviada pela usuária;
- não há seleção de foto do acervo para background;
- metadata global ainda segue o fluxo de settings existente;
- não há edição de cores nesta fase.

## 17. Itens adiados

- snapshots de draft/publicado e publicação atômica;
- preview autenticado em iframe;
- autosave, histórico, rollback e undo/redo global;
- personalização tipográfica avançada;
- palettes e controles de cor;
- catálogo visual de fotografias allowlisted para background;
- collage/patchwork renderizado;
- variants estruturais;
- composição de páginas e drag-and-drop de sections;
- editor visual completo do Punctum Studio.

Não houve deploy, migration remota ou alteração de configuração remota da
Cloudflare nesta fase.
