import fs from 'node:fs';

const DEST = 'https://punctum-picture-migration.menezesx2k26.workers.dev';
const RESULT = '/tmp/destination-admin-bootstrap-result.json';

function writeResult(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');

  let lastError = null;
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
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
        const res = await fetch(`${DEST}${path}`, {
          headers: { Cookie: cookie, Accept: 'application/json' },
          redirect: 'follow',
        });
        if (!res.ok) throw new Error(`destination_${path}_http_${res.status}`);
        return res.json();
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
        attempt,
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
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < 6) await sleep(5000);
    }
  }

  throw new Error(lastError || 'destination_admin_verification_failed');
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
