# Punctum — Migration Parity Ledger

Updated: 2026-08-23

This file is the authoritative migration ledger for moving the live Punctum Site from managed ChatGPT Sites storage to the owner's Cloudflare account.

## Migration policy

The owner accepted functional-state parity in lieu of strict forensic parity for historical/operational D1 rows that are not exposed by the application APIs. Custom-domain DNS/routes remain a separate cutover step.

## Destination infrastructure — PASS

- Worker: `punctum-picture-migration`
- Worker URL: `https://punctum-picture-migration.menezesx2k26.workers.dev`
- D1: `punctum-picture`
- D1 id: `22697f13-7484-41e3-9441-f7b902c6577a`
- R2 originals: `punctum-picture-originals`
- R2 backups: `punctum-picture-backups`
- Cloudflare Images: enabled
- scheduled backup/cleanup crons: enabled
- custom domain: untouched

## Git → Cloudflare deployment — PASS

`main` is connected to the Cloudflare Worker through GitHub Actions.

Every relevant push to `main` runs:

1. `npm ci`
2. typecheck
3. lint
4. vinext build
5. tests
6. destination D1 resolution
7. generated Wrangler config patch
8. Cloudflare deploy
9. public + authenticated admin smoke tests

The first Git-driven production-mode deploy passed every gate. The workflow deploys the generated vinext Worker to `punctum-picture-migration` and deliberately does not attach the custom domain yet.

## Public state parity — PASS

- published albums: 16 / 16
- public photos: 192 / 192
- public category count: 7 / 7
- complete category records: 10 / 10
- public album/archive state: parity confirmed
- settings/text metadata: parity confirmed
- public data hashes: parity confirmed

## Authenticated admin state parity — PASS

- total albums: 17 / 17
  - published: 16 / 16
  - draft: 1 / 1
- total image rows exposed by admin: 200 / 200
  - ready: 193
  - pending: 7
- categories: 10 / 10
- inquiries: 1 / 1
- albums + image metadata hash: exact parity
- categories hash: exact parity
- settings hash: exact parity
- inquiries hash: exact parity
- destination admin login: verified with same account identity as source

## Pending media — CLOSED

The 7 pending image rows all belong to `Jogo do Grêmio` and were created within seconds on 2026-08-13.

Authenticated reads of `thumb`, `card`, and `gallery` return 404 for all 7 rows on the source. No recoverable media bytes are exposed for these rows. They are treated as incomplete upload records, not missing ready photographs.

## Original media storage parity — PASS

All 193 `ready` source images were compared against their actual destination source storage without passing through Cloudflare Images transformations.

- ready images checked: 193
- byte-for-byte matches: 193
- mismatches: 0
- repo-backed `static:` originals: 113
- destination R2 originals: 80
- source bytes: 274,972,089
- destination stored bytes: 274,972,089

The transformed `/gallery` endpoint is intentionally not a byte-integrity gate because the destination uses Cloudflare Images while the old Sites deployment returned source bodies directly.

## Dynamic photographs — RECOVERED

- 80 dynamic public originals recovered from the live Site
- copied to destination R2
- independent backup copied to Google Drive in split ZIP parts with SHA-256 manifest
- 112 static public photographs remain repo-backed
- one additional private ready image is repo-backed
- full ready-image set: 113 static + 80 R2 = 193

## Studio — ACTIVATED AND VERIFIED

Source Studio state preserved:

- schemaVersion: 4
- source draft revision at capture: 11
- source preset: `aconchegante-organico`
- source current config SHA-256: `d4f670675b0a34bb399042e9b262ab65dfe1757c64c3c93fcaa2652f614dd5f1`

The same current configuration was applied to the destination using the application's own authenticated Studio PATCH + publish APIs.

Post-activation validation:

- source config hash = destination Studio config hash
- source config hash = destination public config hash
- destination has no unpublished Studio changes
- public Studio state is activated
- custom domain remained untouched

Historical source summaries retained:

1. `fc5af17d-56fa-41e8-94ab-021870eaad73` — 2026-08-23T01:28:27.155Z — source current
2. `5dff557e-aca6-4996-bd75-2ef5883f3808` — 2026-08-23T00:44:16.681Z
3. `site-published-initial` — 2026-08-23T00:10:09.239Z

Strict historical `config_json` parity for the intermediate version remains unavailable without raw source D1 access; this is accepted as a forensic-only gap.

## Private backup — PASS

A raw JSON snapshot of all state exposed through the authenticated admin APIs is stored in the destination private R2 backups bucket with SHA-256 recorded in the sanitized migration result.

## Pre-Studio D1 checkpoint — PASS AND RESTORE-VALIDATED

- key: `migration/checkpoints/pre-studio/2026-08-23T18-24-54-745Z.sql`
- bytes: 140,324
- SHA-256: `27a9baf2caaabcc05c7166a87ab1b53175de0153dcad76c316fd881f9ef83731`

The SQL was downloaded from R2 and restored into disposable local SQLite. `integrity_check`, foreign keys, byte length, SHA-256 and all row counts passed. No destination D1 write occurred during restore validation.

## Post-Studio D1 backup — PASS / R2 + GOOGLE DRIVE

A fresh D1 export was created after Studio activation and the Git-driven deploy.

- created: `2026-08-23T18:47:39.677Z`
- bytes: 148,078
- SHA-256: `262c33257c788798fc6e61b2410ce8cd317f08bbcb6ac70917609e03a7161f8a`
- R2 key: `backups/d1/drive/2026-08-23T18-47-39-677Z.sql`
- Google Drive file: `punctum-d1-2026-08-23-post-studio.zip`

Post-Studio row counts include:

- `admin_credentials`: 1
- `album_categories`: 17
- `albums`: 17
- `audit_log`: 1
- `categories`: 10
- `images`: 200
- `inquiries`: 1
- `site_config_pointers`: 1
- `site_config_versions`: 3
- `site_settings`: 1

D1 remains the live transactional database. Google Drive is an external backup/archive target, not the runtime database.

## Forensic-only gaps — ACCEPTED

A raw source D1 export would still be required only to reproduce historical/operational rows byte-for-byte, including:

- source `audit_log`
- soft-deleted rows
- full historical `upload_intents`
- original source `admin_credentials` row
- exact historical `site_config_versions.config_json` bodies
- exact source pointer metadata
- old `backup_runs` / `rate_limit_buckets`

These gaps are not required for current Punctum functionality and no longer block the migration.

## Remaining cutover step

Application/data migration gates are complete on the Cloudflare Worker.

The remaining production cutover is custom-domain/DNS routing for:

- `punctumpicture.com`
- `www.punctumpicture.com`

Until that separate DNS step is performed, the existing custom domain remains on the old Sites deployment while the migrated application is live and validated on `workers.dev`.
