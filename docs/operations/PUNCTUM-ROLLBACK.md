# Runbook de Rollback Operacional — Punctum Picture

Data de formalização: 10 de setembro de 2026  
Status do Rollback: `ROLLBACK_READY=TRUE`  
Responsável pela aprovação final: Gabriel Menezes  

---

## 1. Baseline Verificada de Produção

A baseline de recuperação foi auditada, fixada e testada. Trata-se da versão imutável em produção que contém o carrossel 3D espacial (`SpatialCarousel`) aprovado por Gabriel e as correções técnicas anteriores:

* **Git Baseline SHA**: `17ac1008b5462434d892754c32dd68ad6c9889b3`
* **Commit de Origem**: `Merge pull request #9 from menezesx2k26-byte/design/punctum-visual-revision-20260909`
* **Tag Imutável Remota**: `refs/tags/rollback/punctum-before-soul-rebuild-2026-09-10`
* **Branch Remota de Segurança**: `refs/heads/rollback/punctum-before-soul-rebuild-2026-09-10`
* **Cloudflare Worker**: `punctum-picture-migration`
* **Cloudflare Deployment ID de Produção**: `111b6ebd-f82d-4357-aa94-ae98022f76c8`
* **Cloudflare Worker Version ID**: `cc6a8fb3-3952-4181-a933-295d89b2a158` (100% de tráfego)
* **URL de Produção**: `https://punctumpicture.com`
* **Binding de Rastreabilidade**: `GIT_SHA=17ac1008b5462434d892754c32dd68ad6c9889b3`
* **Data da Verificação**: 2026-09-10T10:17:22Z (07:17:22 BRT)
* **Evidência do Carrossel Aprovado**: `docs/visual-qa/punctum-production-live-verified.png`

---

## 2. Ensaio Prático de Restauração (Validado na Nuvem)

O ensaio de restauração foi conduzido em ambiente isolado via Cloudflare Preview Alias sem impactar a produção:
* **Ambiente de Ensaio**: `https://rollback-drill-punctum-picture-migration.menezesx2k26.workers.dev`
* **Procedimento Testado**:
  1. Upload de versão candidata divergente no alias `rollback-drill`.
  2. Upload e repontamento do alias para a baseline exata `17ac1008...` (Worker version `7c156762-d705-49b8-80f4-7134b060c12f`).
  3. Validação automatizada de 17 rotas públicas (todas responderam HTTP 200 OK).
  4. Inspeção visual headless confirmando a presença íntegra do `SpatialCarousel` (cilindro 3D, inércia, badge "MESA DE CONTATO 3D" e imagens do acervo).
  5. Verificação de tráfego em produção comprovando `0%` de alteração no tráfego público do domínio `punctumpicture.com`.

---

## 3. Critérios de Acionamento do Rollback

O procedimento de restauração deve ser acionado imediatamente se, após qualquer publicação:
1. O `SpatialCarousel` apresentar qualquer divergência visual, de física, de perspectiva ou de enquadramento;
2. Qualquer rota pública retornar erro 5xx ou 404;
3. Fotografias do acervo ou do carrossel falharem no carregamento;
4. Ocorrer regressão crítica no painel administrativo (`/admin`) ou no Studio (`/admin/studio`);
5. Houver perda de canonical tags, sitemap, robots ou JSON-LD;
6. Ocorrer overflow horizontal severo em telas mobile (360px a 430px);
7. O link direto para o WhatsApp estiver quebrado ou inacessível.

---

## 4. Procedimento de Restauração Imediata

### Camada 1: Restauração Instantânea via Cloudflare CLI

Para repontar o tráfego de produção instantaneamente para a versão imutável conhecida:

```pwsh
# 1. Obter status e confirmar versão estável
npx wrangler deployments status --name punctum-picture-migration

# 2. Re-promover a versão estável da baseline (cc6a8fb3-3952-4181-a933-295d89b2a158) para 100% do tráfego
npx wrangler versions deploy cc6a8fb3-3952-4181-a933-295d89b2a158@100% --name punctum-picture-migration --message "EMERGENCY ROLLBACK to baseline 17ac1008b5462434d892754c32dd68ad6c9889b3"
```

### Camada 1 (Alternativa): Restauração pelo Painel Web da Cloudflare
1. Acesse o Cloudflare Dashboard > **Workers & Pages**.
2. Selecione o Worker **punctum-picture-migration**.
3. Navegue até a aba **Deployments** (ou **Versions**).
4. Localize a versão `cc6a8fb3-3952-4181-a933-295d89b2a158` (Deployment `111b6ebd-f82d-4357-aa94-ae98022f76c8`, tag/mensagem com `17ac1008`).
5. Clique nos três pontos (`...`) e selecione **Rollback to this deployment** (ou **Deploy version to 100%**).
6. Confirme a ação.

---

## 5. Camada 2: Reconciliação no Repositório Git

Após a recuperação operacional do tráfego em produção, sincronize o histórico da branch `main` de forma limpa e auditável:

```pwsh
# 1. Garantir sincronia com a origem
git checkout main
git pull origin main

# 2. Criar commit de reversão explícito do merge/commit problemático
git revert -m 1 <COMMIT_SHA_DO_MERGE_PROBLEMATICO> -m "revert: rollback to verified baseline 17ac1008"

# 3. Validar integridade local
npm run typecheck
npm run test
npm run build

# 4. Enviar a reversão para o repositório remoto
git push origin main
```

---

## 6. Verificações Pós-Restauração (Smoke Test Checklist)

Execute imediatamente após a restauração:

1. [ ] **Home (`/`)**: Carrossel 3D visível, funcional, com arraste, rotação e inércia ativas;
2. [ ] **Rotas Públicas**:
   - `/portfolio` (200 OK)
   - `/arquivo` (200 OK)
   - `/ensaios/ritos-de-luz` (200 OK)
   - `/servicos/retratos` (200 OK)
   - `/fotografia/sao-bento-do-sul` (200 OK)
   - `/contato` (200 OK)
3. [ ] **SEO**: Canonical aponta para `https://punctumpicture.com/` e structured data presente;
4. [ ] **Admin & Studio**: Acesso funcional em `/admin` e `/admin/studio`;
5. [ ] **Console do Navegador**: 0 erros críticos de execução ou de rede.
