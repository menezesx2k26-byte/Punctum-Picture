import crypto from 'node:crypto';
import fs from 'node:fs';

const SOURCE = 'https://punctumpicture.com';
const DEST = 'https://punctum-picture-migration.menezesx2k26.workers.dev';
const RESULT = '/tmp/media-byte-parity-result.json';

function write(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

async function login(origin, email, password) {
  const response = await fetch(`${origin}/admin/api/session`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`login_${origin}_http_${response.status}`);
  const cookie = (response.headers.get('set-cookie') || '').split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error(`login_${origin}_cookie_missing`);
  return cookie;
}

async function adminJson(origin, cookie, path) {
  const response = await fetch(`${origin}${path}`, {
    headers: { Cookie: cookie, Accept: 'application/json' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`${origin}_${path}_http_${response.status}`);
  return response.json();
}

async function allImages(origin, cookie) {
  const list = await adminJson(origin, cookie, '/admin/api/albums');
  const images = [];
  for (const summary of list.albums || []) {
    const detail = await adminJson(origin, cookie, `/admin/api/albums/${encodeURIComponent(summary.id)}`);
    for (const image of detail.album?.images || []) {
      images.push({
        id: image.id,
        status: image.status,
        albumId: detail.album.id,
        albumTitle: detail.album.title,
      });
    }
  }
  return images;
}

async function media(origin, cookie, id) {
  const response = await fetch(`${origin}/admin/media/${encodeURIComponent(id)}/gallery`, {
    headers: { Cookie: cookie, Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!response.ok) {
    return { status: response.status, bytes: null, sha256: null, contentType: response.headers.get('content-type') };
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    status: response.status,
    bytes: bytes.length,
    sha256: sha256(bytes),
    contentType: response.headers.get('content-type'),
  };
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');

  const [sourceCookie, destCookie] = await Promise.all([
    login(SOURCE, email, password),
    login(DEST, email, password),
  ]);

  const [sourceImages, destImages] = await Promise.all([
    allImages(SOURCE, sourceCookie),
    allImages(DEST, destCookie),
  ]);

  const sourceById = new Map(sourceImages.map((image) => [String(image.id), image]));
  const destById = new Map(destImages.map((image) => [String(image.id), image]));
  const readyIds = [...sourceById.values()].filter((image) => image.status === 'ready').map((image) => String(image.id)).sort();
  const destReadyIds = [...destById.values()].filter((image) => image.status === 'ready').map((image) => String(image.id)).sort();

  const missingInDestination = readyIds.filter((id) => !destById.has(id));
  const extraInDestination = destReadyIds.filter((id) => !sourceById.has(id));
  if (missingInDestination.length || extraInDestination.length) {
    write({
      status: 'failed',
      error: 'ready_image_id_set_mismatch',
      sourceReady: readyIds.length,
      destinationReady: destReadyIds.length,
      missingInDestination,
      extraInDestination,
      sourceReadOnly: true,
      destinationReadOnly: true,
      domainTouched: false,
      publicStudioActivated: false,
    });
    process.exitCode = 1;
    return;
  }

  const mismatches = [];
  let matched = 0;
  let sourceBytes = 0;
  let destinationBytes = 0;
  const concurrency = 6;
  let cursor = 0;

  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= readyIds.length) return;
      const id = readyIds[index];
      const [sourceMedia, destMedia] = await Promise.all([
        media(SOURCE, sourceCookie, id),
        media(DEST, destCookie, id),
      ]);
      sourceBytes += sourceMedia.bytes || 0;
      destinationBytes += destMedia.bytes || 0;
      const same = sourceMedia.status === 200 && destMedia.status === 200 &&
        sourceMedia.bytes === destMedia.bytes && sourceMedia.sha256 === destMedia.sha256;
      if (same) {
        matched += 1;
      } else {
        mismatches.push({
          id,
          albumTitle: sourceById.get(id)?.albumTitle ?? null,
          source: sourceMedia,
          destination: destMedia,
        });
      }
      if ((index + 1) % 25 === 0) console.log(`checked ${index + 1}/${readyIds.length}`);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const pendingIds = [...sourceById.values()].filter((image) => image.status === 'pending').map((image) => String(image.id)).sort();
  const pendingChecks = [];
  for (const id of pendingIds) {
    const [sourceMedia, destMedia] = await Promise.all([
      media(SOURCE, sourceCookie, id),
      media(DEST, destCookie, id),
    ]);
    pendingChecks.push({ id, sourceStatus: sourceMedia.status, destinationStatus: destMedia.status });
  }

  write({
    status: mismatches.length === 0 ? 'success' : 'failed',
    checkedAt: new Date().toISOString(),
    sourceReadOnly: true,
    destinationReadOnly: true,
    readyImages: readyIds.length,
    readyMatchedByteForByte: matched,
    readyMismatches: mismatches.length,
    sourceBytes,
    destinationBytes,
    mismatches: mismatches.slice(0, 25),
    pendingImages: pendingIds.length,
    pendingAllUnavailableInBoth: pendingChecks.every((item) => item.sourceStatus === 404 && item.destinationStatus === 404),
    pendingChecks,
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
    destinationReadOnly: true,
    domainTouched: false,
    publicStudioActivated: false,
  });
  process.exitCode = 1;
});
