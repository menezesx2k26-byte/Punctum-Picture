# Punctum — Migration Parity Ledger

Updated: 2026-08-23

This file is the authoritative migration ledger for moving the live Punctum Site from managed ChatGPT Sites storage to the owner's Cloudflare account.

## Hard rule

Do not activate the migrated Studio visual state on the destination public site and do not touch custom-domain DNS/routes until the migration gates below are complete.

## Destination infrastructure

- Worker: `punctum-picture-migration`
- D1: `punctum-picture`
- D1 id: `22697f13-7484-41e3-9441-f7b902c6577a`
- R2 originals: `punctum-picture-originals`
- R2 backups: `punctum-picture-backups`
- workers.dev isolated validation only
- custom domain untouched
- build/typecheck/lint/tests green

## Public state parity — PASS

Live source and isolated destination have been compared through the public application APIs.

- published albums: 16 / 16
- public photos: 192 / 192
- public category count: 7 / 7
- complete category records available: 10 / 10
- public album/archive state: parity confirmed
- settings/text metadata: parity confirmed
- public data hashes: parity confirmed after import

## Authenticated admin state parity — PASS except Studio activation

Authenticated comparison using the normal `/acesso` credentials confirmed:

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

The transformed `/gallery` endpoint is intentionally not a byte-integrity gate: the destination has a Cloudflare Images binding and transforms responses, while the source deployment currently returns the source body directly.

## Dynamic photographs — RECOVERED

- 80 dynamic public originals recovered from the live Site
- copied to destination R2
- independent backup copied to Google Drive in split ZIP parts with SHA-256 manifest
- 112 static public photographs remain repo-backed
- one additional private ready image is repo-backed, bringing the original ready-image set to 113 static + 80 R2 = 193

## Studio — CURRENT STATE PRESERVED, NOT ACTIVATED

Source Studio:

- schemaVersion: 4
- draft revision: 11
- hasUnpublishedChanges: false
- updatedAt: `2026-08-23T01:28:27.155Z`
- current preset: `aconchegante-organico`
- current published version id: `fc5af17d-56fa-41e8-94ab-021870eaad73`
- current config body captured in the private migration backup

Source published history summaries:

1. `fc5af17d-56fa-41e8-94ab-021870eaad73` — 2026-08-23T01:28:27.155Z — current
2. `5dff557e-aca6-4996-bd75-2ef5883f3808` — 2026-08-23T00:44:16.681Z
3. `site-published-initial` — 2026-08-23T00:10:09.239Z

Destination Studio remains deliberately on its destination/default pointer. The source visual state must not be activated until the migration gate is explicitly released.

## Private backup — PASS

A raw JSON snapshot of all state exposed through the authenticated admin APIs was written to the destination private backups R2 bucket. The sanitized Git result records its R2 key and SHA-256.

## Destination D1 checkpoint — IN PROGRESS

Before any future Studio restoration/activation, export the current destination D1 to the private backups R2 bucket and record SHA-256 plus per-table row counts. This checkpoint is a rollback boundary for the fully migrated non-Studio state.

## Forensic D1 parity — BLOCKED BY SOURCE RAW D1 ACCESS

The application APIs do not expose every physical D1 row. A raw D1 export is still required for strict forensic parity of:

- `audit_log`
- soft-deleted rows
- full `upload_intents`
- original `admin_credentials` row (credential has been safely recreated on destination)
- exact historical `site_config_versions.config_json` bodies, especially the intermediate 00:44 version
- exact source `site_config_pointers` row metadata
- operational tables such as `backup_runs` and `rate_limit_buckets`

The current Studio configuration is preserved. The principal user-visible historical gap is the body of the intermediate Studio published version; the remaining gaps are forensic/operational state.

## Cutover gate

Custom domain / DNS / routes remain BLOCKED until:

1. destination D1 checkpoint is stored and verified;
2. raw D1 forensic export is obtained, or the owner explicitly accepts functional-state parity in lieu of forensic parity;
3. source Studio state is restored with the intended pointer/history policy;
4. authenticated admin smoke checks pass;
5. public parity audit passes after the final sync;
6. backup/cron behavior is validated on the owner Cloudflare account.

Only after those gates may the destination be considered eligible for domain cutover.
