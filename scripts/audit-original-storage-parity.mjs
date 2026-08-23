import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SOURCE = 'https://punctumpicture.com';
const RESULT = '/tmp/original-storage-parity-result.json';
const BUCKET = 'punctum-picture-originals';

function write(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

async function login(email, password) {
  const response = await fetch(`${SOURCE}/admin/api/session`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Origin: SOURCE,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`source_login_http_${response.status}`);
  const cookie = (response.headers.get('set-cookie') || '').split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error('source_login_cookie_missing');
  return cookie;
}

async function adminJson(cookie, pathname) {
  const response = await fetch(`${SOURCE}${pathname}`, {
    headers: { Cookie: cookie, Accept: 'application/json' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`source_${pathname}_http_${response.status}`);
  return response.json();
}

async function sourceReadyImages(cookie) {
  const list = await adminJson(cookie, '/admin/api/albums');
  const images = [];
  for (const summary of list.albums || []) {
    const detail = await adminJson(cookie, `/admin/api/albums/${encodeURIComponent(summary.id)}`);
    for (const image of detail.album?.images || []) {
      if (image.status === 'ready') {
        images.push({ id: String(image.id), albumTitle: detail.album.title });
      }
    }
  }
  images.sort((a, b) => a.id.localeCompare(b.id));
  return images;
}

async function destinationRows() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_D1_API_TOKEN;
  if (!accountId || !token) throw new Error('destination_d1_credentials_missing');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const listRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, { headers });
  const list = await listRes.json();
  if (!listRes.ok || list?.success === false) throw new Error(`d1_list_http_${listRes.status}`);
  const db = (list.result || []).find((item) => item.name === 'punctum-picture');
  const dbId = db?.uuid || db?.id;
  if (!dbId) throw new Error('destination_d1_missing');
  const queryRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ sql: "SELECT id, original_key AS originalKey, status FROM images WHERE deleted_at IS NULL ORDER BY id" }),
  });
  const payload = await queryRes.json();
  if (!queryRes.ok || payload?.success === false || payload?.result?.[0]?.success === false) {
    throw new Error(`d1_query_http_${queryRes.status}`);
  }
  return new Map((payload.result?.[0]?.results || []).map((row) => [String(row.id), row]));
}

async function sourceOriginal(cookie, id) {
  const response = await fetch(`${SOURCE}/admin/media/${encodeURIComponent(id)}/gallery`, {
    headers: { Cookie: cookie, Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`source_media_${id}_http_${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

function localStatic(originalKey) {
  const pathname = originalKey.slice('static:'.length);
  if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('..')) {
    throw new Error(`invalid_static_key:${originalKey}`);
  }
  const localPath = path.join(process.cwd(), 'public', pathname.slice(1));
  if (!fs.existsSync(localPath)) throw new Error(`static_file_missing:${pathname}`);
  return fs.readFileSync(localPath);
}

function r2Object(originalKey, id) {
  const temp = path.join(os.tmpdir(), `punctum-r2-${id}`);
  fs.rmSync(temp, { force: true });
  execFileSync('wrangler', [
    'r2', 'object', 'get', `${BUCKET}/${originalKey}`,
    '--file', temp,
    '--remote',
  ], { stdio: 'pipe', env: process.env });
  const bytes = fs.readFileSync(temp);
  fs.rmSync(temp, { force: true });
  return bytes;
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');

  const cookie = await login(email, password);
  const [ready, rows] = await Promise.all([sourceReadyImages(cookie), destinationRows()]);

  const missingRows = ready.filter((item) => !rows.has(item.id)).map((item) => item.id);
  if (missingRows.length) throw new Error(`destination_ready_rows_missing:${missingRows.join(',')}`);

  let matched = 0;
  let staticCount = 0;
  let r2Count = 0;
  let sourceBytes = 0;
  let storedBytes = 0;
  const mismatches = [];

  for (let index = 0; index < ready.length; index++) {
    const item = ready[index];
    const row = rows.get(item.id);
    const originalKey = String(row.originalKey || '');
    const sourceBytesBuffer = await sourceOriginal(cookie, item.id);
    let stored;
    let storage;
    if (originalKey.startsWith('static:')) {
      storage = 'git-static';
      staticCount += 1;
      stored = localStatic(originalKey);
    } else {
      storage = 'r2';
      r2Count += 1;
      stored = r2Object(originalKey, item.id);
    }

    const sourceHash = sha256(sourceBytesBuffer);
    const storedHash = sha256(stored);
    sourceBytes += sourceBytesBuffer.length;
    storedBytes += stored.length;
    if (sourceBytesBuffer.length === stored.length && sourceHash === storedHash) {
      matched += 1;
    } else {
      mismatches.push({
        id: item.id,
        albumTitle: item.albumTitle,
        storage,
        originalKey,
        sourceBytes: sourceBytesBuffer.length,
        storedBytes: stored.length,
        sourceSha256: sourceHash,
        storedSha256: storedHash,
      });
    }
    if ((index + 1) % 20 === 0) console.log(`verified ${index + 1}/${ready.length}`);
  }

  write({
    status: mismatches.length === 0 ? 'success' : 'failed',
    checkedAt: new Date().toISOString(),
    sourceReadOnly: true,
    destinationStorageReadOnly: true,
    readyImages: ready.length,
    matchedByteForByte: matched,
    mismatches: mismatches.length,
    storage: { staticGit: staticCount, r2: r2Count },
    sourceBytes,
    storedBytes,
    mismatchDetails: mismatches.slice(0, 30),
    domainTouched: false,
    publicStudioActivated: false,
  });

  if (mismatches.length) process.exitCode = 1;
}

main().catch((error) => {
  write({
    status: 'failed',
    error: error instanceof Error ? error.message : String(error),
    sourceReadOnly: true,
    destinationStorageReadOnly: true,
    domainTouched: false,
    publicStudioActivated: false,
  });
  process.exitCode = 1;
});
