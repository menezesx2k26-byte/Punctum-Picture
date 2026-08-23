import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const SOURCE = 'https://punctumpicture.com';
const ORIGINALS_BUCKET = 'punctum-picture-originals';
const BACKUPS_BUCKET = 'punctum-picture-backups';
const RESULT_PATH = '/tmp/source-private-state-migration-result.json';

function result(value) {
  fs.writeFileSync(RESULT_PATH, JSON.stringify(value, null, 2) + '\n');
}

function extFromType(type) {
  const t = String(type || '').split(';')[0].trim().toLowerCase();
  if (t === 'image/jpeg') return 'jpg';
  if (t === 'image/png') return 'png';
  if (t === 'image/webp') return 'webp';
  if (t === 'image/avif') return 'avif';
  if (t === 'image/gif') return 'gif';
  return 'bin';
}

async function main() {
  const email = process.env.SOURCE_ADMIN_EMAIL;
  const password = process.env.SOURCE_ADMIN_PASSWORD;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const d1Token = process.env.CLOUDFLARE_D1_API_TOKEN;
  if (!email || !password) throw new Error('source_admin_credentials_missing');
  if (!accountId || !d1Token || !process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error('destination_cloudflare_credentials_missing');
  }

  const login = await fetch(`${SOURCE}/admin/api/session`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Origin: SOURCE,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`source_admin_login_http_${login.status}`);
  const setCookie = login.headers.get('set-cookie') || '';
  const cookie = setCookie.split(';')[0];
  if (!cookie.startsWith('punctum_admin_session=')) throw new Error('source_admin_session_cookie_missing');

  async function sourceJson(urlPath) {
    const response = await fetch(`${SOURCE}${urlPath}`, {
      headers: { Cookie: cookie, Accept: 'application/json' },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`source_${urlPath}_http_${response.status}`);
    return response.json();
  }

  const [me, albumListPayload, categoriesPayload, settingsPayload, studioPayload, inquiriesPayload] = await Promise.all([
    sourceJson('/admin/api/me'),
    sourceJson('/admin/api/albums'),
    sourceJson('/admin/api/categories'),
    sourceJson('/admin/api/settings'),
    sourceJson('/admin/api/studio'),
    sourceJson('/admin/api/inquiries'),
  ]);

  const albumList = albumListPayload.albums || [];
  const albums = [];
  for (const summary of albumList) {
    const detail = await sourceJson(`/admin/api/albums/${encodeURIComponent(summary.id)}`);
    albums.push(detail.album);
  }

  const publicArchiveResponse = await fetch(`${SOURCE}/api/public/archive`, { headers: { Accept: 'application/json' } });
  if (!publicArchiveResponse.ok) throw new Error(`public_archive_http_${publicArchiveResponse.status}`);
  const publicArchive = await publicArchiveResponse.json();
  const publicIds = new Set((publicArchive.images || []).map((image) => String(image.id)));

  const allImages = albums.flatMap((album) => (album.images || []).map((image) => ({ ...image, album })));
  const privateReadyImages = allImages.filter((image) => image.status === 'ready' && !publicIds.has(String(image.id)));
  const unavailableImages = allImages.filter((image) => image.status !== 'ready' && !publicIds.has(String(image.id)));

  const privateSnapshot = {
    format: 'punctum-source-admin-private-state-v1',
    capturedAt: new Date().toISOString(),
    source: SOURCE,
    identity: me,
    albums,
    categories: categoriesPayload.categories || [],
    settings: settingsPayload.settings || null,
    studio: studioPayload,
    inquiries: inquiriesPayload.inquiries || [],
    limitations: [
      'Existing admin GET APIs do not expose audit_log.',
      'Existing admin GET APIs do not expose soft-deleted albums/images.',
      'Existing admin GET APIs do not expose upload_intents as a list.',
      'Studio history exposes summaries only; historical config_json bodies require raw D1 export.',
      'admin_credentials is intentionally not exported through the admin API.',
    ],
  };
  const snapshotJson = JSON.stringify(privateSnapshot, null, 2) + '\n';
  const snapshotPath = '/tmp/punctum-source-admin-private-state.json';
  fs.writeFileSync(snapshotPath, snapshotJson);
  const snapshotSha256 = crypto.createHash('sha256').update(snapshotJson).digest('hex');
  const stamp = privateSnapshot.capturedAt.replace(/[:.]/g, '-');
  const backupKey = `migration/source-private-state/${stamp}.json`;

  execFileSync('wrangler', [
    'r2', 'object', 'put', `${BACKUPS_BUCKET}/${backupKey}`,
    '--file', snapshotPath,
    '--content-type', 'application/json',
    '--remote',
  ], { stdio: 'pipe', env: process.env });

  const cfBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}`;
  async function cf(pathname, options = {}) {
    const response = await fetch(`${cfBase}${pathname}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${d1Token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let payload;
    try { payload = JSON.parse(text); } catch { payload = { raw: text.slice(0, 500) }; }
    if (!response.ok || payload?.success === false) {
      throw new Error(`cloudflare_api_${response.status}:${JSON.stringify(payload?.errors || payload).slice(0, 1000)}`);
    }
    return payload;
  }

  const dbList = await cf('/d1/database');
  const db = (dbList.result || []).find((item) => item.name === 'punctum-picture');
  const dbId = db?.uuid || db?.id;
  if (!dbId) throw new Error('destination_d1_not_found');
  async function query(sql, params = []) {
    const payload = await cf(`/d1/database/${dbId}/query`, {
      method: 'POST',
      body: JSON.stringify({ sql, params }),
    });
    const part = (payload.result || [])[0] || {};
    if (part.success === false) throw new Error(`d1_query_failed:${JSON.stringify(part).slice(0, 1000)}`);
    return part;
  }

  const now = new Date().toISOString();
  for (const category of privateSnapshot.categories) {
    await query(
      `INSERT INTO categories (id,name,slug,description,sort_order,is_visible,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name,slug=excluded.slug,
         description=excluded.description,sort_order=excluded.sort_order,
         is_visible=excluded.is_visible,updated_at=excluded.updated_at`,
      [category.id, category.name, category.slug, category.description ?? null, category.sortOrder ?? 0, category.isVisible ? 1 : 0, now, now],
    );
  }

  for (let index = 0; index < albums.length; index++) {
    const album = albums[index];
    await query(
      `INSERT INTO albums (
         id,slug,title,subtitle,description,location,shoot_date,status,cover_image_id,
         featured,sort_order,seo_title,seo_description,published_at,created_at,updated_at,deleted_at
       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)
       ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,title=excluded.title,
         subtitle=excluded.subtitle,description=excluded.description,location=excluded.location,
         shoot_date=excluded.shoot_date,status=excluded.status,cover_image_id=excluded.cover_image_id,
         featured=excluded.featured,seo_title=excluded.seo_title,seo_description=excluded.seo_description,
         published_at=excluded.published_at,updated_at=excluded.updated_at,deleted_at=NULL`,
      [album.id, album.slug, album.title, album.subtitle ?? null, album.description ?? null,
       album.location ?? null, album.shootDate ?? null, album.status, album.coverImageId ?? null,
       album.featured ? 1 : 0, (index + 1) * 1000, album.seoTitle ?? null,
       album.seoDescription ?? null, album.publishedAt ?? null, album.createdAt ?? now, album.updatedAt ?? now],
    );
    await query('DELETE FROM album_categories WHERE album_id=?', [album.id]);
    for (const category of album.categories || []) {
      await query('INSERT OR IGNORE INTO album_categories (album_id,category_id) VALUES (?,?)', [album.id, category.id]);
    }
  }

  const tempDir = '/tmp/punctum-private-ready-media';
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
  let privateReadyUploaded = 0;

  for (const image of allImages) {
    const existing = ((await query('SELECT id,original_key AS originalKey,mime_type AS mimeType FROM images WHERE id=?', [image.id])).results || [])[0];
    let originalKey = existing?.originalKey || null;
    let mimeType = existing?.mimeType || null;
    let checksum = null;
    let sizeBytes = image.sizeBytes ?? 0;
    let originalFilename = null;

    if (!existing && image.status === 'ready') {
      const response = await fetch(`${SOURCE}/admin/media/${encodeURIComponent(image.id)}/gallery`, {
        headers: { Cookie: cookie, Accept: 'image/jpeg' },
        redirect: 'follow',
      });
      if (!response.ok) throw new Error(`private_media_http_${response.status}:${image.id}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      mimeType = response.headers.get('content-type') || 'application/octet-stream';
      const ext = extFromType(mimeType);
      checksum = crypto.createHash('sha256').update(bytes).digest('hex');
      sizeBytes = bytes.length;
      originalFilename = `${image.id}.${ext}`;
      originalKey = `migration/private/${image.id}.${ext}`;
      const localPath = path.join(tempDir, originalFilename);
      fs.writeFileSync(localPath, bytes);
      execFileSync('wrangler', [
        'r2', 'object', 'put', `${ORIGINALS_BUCKET}/${originalKey}`,
        '--file', localPath,
        '--content-type', mimeType,
        '--remote',
      ], { stdio: 'pipe', env: process.env });
      privateReadyUploaded++;
    }

    if (!existing && image.status !== 'ready') {
      originalKey = `migration/private-unavailable/${image.id}`;
      mimeType = 'application/octet-stream';
      originalFilename = image.id;
    }

    if (existing) {
      await query(
        `UPDATE images SET album_id=?,status=?,alt_text=?,focal_x=?,focal_y=?,width=?,height=?,
          size_bytes=?,position=?,updated_at=?,deleted_at=NULL WHERE id=?`,
        [image.album.id, image.status, image.altText ?? null, image.focalX ?? null, image.focalY ?? null,
         image.width ?? null, image.height ?? null, sizeBytes, image.position ?? 0, now, image.id],
      );
    } else {
      await query(
        `INSERT INTO images (
          id,album_id,original_key,original_filename,mime_type,size_bytes,width,height,checksum,
          alt_text,focal_x,focal_y,position,status,created_at,updated_at,deleted_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)`,
        [image.id, image.album.id, originalKey, originalFilename, mimeType, sizeBytes,
         image.width ?? null, image.height ?? null, checksum, image.altText ?? null,
         image.focalX ?? null, image.focalY ?? null, image.position ?? 0, image.status,
         image.createdAt ?? now, now],
      );
    }
  }

  for (const inquiry of privateSnapshot.inquiries) {
    await query(
      `INSERT INTO inquiries (id,name,email,phone,instagram,service,desired_date,message,status,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,phone=excluded.phone,
         instagram=excluded.instagram,service=excluded.service,desired_date=excluded.desired_date,
         message=excluded.message,status=excluded.status`,
      [inquiry.id, inquiry.name, inquiry.email ?? null, inquiry.phone ?? null, inquiry.instagram ?? null,
       inquiry.service ?? null, inquiry.desiredDate ?? null, inquiry.message, inquiry.status, inquiry.createdAt],
    );
  }

  const statusCounts = {};
  for (const album of albums) statusCounts[album.status] = (statusCounts[album.status] || 0) + 1;
  const imageStatusCounts = {};
  for (const image of allImages) imageStatusCounts[image.status] = (imageStatusCounts[image.status] || 0) + 1;

  result({
    status: 'success',
    migratedAt: new Date().toISOString(),
    sourceReadOnly: true,
    destinationDatabaseId: dbId,
    privateSnapshotBackupKey: backupKey,
    privateSnapshotSha256: snapshotSha256,
    counts: {
      albums: albums.length,
      albumStatuses: statusCounts,
      images: allImages.length,
      imageStatuses: imageStatusCounts,
      publicImages: publicIds.size,
      privateReadyImages: privateReadyImages.length,
      privateReadyUploaded,
      unavailablePrivateImages: unavailableImages.length,
      categories: privateSnapshot.categories.length,
      inquiries: privateSnapshot.inquiries.length,
      studioHistorySummaries: Array.isArray(studioPayload.history) ? studioPayload.history.length : 0,
    },
    studio: {
      draftCapturedToPrivateBackup: true,
      draftActivatedInDestination: false,
      hasUnpublishedChanges: Boolean(studioPayload.hasUnpublishedChanges),
      revision: studioPayload.revision ?? null,
    },
    inquiriesPossiblyTruncated: privateSnapshot.inquiries.length >= 250,
    forensicParityComplete: false,
    remainingRawD1Requirements: [
      'audit_log',
      'soft-deleted rows',
      'upload_intents full table',
      'admin_credentials',
      'site_config_versions historical config_json bodies',
      'site_config_pointers exact source IDs/timestamps',
      'operational tables such as backup_runs/rate_limit_buckets',
    ],
    domainTouched: false,
  });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  result({ status: 'failed', error: message.slice(0, 2000), sourceReadOnly: true, domainTouched: false });
  process.exitCode = 1;
});
