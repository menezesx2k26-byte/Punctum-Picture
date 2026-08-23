import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const DEST = 'https://punctum-picture-migration.menezesx2k26.workers.dev';
const WORKER = 'punctum-picture-migration';
const RESULT = '/tmp/destination-admin-bootstrap-result.json';

function writeResult(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');
  if (!process.env.CLOUDFLARE_API_TOKEN) throw new Error('cloudflare_api_token_missing');

  const env = process.env;
  execFileSync('wrangler', ['secret', 'put', 'ADMIN_ALLOWED_EMAILS', '--name', WORKER], {
    input: email.trim().toLowerCase(),
    stdio: ['pipe','pipe','pipe'],
    env,
  });
  await sleep(10000);

  const sessionSecret = b64url(crypto.randomBytes(48));
  execFileSync('wrangler', ['secret', 'put', 'ADMIN_SESSION_SECRET', '--name', WORKER], {
    input: sessionSecret,
    stdio: ['pipe','pipe','pipe'],
    env,
  });

  await sleep(60000);

  const login = await fetch(`${DEST}/admin/api/session`, {
    method: 'POST',
    redirect: 'manual',
    headers: { Origin: DEST, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`destination_login_http_${login.status}`);
  const setCookie = login.headers.get('set-cookie') || '';
  const cookie = setCookie.split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error('destination_session_cookie_missing');

  async function adminJson(path) {
    let lastStatus = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      const res = await fetch(`${DEST}${path}`, {
        headers: { Cookie: cookie, Accept: 'application/json' },
        redirect: 'follow',
      });
      if (res.ok) return res.json();
      lastStatus = res.status;
      if (attempt < 4) await sleep(5000);
    }
    throw new Error(`destination_${path}_http_${lastStatus}`);
  }

  const me = await adminJson('/admin/api/me');
  const albums = await adminJson('/admin/api/albums');
  const studio = await adminJson('/admin/api/studio');
  const inquiries = await adminJson('/admin/api/inquiries');
  const categories = await adminJson('/admin/api/categories');

  const albumList = albums.albums || [];
  const albumStatuses = albumList.reduce((acc, album) => {
    acc[album.status] = (acc[album.status] || 0) + 1;
    return acc;
  }, {});

  writeResult({
    status: 'success',
    verifiedAt: new Date().toISOString(),
    destination: DEST,
    adminLoginVerified: true,
    authenticatedEmailMatchesSource: String(me?.identity?.email || me?.email || '').toLowerCase() === email.trim().toLowerCase(),
    counts: {
      albums: albumList.length,
      albumStatuses,
      categories: (categories.categories || []).length,
      inquiries: (inquiries.inquiries || []).length,
      studioHistorySummaries: Array.isArray(studio.history) ? studio.history.length : 0,
    },
    studio: {
      revision: studio.revision ?? null,
      hasUnpublishedChanges: Boolean(studio.hasUnpublishedChanges),
      source: studio.source ?? null,
    },
    domainTouched: false,
    publicStudioActivated: false,
  });
}

main().catch((error) => {
  writeResult({
    status: 'failed',
    error: error instanceof Error ? error.message : String(error),
    domainTouched: false,
    publicStudioActivated: false,
  });
  process.exitCode = 1;
});
