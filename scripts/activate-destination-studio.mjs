import fs from 'node:fs';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const DESTINATION = 'https://punctum-picture-migration.menezesx2k26.workers.dev';
const SOURCE_SNAPSHOT = 'requests/source-public-state-result.json';
const RESULT = '/tmp/destination-studio-activation-result.json';

function write(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

function hash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('destination_admin_credentials_missing');

  const snapshot = JSON.parse(fs.readFileSync(SOURCE_SNAPSHOT, 'utf8'));
  const sourceConfig = snapshot?.site?.siteConfig;
  if (!sourceConfig || sourceConfig.schemaVersion !== 4) throw new Error('source_site_config_missing_or_invalid');

  const login = await fetch(`${DESTINATION}/admin/api/session`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Origin: DESTINATION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`destination_login_http_${login.status}`);
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error('destination_session_cookie_missing');

  async function adminJson(path, options = {}) {
    const response = await fetch(`${DESTINATION}${path}`, {
      ...options,
      headers: {
        Cookie: cookie,
        Accept: 'application/json',
        Origin: DESTINATION,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
      redirect: 'follow',
    });
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { body = { raw: text.slice(0, 500) }; }
    if (!response.ok) throw new Error(`${path}_http_${response.status}:${JSON.stringify(body).slice(0, 600)}`);
    return body;
  }

  const before = await adminJson('/admin/api/studio');
  const beforeRevision = Number(before.revision || 0);
  if (!beforeRevision) throw new Error('destination_studio_revision_missing');

  let published = before;
  let changed = false;

  if (!isDeepStrictEqual(before.siteConfig, sourceConfig) || before.hasUnpublishedChanges) {
    const patched = await adminJson('/admin/api/studio', {
      method: 'PATCH',
      body: JSON.stringify({ siteConfig: sourceConfig, revision: beforeRevision }),
    });

    published = await adminJson('/admin/api/studio/publish', {
      method: 'POST',
      body: JSON.stringify({ revision: patched.revision }),
    });
    changed = true;
  }

  const after = await adminJson('/admin/api/studio');
  if (after.hasUnpublishedChanges) throw new Error('destination_studio_still_has_unpublished_changes');
  if (!isDeepStrictEqual(after.siteConfig, sourceConfig)) throw new Error('destination_studio_config_mismatch_after_publish');

  const publicResponse = await fetch(`${DESTINATION}/api/public/site`, {
    headers: { Accept: 'application/json' },
    redirect: 'follow',
  });
  if (!publicResponse.ok) throw new Error(`destination_public_site_http_${publicResponse.status}`);
  const publicBody = await publicResponse.json();
  if (!isDeepStrictEqual(publicBody?.siteConfig, sourceConfig)) {
    throw new Error('destination_public_site_config_mismatch');
  }

  write({
    status: 'success',
    activatedAt: new Date().toISOString(),
    destination: DESTINATION,
    changed,
    beforeRevision,
    afterRevision: after.revision ?? published.revision ?? null,
    hasUnpublishedChanges: Boolean(after.hasUnpublishedChanges),
    sourceConfigSha256: hash(sourceConfig),
    destinationConfigSha256: hash(after.siteConfig),
    publicConfigSha256: hash(publicBody.siteConfig),
    sourcePresetId: sourceConfig.identity?.sourcePresetId ?? null,
    publicStudioActivated: true,
    domainTouched: false,
  });
}

main().catch((error) => {
  write({
    status: 'failed',
    error: error instanceof Error ? error.message.slice(0, 1800) : String(error).slice(0, 1800),
    publicStudioActivated: false,
    domainTouched: false,
  });
  process.exitCode = 1;
});
