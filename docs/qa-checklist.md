# Checklist de QA

## Automatizado

- [x] TypeScript strict.
- [x] ESLint.
- [x] Unit: slug, Zod, publish, presets, Accept, reorder e auth.
- [x] Integração: público, inquiry/honeypot, CRUD essencial, intent/complete,
  capa/reorder/delete, Access inválido e mídia inválida/ausente.
- [x] Build de produção.

## Manual antes de abrir o domínio

- [ ] Aplicar migrations em preview e produção.
- [ ] Autenticar Maria Helena por Access.
- [ ] Verificar `/admin` sem token (bloqueado) e com token (permitido).
- [ ] Criar um ensaio completo pelo celular.
- [ ] Enviar 10+ fotos, observar três simultâneas e progresso total.
- [ ] Forçar uma falha e repetir somente o arquivo afetado.
- [ ] Reordenar por toque e pelos botões.
- [ ] Confirmar capa, alt text, publicar, editar e arquivar.
- [ ] Enviar contato válido e preencher honeypot em teste.
- [ ] Testar iPhone Safari e Android Chrome em 360–430 px.
- [ ] Navegar por teclado; conferir foco, labels e contraste.
- [ ] Usar leitor de tela básico no formulário e editor.
- [ ] Conferir sitemap, robots, canonical e compartilhamento Open Graph.
- [ ] Confirmar que nenhuma URL R2 ou nome de arquivo aparece no público.
- [ ] Ensaiar backup e restore em preview.

## Performance

Executar Lighthouse mobile nas páginas `/`, `/portfolio` e em um ensaio real.
Registrar aqui data, dispositivo/rede e LCP, CLS e INP. Metas operacionais:

- LCP até 2,5 s no percentil 75.
- CLS até 0,1.
- INP até 200 ms.

Resultados: **UNSPECIFIED — medição depende do conteúdo final e do domínio
ativo**.

Verificar ainda compressão AVIF/WebP, cache público longo em `/media/*`, lazy
load fora da dobra e ausência de regressão visual severa.
