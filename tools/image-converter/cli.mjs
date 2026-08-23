#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

function usage() {
  console.log(`Usage:
  node cli.mjs <input> [--output <file>] [--format webp|jpeg] [--quality 1-100] [--max-side px]

Example:
  node cli.mjs ./photo.jpg --output ./photo.webp --format webp --quality 84 --max-side 2048
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const input = args.shift();
  if (!input || input === '--help' || input === '-h') return { help: true };

  const opts = {
    input,
    output: null,
    format: 'webp',
    quality: 84,
    maxSide: 2048,
  };

  while (args.length) {
    const flag = args.shift();
    const value = args.shift();
    if (value == null) throw new Error(`Missing value for ${flag}`);
    if (flag === '--output') opts.output = value;
    else if (flag === '--format') opts.format = value;
    else if (flag === '--quality') opts.quality = Number(value);
    else if (flag === '--max-side') opts.maxSide = Number(value);
    else throw new Error(`Unknown option: ${flag}`);
  }

  if (!['webp', 'jpeg', 'jpg'].includes(opts.format)) throw new Error('Format must be webp or jpeg.');
  if (!Number.isInteger(opts.quality) || opts.quality < 1 || opts.quality > 100) throw new Error('Quality must be an integer from 1 to 100.');
  if (!Number.isInteger(opts.maxSide) || opts.maxSide < 1 || opts.maxSide > 16384) throw new Error('max-side must be an integer from 1 to 16384.');

  opts.format = opts.format === 'jpg' ? 'jpeg' : opts.format;
  if (!opts.output) {
    const parsed = path.parse(opts.input);
    const ext = opts.format === 'jpeg' ? '.jpg' : '.webp';
    opts.output = path.join(parsed.dir, `${parsed.name}${ext}`);
  }
  return opts;
}

function humanBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

async function sha256(filePath) {
  const data = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
      usage();
      process.exit(0);
    }

    const inputStat = await fs.stat(opts.input);
    const image = sharp(opts.input, { failOn: 'warning' }).rotate();
    const metadata = await image.metadata();

    let pipeline = image.resize({
      width: opts.maxSide,
      height: opts.maxSide,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (opts.format === 'webp') {
      pipeline = pipeline.webp({ quality: opts.quality, effort: 5, smartSubsample: true });
    } else {
      pipeline = pipeline.flatten({ background: '#ffffff' }).jpeg({ quality: opts.quality, mozjpeg: true });
    }

    await fs.mkdir(path.dirname(path.resolve(opts.output)), { recursive: true });
    const info = await pipeline.toFile(opts.output);
    const outputStat = await fs.stat(opts.output);
    const hash = await sha256(opts.output);
    const delta = inputStat.size === 0 ? 0 : (1 - outputStat.size / inputStat.size) * 100;

    console.log(JSON.stringify({
      ok: true,
      input: path.resolve(opts.input),
      output: path.resolve(opts.output),
      inputFormat: metadata.format ?? null,
      outputFormat: opts.format,
      inputDimensions: metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : null,
      outputDimensions: `${info.width}x${info.height}`,
      inputBytes: inputStat.size,
      outputBytes: outputStat.size,
      inputHuman: humanBytes(inputStat.size),
      outputHuman: humanBytes(outputStat.size),
      sizeReductionPercent: Number(delta.toFixed(2)),
      quality: opts.quality,
      maxSide: opts.maxSide,
      sha256: hash,
    }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error?.message ?? String(error) }, null, 2));
    process.exit(1);
  }
}

await main();
