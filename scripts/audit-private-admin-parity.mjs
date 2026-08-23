import crypto from 'node:crypto';
import fs from 'node:fs';

const SOURCE = 'https://punctumpicture.com';
const DEST = 'https://punctum-picture-migration.menezesx2k26.workers.dev';
const RESULT = '/tmp/private-admin-parity-result.json';

function sha(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])]));
  }
  return value;
}

function stripUrls(value) {
  if (Array.isArray(value)) return value.map(stripUrls);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (['url','thumbUrl','coverUrl','ogImageUrl','uploadUrl'].includes(k)) continue;
      if (['createdAt','updatedAt'].includes(k)) continue;
      out[k] = stripUrls(v);
    }
    return out;
  }
  return value;
}

function diffPaths(a, b, path = '$', out = []) {
  if (Object.is(a, b)) return out;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) out.push(`${path}.length`);
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n && out.length < 100; i++) diffPaths(a[i], b[i], `${path}[${i}]`, out);
    return out;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
    for (const key of keys) {
      if (out.length >= 100) break;
      if (!(key in a) || !(key in b)) out.push(`${path}.${key}`);
      else diffPaths(a[key], b[key], `${path}.${key}`, out);
    }
    return out;
  }
  out.push(path);
  return out;
}

async function login(origin, email, password) {
  const res = await fetch(`${origin}/admin/api/session`, {
    method: 'POST', redirect: 'manual',
    headers: { Origin: origin, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`${origin}_login_http_${res.status}`);
  const cookie = (res.headers.get('set-cookie') || '').split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error(`${origin}_cookie_missing`);
  return cookie;
}

async function getJson(origin, cookie, path) {
  const res = await fetch(`${origin}${path}`, { headers: { Cookie: cookie, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${origin}_${path}_http_${res.status}`);
  return res.json();
}

async function snapshot(origin, cookie) {
  const [albumListPayload, categories, settings, inquiries, studio] = await Promise.all([
    getJson(origin, cookie, '/admin/api/albums'),
    getJson(origin, cookie, '/admin/api/categories'),
    getJson(origin, cookie, '/admin/api/settings'),
    getJson(origin, cookie, '/admin/api/inquiries'),
    getJson(origin, cookie, '/admin/api/studio'),
  ]);
  const albumList = albumListPayload.albums || [];
  const albums = [];
  for (const album of albumList) {
    const detail = await getJson(origin, cookie, `/admin/api/albums/${encodeURIComponent(album.id)}`);
    albums.push(detail.album);
  }
  return { albums, categories: categories.categories || [], settings: settings.settings || null, inquiries: inquiries.inquiries || [], studio };
}

function normalizeAlbums(albums) {
  return [...albums].map((album) => stripUrls(album)).sort((a,b) => String(a.id).localeCompare(String(b.id))).map((album) => ({
    ...album,
    categories: [...(album.categories || [])].sort((a,b) => String(a.id).localeCompare(String(b.id))),
    images: [...(album.images || [])].sort((a,b) => String(a.id).localeCompare(String(b.id))),
  }));
}

function normalizeCategories(categories) {
  return [...categories].map(stripUrls).sort((a,b) => String(a.id).localeCompare(String(b.id)));
}

function normalizeInquiries(inquiries) {
  return [...inquiries].map(stripUrls).sort((a,b) => String(a.id).localeCompare(String(b.id)));
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('source_admin_credentials_missing');

  const sourceCookie = await login(SOURCE, email, password);
  const destCookie = await login(DEST, email, password);
  const [source, dest] = await Promise.all([snapshot(SOURCE, sourceCookie), snapshot(DEST, destCookie)]);

  const sAlbums = canonical(normalizeAlbums(source.albums));
  const dAlbums = canonical(normalizeAlbums(dest.albums));
  const sCategories = canonical(normalizeCategories(source.categories));
  const dCategories = canonical(normalizeCategories(dest.categories));
  const sSettings = canonical(stripUrls(source.settings));
  const dSettings = canonical(stripUrls(dest.settings));
  const sInquiries = canonical(normalizeInquiries(source.inquiries));
  const dInquiries = canonical(normalizeInquiries(dest.inquiries));
  const sStudioConfig = canonical(source.studio.siteConfig);
  const dStudioConfig = canonical(dest.studio.siteConfig);

  const sourceImages = source.albums.reduce((n,a) => n + (a.images || []).length, 0);
  const destImages = dest.albums.reduce((n,a) => n + (a.images || []).length, 0);

  const result = {
    status: 'success',
    checkedAt: new Date().toISOString(),
    sourceReadOnly: true,
    destinationReadOnly: true,
    counts: {
      source: { albums: source.albums.length, images: sourceImages, categories: source.categories.length, inquiries: source.inquiries.length, studioHistory: source.studio.history?.length ?? 0, studioRevision: source.studio.revision ?? null },
      destination: { albums: dest.albums.length, images: destImages, categories: dest.categories.length, inquiries: dest.inquiries.length, studioHistory: dest.studio.history?.length ?? 0, studioRevision: dest.studio.revision ?? null },
    },
    parity: {
      albumsAndImages: sha(sAlbums) === sha(dAlbums),
      categories: sha(sCategories) === sha(dCategories),
      settings: sha(sSettings) === sha(dSettings),
      inquiries: sha(sInquiries) === sha(dInquiries),
      studioConfig: sha(sStudioConfig) === sha(dStudioConfig),
    },
    diffPaths: {
      albumsAndImages: diffPaths(sAlbums, dAlbums).slice(0, 40),
      categories: diffPaths(sCategories, dCategories).slice(0, 40),
      settings: diffPaths(sSettings, dSettings).slice(0, 40),
      inquiries: diffPaths(sInquiries, dInquiries).slice(0, 40),
      studioConfig: diffPaths(sStudioConfig, dStudioConfig).slice(0, 40),
    },
    hashes: {
      sourceAlbumsAndImages: sha(sAlbums), destinationAlbumsAndImages: sha(dAlbums),
      sourceCategories: sha(sCategories), destinationCategories: sha(dCategories),
      sourceSettings: sha(sSettings), destinationSettings: sha(dSettings),
      sourceInquiries: sha(sInquiries), destinationInquiries: sha(dInquiries),
      sourceStudioConfig: sha(sStudioConfig), destinationStudioConfig: sha(dStudioConfig),
    },
    domainTouched: false,
    publicStudioActivated: false,
  };
  fs.writeFileSync(RESULT, JSON.stringify(result, null, 2) + '\n');
}

main().catch((error) => {
  fs.writeFileSync(RESULT, JSON.stringify({ status:'failed', error:error instanceof Error ? error.message : String(error), domainTouched:false, publicStudioActivated:false }, null, 2) + '\n');
  process.exitCode = 1;
});
