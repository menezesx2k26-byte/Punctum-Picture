import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const RESULT = '/tmp/destination-d1-checkpoint-result.json';
const DATABASE_NAME = 'punctum-picture';
const BACKUPS_BUCKET = 'punctum-picture-backups';

function write(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const d1Token = process.env.CLOUDFLARE_D1_API_TOKEN;
  const generalToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !d1Token || !generalToken) throw new Error('cloudflare_credentials_missing');

  const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}`;
  const headers = { Authorization: `Bearer ${d1Token}`, 'Content-Type': 'application/json' };

  async function cf(pathname, options = {}) {
    const response = await fetch(`${base}${pathname}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    });
    const payload = await response.json();
    if (!response.ok || payload?.success === false) {
      throw new Error(`cloudflare_http_${response.status}`);
    }
    return payload;
  }

  const list = await cf('/d1/database');
  const db = (list.result || []).find((item) => item.name === DATABASE_NAME);
  const dbId = db?.uuid || db?.id;
  if (!dbId) throw new Error('destination_d1_not_found');

  async function query(sql, params = []) {
    const payload = await cf(`/d1/database/${dbId}/query`, {
      method: 'POST',
      body: JSON.stringify({ sql, params }),
    });
    const part = payload.result?.[0];
    if (!part || part.success === false) throw new Error('d1_query_failed');
    return part.results || [];
  }

  const tableRows = await query(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name",
  );
  const rowCounts = {};
  for (const row of tableRows) {
    const name = String(row.name);
    if (!/^[A-Za-z0-9_]+$/.test(name)) continue;
    const count = await query(`SELECT COUNT(*) AS count FROM ${name}`);
    rowCounts[name] = Number(count?.[0]?.count ?? 0);
  }

  const configPath = '/tmp/punctum-d1-export-wrangler.jsonc';
  fs.writeFileSync(configPath, JSON.stringify({
    name: 'punctum-d1-export-helper',
    compatibility_date: '2026-05-22',
    d1_databases: [{
      binding: 'DB',
      database_name: DATABASE_NAME,
      database_id: dbId,
    }],
  }, null, 2) + '\n');

  const sqlPath = '/tmp/punctum-destination-pre-studio.sql';
  fs.rmSync(sqlPath, { force: true });
  execFileSync('wrangler', [
    'd1', 'export', 'DB', '--remote', '--output', sqlPath, '--config', configPath,
  ], {
    stdio: 'pipe',
    env: {
      ...process.env,
      CLOUDFLARE_ACCOUNT_ID: accountId,
      CLOUDFLARE_API_TOKEN: d1Token,
    },
  });

  const sqlBytes = fs.readFileSync(sqlPath);
  const sha256 = crypto.createHash('sha256').update(sqlBytes).digest('hex');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const key = `migration/checkpoints/pre-studio/${stamp}.sql`;

  execFileSync('wrangler', [
    'r2', 'object', 'put', `${BACKUPS_BUCKET}/${key}`,
    '--file', sqlPath,
    '--content-type', 'application/sql',
    '--remote',
  ], {
    stdio: 'pipe',
    env: {
      ...process.env,
      CLOUDFLARE_ACCOUNT_ID: accountId,
      CLOUDFLARE_API_TOKEN: generalToken,
    },
  });

  write({
    status: 'success',
    createdAt: new Date().toISOString(),
    databaseName: DATABASE_NAME,
    databaseId: dbId,
    checkpointBucket: BACKUPS_BUCKET,
    checkpointKey: key,
    bytes: sqlBytes.length,
    sha256,
    rowCounts,
    sourceTouched: false,
    domainTouched: false,
    publicStudioActivated: false,
  });
}

main().catch((error) => {
  write({
    status: 'failed',
    error: error instanceof Error ? error.message : String(error),
    sourceTouched: false,
    domainTouched: false,
    publicStudioActivated: false,
  });
  process.exitCode = 1;
});
