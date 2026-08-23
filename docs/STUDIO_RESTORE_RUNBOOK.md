# Punctum — Studio restore runbook

Status: PREPARED / NOT AUTHORIZED / NOT EXECUTED

This runbook exists so that restoring the live Studio state can be performed deterministically after the migration gate is released. It is intentionally **not wired to any GitHub Actions trigger**.

## Non-negotiable guard

Do not restore or activate the source Studio state until one of these is true:

1. a raw forensic export of the source D1 has been obtained and compared/imported; or
2. the owner explicitly changes the migration requirement and accepts functional-state parity instead of strict forensic parity.

The current requirement is strict parity. Therefore option 1 remains required.

## Known source Studio state

- schema version: 4
- draft revision: 11
- has unpublished changes: false
- updated at: `2026-08-23T01:28:27.155Z`
- current published version: `fc5af17d-56fa-41e8-94ab-021870eaad73`
- current config body: preserved in the authenticated source snapshot and private R2 migration backup
- current preset: `aconchegante-organico`

Known source published history summaries:

1. `fc5af17d-56fa-41e8-94ab-021870eaad73` — 2026-08-23T01:28:27.155Z — current
2. `5dff557e-aca6-4996-bd75-2ef5883f3808` — 2026-08-23T00:44:16.681Z
3. `site-published-initial` — 2026-08-23T00:10:09.239Z

The intermediate version body is not exposed by the application API and must come from the raw source D1 export.

## Rollback boundary already verified

Before any Studio restoration, the destination D1 was exported to:

`punctum-picture-backups/migration/checkpoints/pre-studio/2026-08-23T18-24-54-745Z.sql`

SHA-256:

`27a9baf2caaabcc05c7166a87ab1b53175de0153dcad76c316fd881f9ef83731`

The SQL was downloaded and restored into disposable SQLite. SHA, byte length, integrity check, foreign-key check, and every table count passed.

## Restore procedure after forensic gate passes

1. Capture one final read-only snapshot of source public/admin state.
2. Compare raw source D1 export against the last source API snapshot.
3. Preserve/import exact source rows for:
   - `site_config_versions`
   - `site_config_pointers`
   - any source history required by the forensic migration
4. Do not synthesize the missing 00:44 version body.
5. Verify the destination pointer references the exact source current published version ID.
6. Verify destination draft revision = 11 and `hasUnpublishedChanges = false`.
7. Verify canonical Studio config hash source = destination.
8. Run authenticated `/admin/api/studio` parity check.
9. Run public `/api/public/site` parity check on workers.dev.
10. Run public page smoke tests and asset/media checks.
11. If any gate fails, restore the verified pre-Studio D1 checkpoint before continuing.

## Post-restore expected visual state

Expected public Studio-derived properties include:

- preset `aconchegante-organico`
- Fraunces headings
- Nunito Sans body
- editorial heading scale
- normal heading tracking
- soft radius
- soft image treatment
- split home hero
- side-portrait home about
- current source footer tagline and editorial copy

These values are listed only as validation expectations. They must not be reconstructed manually when exact persisted source data is available.

## Still forbidden after Studio restore

Restoring the Studio on the isolated workers.dev destination does **not** authorize custom-domain cutover. DNS/routes remain blocked until final authenticated/public parity and backup/cron validation pass and the owner explicitly authorizes the production cutover.
