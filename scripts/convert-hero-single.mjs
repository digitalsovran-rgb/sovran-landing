import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';
import { execFileSync } from 'child_process';
import { existsSync, statSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const SOURCE_DIR = './source-videos';
const OUTPUT_DIR = './public/media';

const JOBS = [
  { source: 'heropc.mp4', output: 'hero-pc', width: 1920, profile: 'high', level: '4.0', crf: 26, maxBytes: 6 * 1024 * 1024, landscape: true },
  { source: 'heromob.mp4', output: 'hero-mob', width: 540, profile: 'main', level: '3.1', crf: 28, maxBytes: 1.5 * 1024 * 1024, landscape: false },
];

// `ffmpeg -i <file>` with no output always exits non-zero, but still prints the stream
// info to stderr, which is what we want.
function probe(file) {
  let stderr = '';
  try {
    execFileSync(ffmpegPath, ['-i', file], { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    stderr = err.stderr ? err.stderr.toString() : '';
  }

  const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const duration = durMatch
    ? Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3])
    : NaN;

  const videoLine = stderr.split('\n').find((l) => /Stream #.*Video:/.test(l)) ?? '';
  const resMatch = videoLine.match(/,\s*(\d{2,5})x(\d{2,5})[\s,\[]/);
  let width = resMatch ? Number(resMatch[1]) : NaN;
  let height = resMatch ? Number(resMatch[2]) : NaN;

  // ffmpeg auto-applies display-matrix rotation, so a 90/270 degree tag means the
  // displayed frame has swapped dimensions.
  const rotMatch = stderr.match(/rotation of (-?\d+(?:\.\d+)?) degrees/);
  const rotation = rotMatch ? Math.abs(Number(rotMatch[1])) : 0;
  if (rotation === 90 || rotation === 270) [width, height] = [height, width];

  return { duration, width, height };
}

function run(args) {
  execFileSync(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
}

function encode(job, crf) {
  const output = join(OUTPUT_DIR, `${job.output}.mp4`);
  run([
    '-y', '-i', join(SOURCE_DIR, job.source), '-an',
    '-vf', `scale=${job.width}:-2:flags=lanczos,fps=30`,
    '-c:v', 'libx264', '-profile:v', job.profile, '-level', job.level, '-pix_fmt', 'yuv420p',
    '-preset', 'slow', '-crf', String(crf),
    '-movflags', '+faststart',
    output,
  ]);
  return output;
}

async function makePoster(job) {
  const output = join(OUTPUT_DIR, `${job.output}.mp4`);
  const tempPng = join(tmpdir(), `${job.output}-poster-${Date.now()}.png`);
  const posterPath = join(OUTPUT_DIR, `${job.output}-poster.webp`);
  try {
    run(['-y', '-i', output, '-frames:v', '1', tempPng]);
    await sharp(tempPng).webp({ quality: 80 }).toFile(posterPath);
  } finally {
    if (existsSync(tempPng)) unlinkSync(tempPng);
  }
  return posterPath;
}

function abort(message) {
  console.error(`\nABORT: ${message}`);
  process.exit(1);
}

// ---- Pre-flight: inspect both sources before converting anything ----
console.log('Source inspection:');
for (const job of JOBS) {
  const source = join(SOURCE_DIR, job.source);
  if (!existsSync(source)) abort(`Source file not found: ${source}`);

  const info = probe(source);
  console.log(
    `  ${job.source}  duration ${Number.isNaN(info.duration) ? 'unknown' : info.duration.toFixed(2) + 's'}  resolution ${info.width}x${info.height}`
  );

  if (Number.isNaN(info.duration) || Number.isNaN(info.width) || Number.isNaN(info.height)) {
    abort(`Could not parse duration/resolution for ${source}`);
  }
  if (job.landscape && !(info.width > info.height)) {
    abort(`${job.source} is ${info.width}x${info.height}, expected landscape (width > height)`);
  }
  if (!job.landscape && !(info.height > info.width)) {
    abort(`${job.source} is ${info.width}x${info.height}, expected portrait (height > width)`);
  }
}

// ---- Convert ----
const results = [];
for (const job of JOBS) {
  console.log(`\nEncoding ${job.output}.mp4 (crf ${job.crf})...`);
  const output = encode(job, job.crf);
  let size = statSync(output).size;
  let reencoded = false;

  if (size > job.maxBytes) {
    const retryCrf = job.crf + 3;
    console.log(`  ${size} bytes exceeds ${job.maxBytes}. Re-encoding once at crf ${retryCrf}.`);
    encode(job, retryCrf);
    size = statSync(output).size;
    reencoded = true;
    console.log(`  Re-encoded: ${size} bytes${size > job.maxBytes ? ' (still over limit)' : ''}`);
  }

  const poster = await makePoster(job);
  console.log(`  Poster: ${poster} (${(statSync(poster).size / 1024).toFixed(1)} KB)`);

  results.push({ name: `${job.output}.mp4`, size, reencoded, info: probe(output) });
}

// ---- Summary table ----
console.log('\nSummary:');
console.log('file'.padEnd(16) + 'duration'.padEnd(11) + 'resolution'.padEnd(12) + 'size (KB)'.padEnd(12) + 're-encoded');
for (const r of results) {
  console.log(
    r.name.padEnd(16) +
      `${r.info.duration.toFixed(2)}s`.padEnd(11) +
      `${r.info.width}x${r.info.height}`.padEnd(12) +
      (r.size / 1024).toFixed(1).padEnd(12) +
      (r.reencoded ? 'yes' : 'no')
  );
}
