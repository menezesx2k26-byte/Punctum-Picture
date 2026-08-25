# Direct Studio Hero Upload Design

## Goal
Allow an administrator using Punctum Studio on a phone to upload a new Home hero directly from the device, without creating or selecting an album/essay, while preserving the existing draft/publish workflow and current hero as a safe fallback.

## User experience
In Studio → Fotos, the first-class “Hero da página inicial” card shows the currently selected hero and exposes “Enviar foto do celular” alongside the existing published-library picker. Tapping the upload action opens the native file picker (`accept=image/*`). After a valid upload finishes, Studio previews the uploaded image immediately and selects it in the current draft. The public Home changes only after the normal Studio Publish action succeeds.

Hero-only media must never appear as an essay, album, portfolio item, archive item, or published-library photo unless it was independently uploaded through those existing flows.

## Architecture
Introduce site media as a small administrative media domain independent from albums. Reuse the existing R2 upload/storage and image-processing conventions, but do not fake album ownership or create a hidden album.

A site-media record owns metadata required for safe serving and Studio display: stable id, storage key, media role (`hero` initially), original filename, MIME type, byte size, processing status, width, height, timestamps, and derived/serving information required by the existing image pipeline. The design intentionally supports only the Hero role now; it is not a generic CMS asset manager.

The Studio draft stores a hero reference that can resolve either an existing published portfolio image or a site-media Hero. The published snapshot contains the same typed reference. Existing configurations containing only `backgroundImageId` remain valid and continue resolving as today.

## Upload flow
1. User chooses one image directly in Studio.
2. Client validates supported type and maximum byte size before requesting an upload intent.
3. Studio requests a hero site-media upload intent from an authenticated admin endpoint.
4. Worker creates a pending site-media record and returns the R2 upload target/required headers using the established upload mechanism.
5. Browser uploads directly to storage and calls completion.
6. Worker verifies/processes the object, records dimensions and marks it ready.
7. Hero suitability validation rejects an image that cannot safely cover the hero. Minimum accepted source dimensions are 1920×1080; portrait images are allowed when their dimensions provide at least 1080 px on the short side and enough source resolution for the existing mobile crop. The API is authoritative; client validation is advisory.
8. Studio refreshes the site-media record, previews it, and writes its typed reference into the current draft automatically.
9. Normal Studio Publish promotes the draft. No code deployment is required for future hero changes.

## API boundaries
Add authenticated admin endpoints under `/admin/api/site-media` for Hero media only:
- `POST /admin/api/site-media/intents` creates an upload intent for one Hero image.
- `POST /admin/api/site-media/:id/complete` completes processing and returns the ready media record.
- `GET /admin/api/site-media?role=hero` lists Hero media available to Studio.

Serving uses a stable media URL derived from the site-media id/storage metadata and the same private/public cache and image safety rules used by existing media. The public hero resolver may expose only a ready site-media record referenced by the published Studio snapshot.

## Data and compatibility
Add a migration for a dedicated `site_media` table; do not change album ownership semantics. Existing album/image tables remain untouched. Existing Studio snapshots remain readable. The hero resolver follows this order:
1. ready site-media Hero explicitly referenced by the published snapshot;
2. existing published portfolio image referenced by the legacy/current image field;
3. bundled `/images/hero-maria.webp` fallback.

Invalid, missing, pending, failed, or deleted site media must never break Home rendering; resolution falls through to the next safe source.

## Security and validation
All mutation/list endpoints require the same admin/Access authorization as current Studio media operations. Accept JPEG, PNG, and WebP only, with the existing 25 MiB ceiling. Do not trust filename extensions. Completion verifies the stored object and image metadata. Site-media identifiers are opaque UUIDs. The public resolver never exposes pending or failed uploads.

## Error handling
Studio keeps the previous draft hero selected until the new upload is ready. Upload and processing failures show a plain-language error and allow retry; they do not mutate the published site. Too-small images receive a specific resolution message. Losing connectivity during upload leaves a non-public pending record that can be cleaned up later without affecting Home.

## Testing
Follow TDD. Integration tests cover authenticated intent creation, rejection of album-less access through old endpoints, direct R2 completion, MIME/size/dimension rejection, ready Hero listing, and the guarantee that site media does not enter album/portfolio APIs. Unit tests cover typed hero-reference parsing and fallback resolution. Studio component tests cover the direct file input, upload state, automatic draft selection, preview, and error copy. Public rendering tests cover published site-media Hero plus fallback behavior.

Before production promotion run typecheck, lint, focused tests, full test suite, production build, WebP/static-hero validation, Cloudflare deploy, and smoke tests for Home, Hero and admin. A green deploy pipeline is required; visual behavior must also be checked against the Studio preview/public hero contract.

## Non-goals
No generic asset library, bulk Hero uploads, image editor, AI upscaling, album synchronization, or automatic publication. No hidden album is created. Hero upload does not bypass Studio draft/publish semantics.
