import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const RESULT = '/tmp/destination-d1-checkpoint-validation-result.json';
const CHECKPOINT_META = 'requests/destination-d1-checkpoint-result.json';

function write(value) {
  fs.writeFileSync(RESULT, JSON.stringify(value, null, 2) + '\n');
}

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: 'utf8', ...options }).trim();
}

async function main() {
  if (!fs.existsSync(CHECKPOINT_META)) throw new Error('checkpoint_metadata_missing');
  const meta = JSON.parse(fs.readFileSync(CHECKPOINT_META, 'utf8'));
  if (meta.status !== 'success') throw new Error('checkpoint_metadata_not_success');
  if (!meta.checkpointBucket || !meta.checkpointKey || !meta.sha256) throw new Error('checkpoint_metadata_incomplete');

  const sqlPath = path.join(os.tmpdir(), 'punctum-checkpoint-validate.sql');
  const sqlitePath = path.join(os.tmpdir(), 'punctum-checkpoint-validate.sqlite');
  fs.rmSync(sqlPath, { force: true });
  fs.rmSync(sqlitePath, { force: true });

  run('wrangler', [
    'r2', 'object', 'get', `${meta.checkpointBucket}/${meta.checkpointKey}`,
    '--file', sqlPath,
    '--remote',
  ], { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });

  const sqlBytes = fs.readFileSync(sqlPath);
  const actualSha256 = crypto.createHash('sha256').update(sqlBytes).digest('hex');
  if (actualSha256 !== meta.sha256) {
    throw new Error(`checkpoint_sha256_mismatch:${actualSha256}`);
  }
  if (sqlBytes.length !== Number(meta.bytes)) {
    throw new Error(`checkpoint_size_mismatch:${sqlBytes.length}`);
  }

  run('sqlite3', [sqlitePath], {
    input: sqlBytes,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const integrity = run('sqlite3', [sqlitePath, 'PRAGMA integrity_check;']);
  if (integrity !== 'ok') throw new Error(`sqlite_integrity_failed:${integrity}`);

  const restoredCounts = {};
  const countMismatches = [];
  for (const [table, expectedRaw] of Object.entries(meta.rowCounts || {})) {
    if (!/^[A-Za-z0-9_]+$/.test(table)) throw new Error(`invalid_table_name:${table}`);
    const value = run('sqlite3', [sqlitePath, `SELECT COUNT(*) FROM "${table}";`]);
    const actual = Number(value);
    const expected = Number(expectedRaw);
    restoredCounts[table] = actual;
    if (actual !== expected) countMismatches.push({ table, expected, actual });
  }

  const foreignKeyRows = run('sqlite3', [sqlitePath, 'PRAGMA foreign_key_check;']);
  const foreignKeyOk = foreignKeyRows === '';

  write({
    status: countMismatches.length === 0 && foreignKeyOk ? 'success' : 'failed',
    validatedAt: new Date().toISOString(),
    checkpointKey: meta.checkpointKey,
    checkpointSha256Expected: meta.sha256,
    checkpointSha256Actual: actualSha256,
    checkpointBytesExpected: Number(meta.bytes),
    checkpointBytesActual: sqlBytes.length,
    sqliteIntegrity: integrity,
    foreignKeyCheck: foreignKeyOk ? 'ok' : 'failed',
    restoredCounts,
    countMismatches,
    restoredOnlyLocally: true,
    destinationD1Touched: false,
    sourceTouched: false,
    domainTouched: false,
    publicStudioActivated: false,
  });

  if (countMismatches.length || !foreignKeyOk) process.exitCode = 1;
}

main().catch((error) => {
  write({
    status: 'failed',
    error: error instanceof Error ? error.message : String(error),
    restoredOnlyLocally: true,
    destinationD1Touched: false,
    sourceTouched: false,
    domainTouched: false,
    publicStudioActivated: false,
  });
  process.exitCode = 1;
});
