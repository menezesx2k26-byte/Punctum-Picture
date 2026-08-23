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

async function cf(path, options = {}) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_D1_API_TOKEN;
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = { raw: text.slice(0, 500) }; }
  if (!res.ok || payload?.success === false) {
    throw new Error(`cloudflare_${res.status}:${JSON.stringify(payload?.errors || payload).slice(0, 800)}`);
  }
  return payload;
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_D1_API_TOKEN || !process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error('cloudflare_credentials_missing');
  }

  const dbList = await cf('/d1/database');
  const db = (dbList.result || []).find((item) => item.name === 'punctum-picture');
  const dbId = db?.uuid || db?.id;
  if (!dbId) throw new Error('destination_d1_not_found');

  const salt = crypto.randomBytes(16);
  const iterations = 60000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  const now = new Date().toISOString();
  const sql = `INSERT INTO admin_credentials (id,password_hash,password_salt,password_iterations,updated_at,updated_by)
    VALUES (1,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET password_hash=excluded.password_hash,password_salt=excluded.password_salt,
      password_iterations=excluded.password_iterations,updated_at=excluded.updated_at,updated_by=excluded.updated_by`;
  const q = await cf(`/d1/database/${dbId}/query`, {
    method: 'POST',
    body: JSON.stringify({ sql, params: [b64url(hash), b64url(salt), iterations, now, 'migration-admin-bootstrap'] }),
  });
  if ((q.result || [])[0]?.success === false) throw new Error('admin_credentials_write_failed');

  const sessionSecret = b64url(crypto.randomBytes(48));
  const env = process.env;
  execFileSync('wrangler', ['secret', 'put', 'ADMIN_SESSION_SECRET', '--name', WORKER], { input: sessionSecret, stdio: ['pipe','pipe','pipe'], env });
  execFileSync('wrangler', ['secret', 'put', 'ADMIN_ALLOWED_EMAILS', '--name', WORKER], { input: email.trim().toLowerCase(), stdio: ['pipe','pipe','pipe'], env });

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
    const res = await fetch(`${DEST}${path}`, { headers: { Cookie: cookie, Accept: 'application/json' }, redirect: 'follow' });
    if (!res.ok) throw new Error(`destination_${path}_http_${res.status}`);
    return res.json();
  }

  const [me, albums, studio, inquiries, categories] = await Promise.all([
    adminJson('/admin/api/me'),
    adminJson('/admin/api/albums'),
    adminJson('/admin/api/studio'),
    adminJson('/admin/api/inquiries'),
    adminJson('/admin/api/categories'),
  ]);

  const albumList = albums.albums || [];
  const counts = albumList.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  writeResult({
    status: 'success',
    configuredAt: new Date().toISOString(),
    worker: WORKER,
    destination: DEST,
    adminLoginVerified: true,
    authenticatedEmailMatchesSource: String(me?.identity?.email || me?.email || '').toLowerCase() === email.trim().toLowerCase(),
    counts: {
      albums: albumList.length,
      albumStatuses: counts,
      categories: (categories.categories || []).length,
      inquiries: (inquiries.inquiries || []).length,
      studioHistorySummaries: Array.isArray(studio.history) ? studio.history.length : 0,
    },
    studio: {
      revision: studio.revision ?? null,
      hasUnpublishedChanges: Boolean(studio.hasUnpublishedChanges),
      visualSourceStillDestinationDefault: true,
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
