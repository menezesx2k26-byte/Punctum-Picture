import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const SOURCE = 'https://punctumpicture.com';
const RESULT = '/tmp/source-pending-media-probe-result.json';
const BUCKET = 'punctum-picture-originals';

function write(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

function ext(contentType) {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/avif') return 'avif';
  if (type === 'image/gif') return 'gif';
  return 'bin';
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');

  const login = await fetch(`${SOURCE}/admin/api/session`, {
    method: 'POST',
    redirect: 'manual',
    headers: { Origin: SOURCE, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`source_login_http_${login.status}`);
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error('source_session_cookie_missing');

  async function adminJson(urlPath) {
    const response = await fetch(`${SOURCE}${urlPath}`, {
      headers: { Cookie: cookie, Accept: 'application/json' },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`${urlPath}_http_${response.status}`);
    return response.json();
  }

  const list = await adminJson('/admin/api/albums');
  const details = [];
  for (const summary of list.albums || []) {
    const body = await adminJson(`/admin/api/albums/${encodeURIComponent(summary.id)}`);
    details.push(body.album);
  }

  const pending = details.flatMap((album) =>
    (album.images || [])
      .filter((image) => image.status === 'pending')
      .map((image) => ({
        id: image.id,
        albumId: album.id,
        albumStatus: album.status,
        expectedSize: image.sizeBytes ?? null,
        createdAt: image.createdAt ?? null,
      })),
  );

  const recoveredDir = '/tmp/punctum-pending-recovered';
  fs.rmSync(recoveredDir, { recursive: true, force: true });
  fs.mkdirSync(recoveredDir, { recursive: true });

  const probes = [];
  let recovered = 0;
  for (const item of pending) {
    const statuses = {};
    let recoveredKey = null;
    let recoveredSha256 = null;
    let recoveredBytes = null;

    for (const variant of ['thumb', 'card', 'gallery']) {
      const response = await fetch(`${SOURCE}/admin/media/${encodeURIComponent(item.id)}/${variant}`, {
        headers: { Cookie: cookie, Accept: 'image/*' },
        redirect: 'manual',
      });
      statuses[variant] = {
        status: response.status,
        contentType: response.headers.get('content-type'),
      };

      if (variant === 'gallery' && response.ok) {
        const bytes = Buffer.from(await response.arrayBuffer());
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        recoveredSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
        recoveredBytes = bytes.length;
        const extension = ext(contentType);
        const filePath = path.join(recoveredDir, `${item.id}.${extension}`);
        fs.writeFileSync(filePath, bytes);
        recoveredKey = `migration/source-pending-recovered/${item.id}.${extension}`;
        execFileSync('wrangler', [
          'r2', 'object', 'put', `${BUCKET}/${recoveredKey}`,
          '--file', filePath,
          '--content-type', contentType,
          '--remote',
        ], { stdio: 'pipe', env: process.env });
        recovered += 1;
      }
    }

    probes.push({ ...item, statuses, recoveredKey, recoveredSha256, recoveredBytes });
  }

  const byStatus = {};
  for (const probe of probes) {
    const code = String(probe.statuses.gallery?.status ?? 'unknown');
    byStatus[code] = (byStatus[code] || 0) + 1;
  }
  const byAlbumStatus = {};
  for (const probe of probes) {
    byAlbumStatus[probe.albumStatus] = (byAlbumStatus[probe.albumStatus] || 0) + 1;
  }

  write({
    status: 'success',
    checkedAt: new Date().toISOString(),
    sourceReadOnly: true,
    pendingCount: pending.length,
    recoveredCount: recovered,
    galleryHttpStatuses: byStatus,
    pendingByAlbumStatus: byAlbumStatus,
    probes,
    conclusion:
      recovered > 0
        ? 'At least one pending database row still exposed retrievable media; recovered bytes were copied to destination R2.'
        : 'No pending database row exposed retrievable media through the authenticated application media routes.',
    domainTouched: false,
    publicStudioActivated: false,
  });
}

main().catch((error) => {
  write({
    status: 'failed',
    error: error instanceof Error ? error.message : String(error),
    sourceReadOnly: true,
    domainTouched: false,
    publicStudioActivated: false,
  });
  process.exitCode = 1;
});
