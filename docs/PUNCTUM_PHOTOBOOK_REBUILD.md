# Punctum — livro de fotografia digital

## Autoridade e estado

Frontend Director: IN_PROGRESS. Contrato instalado lido em `C:\Users\Pichau\.agents\skills\frontend-director\SKILL.md` em 2026-09-08. Lead: frontend-design (RUFLOW). Execução sequencial. Revisão visual e de acessibilidade após candidato estável. O usuário delegou expressamente decisões reversíveis e continuidade até aprovação; não há gate de aprovação intermediária.

## Reconhecimento verificado

- Fonte: GitHub `menezesx2k26-byte/Punctum-Picture`, main `38c43d1294914209ea640ef803c0e7bb143d82b5`. A cópia Sites parava em `948a28a`; atualizada por bundle verificado antes de criar branch.
- Branch isolada: `feat/punctum-photobook-redesign-20260908`, checkout `/workspace/sites/punctum-picture`.
- Pasta antiga no Desktop tem exclusões preexistentes. Preservada. Pasta Documents está limpa na main.
- PR #2 de upload está aberto como draft; implementação equivalente foi integrada por #3/#4. Não interferir.
- Baseline: 97 testes / 21 arquivos passam. Node 22+, React 19, Next 16 via Vinext/Vite, Worker único, Cloudflare D1/R2/Images.
- Produção observada no Cloud Browser: home, portfólio, ensaio documental, contato, hub regional, São Bento do Sul, música e shows. 16 histórias / 192 fotos segundo API pública.
- Diagnóstico: hero vertical recortado em tela horizontal; botão branco com texto branco; carrosséis e textos repetidos; fotos cobertas por títulos; CSS de 4.791 linhas com sucessivas sobreposições; imagem estática de crianças na página de música e shows.
- Dados atuais de tema: nocturne-plum, Cormorant Garamond, Manrope; hero próprio administrado. Configuração deve continuar editável.

## Tese e pesquisa

Um livro de fotografia digital de Maria Helena: passe-partout neutro, imagens íntegras, sequência entre escalas diferentes e legendas editoriais fora das fotografias. A presença humana, os ritos, a cor de palco e o movimento formam a identidade.

Referências consultadas: [Rinko Kawauchi / Illuminance](https://rinkokawauchi.com/en/works/194/) (pares de imagens, proporções, navegação silenciosa; página renderizada inspecionada); [Jack Davison](https://www.jackdavison.co.uk/) (entrada direta na imagem, índice); [Refero](https://github.com/referodesign/refero_skill) (pesquisa, reference lock e papel de tokens; MCP não disponível nesta sessão). Refero não é autoridade superior ao Director. Nenhuma imagem externa será incorporada.

Direções consideradas: papel claro favorece livro impresso; preto fotográfico favorece shows e documental e respeita modo escuro publicado; alternância constante prejudica coesão. Escolha: preto fotográfico neutro no tema noturno publicado, com sistema também funcional nos temas claros do Studio. Cor pertence principalmente à fotografia. Sem shader, gradiente decorativo ou novo catálogo de componentes.

## Decisões e source lock

| Decisão | Fonte | Papel e motivo |
| --- | --- | --- |
| Fotografias sem recorte em ensaios e capas | Brief + Kawauchi | Mostrar a decisão original de enquadramento |
| Abertura composta por imagem principal e contraponto menor | Brief editorial + acervo real | Apresentar autora e trabalho numa dupla página |
| Legendas e títulos fora da imagem | Diagnóstico produção | Fotografia íntegra e contraste independente |
| Fundo noturno neutro | Tema publicado + acervo | Cor das fotos deixa de disputar com ameixa/gradientes |
| Tipografia administrável, títulos em romano | Site Config + brief | Preservar escolhas do Studio, evitar palavra em itálico decorativo |
| Índice de séries com escalas alternadas | Brief + sequência fotográfica | Hierarquia editorial sem catálogo de cards |
| Contato visível cedo, navegação por teclado | Brief mobile | Facilitar uso de clientes e Maria |

DFII: impacto 4, contexto 5, viabilidade 5, performance 5, risco de consistência 3 = 16 (a fórmula publicada na skill excede seu intervalo descritivo; julgamento: forte).

## Preservar

Não alterar contratos de API, esquema/migrations, dados de produção, Worker, R2, D1, autenticação, publicação/arquivo de ensaios, categorias, ordem, alt text, capas administradas, SEO, canonicals, sitemap/robots/JSON-LD, deploy Cloudflare. Preservar presets, fontes, conteúdo, reorder e visibilidade do Studio; preview usa o mesmo HomeExperience. Não criar endereços ou afirmar onde fotos foram feitas sem localização cadastrada.

## Plano de implementação

1. Ambiente e evidência: corrigir somente compatibilidade do comando dev com preview supervisionado; reproduzir conteúdo público em banco local isolado; capturar baseline responsivo. Registrar resultados e fontes.
2. Composição: reconstruir HomeHeroSection, FeaturedStories/PortfolioGrid por um componente compartilhado de ensaio; redesenhar SiteChrome e contato; separar CSS público dos estilos administrativos, eliminando regras públicas antigas sobrepostas.
3. Sistema: temas continuam resolvidos por Site Config; ajustar paleta noturna dentro da camada visual; manter presets/fontes; seções e variantes continuam respeitando atributos existentes. Sem dependência runtime nova.
4. Páginas: portfólio, arquivo, ensaios, seis serviços e cinco cidades recebem mesmo sistema. Serviços escolhem fotografia compatível do acervo publicado; corrigir estáticas incompatíveis. Conteúdo SEO preservado com copy voltada ao cliente.
5. Interação: lightbox com dialog nativo, foco restaurado, teclado/gestos; carrossel manual, reduced motion. Estados vazios claros. Testes de comportamento onde há alteração, sem testes que espelham CSS.
6. Gates: typecheck, lint, suíte completa, build, rotas, links/canonicals/schema; QA renderizado 360/390/768/1363/1920, foco/teclado, lightbox, filtros, formulário sem envio real, console/rede, imagens e payloads.
7. Revisão: se houver falha, NEEDS_REVISION e correção autônoma. Branch/commits/PR; preview quando infra suportar. Só integrar após todos os gates materiais. Validar versão publicada pelo fluxo Cloudflare existente.

## Gates

| Gate | Estado |
| --- | --- |
| Baseline testes | PASS: 97/97 |
| Funcional candidato | PENDENTE |
| Engenharia candidato | PENDENTE |
| Visual desktop/mobile | PENDENTE |
| UX/acessibilidade | PENDENTE |
| Performance | PENDENTE |
| Publicação | PENDENTE |

Dependências: nenhuma alteração. Próximo passo: estabilizar preview, registrar baseline responsivo e implementar composição.
