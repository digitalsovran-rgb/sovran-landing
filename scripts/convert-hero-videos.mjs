import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';
import { execFileSync } from 'child_process';
import { existsSync, statSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const SOURCE_DIR = './source-videos';
const OUTPUT_DIR = './public/media';

const DESKTOP = ['vidher1', 'vidher2', 'vidher3'];
const MOBILE = ['vidher1mob', 'vidher2mob', 'vidher3mob'];

const DESKTOP_MAX_BYTES = 2621440; // 2.5 MB
const MOBILE_MAX_BYTES = 1258291; // 1.2 MB

const MIN_DURATION_S = 3.0;
const RATIO_TOLERANCE = 0.01;

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

  return { duration, width, height, stderr };
}

function run(args) {
  execFileSync(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
}

function encode(name, isDesktop, crf) {
  const source = join(SOURCE_DIR, `${name}.mp4`);
  const output = join(OUTPUT_DIR, `${name}.mp4`);
  const scale = isDesktop ? 'scale=1920:1080:flags=lanczos,fps=30' : 'scale=720:1280:flags=lanczos,fps=30';
  run([
    '-y', '-i', source, '-t', '3', '-an',
    '-vf', scale,
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
    '-preset', 'slow', '-crf', String(crf),
    '-movflags', '+faststart',
    output,
  ]);
  return output;
}

async function makePoster(name) {
  const output = join(OUTPUT_DIR, `${name}.mp4`);
  const tempPng = join(tmpdir(), `${name}-poster-${Date.now()}.png`);
  const posterPath = join(OUTPUT_DIR, `${name}-poster.webp`);
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

// ---- Pre-flight: inspect every source before converting anything ----
const jobs = [
  ...DESKTOP.map((name) => ({ name, isDesktop: true })),
  ...MOBILE.map((name) => ({ name, isDesktop: false })),
];

console.log('Source inspection:');
for (const job of jobs) {
  const source = join(SOURCE_DIR, `${job.name}.mp4`);
  if (!existsSync(source)) abort(`Source file not found: ${source}`);

  const info = probe(source);
  job.source = info;
  console.log(
    `  ${job.name}.mp4  duration ${Number.isNaN(info.duration) ? 'unknown' : info.duration.toFixed(2) + 's'}  resolution ${info.width}x${info.height}`
  );

  if (Number.isNaN(info.duration) || Number.isNaN(info.width) || Number.isNaN(info.height)) {
    abort(`Could not parse duration/resolution for ${source}`);
  }
  if (info.duration < MIN_DURATION_S) {
    abort(`${job.name}.mp4 duration ${info.duration.toFixed(2)}s is under ${MIN_DURATION_S.toFixed(1)}s`);
  }
  const ratio = info.width / info.height;
  if (job.isDesktop && Math.abs(ratio - 16 / 9) > RATIO_TOLERANCE) {
    abort(`${job.name}.mp4 is ${info.width}x${info.height} (ratio ${ratio.toFixed(4)}), expected 16:9 (1.7778)`);
  }
  if (!job.isDesktop && Math.abs(ratio - 9 / 16) > RATIO_TOLERANCE) {
    abort(`${job.name}.mp4 is ${info.width}x${info.height} (ratio ${ratio.toFixed(4)}), expected 9:16 (0.5625)`);
  }
}

// ---- Convert ----
const results = [];
for (const job of jobs) {
  const { name, isDesktop } = job;
  const baseCrf = isDesktop ? 26 : 27;
  const maxBytes = isDesktop ? DESKTOP_MAX_BYTES : MOBILE_MAX_BYTES;

  console.log(`\nEncoding ${name}.mp4 (crf ${baseCrf})...`);
  const output = encode(name, isDesktop, baseCrf);
  let size = statSync(output).size;
  let reencoded = false;

  if (size > maxBytes) {
    const retryCrf = baseCrf + 3;
    console.log(`  ${size} bytes exceeds ${maxBytes}. Re-encoding once at crf ${retryCrf}.`);
    encode(name, isDesktop, retryCrf);
    size = statSync(output).size;
    reencoded = true;
    console.log(`  Re-encoded: ${size} bytes${size > maxBytes ? ' (still over limit)' : ''}`);
  }

  const poster = await makePoster(name);
  console.log(`  Poster: ${poster}`);

  const info = probe(output);
  results.push({ name, size, reencoded, info });
}

// ---- Summary table ----
console.log('\nSummary:');
console.log('file'.padEnd(20) + 'size (KB)'.padEnd(12) + 'duration'.padEnd(11) + 'resolution'.padEnd(12) + 're-encoded');
for (const r of results) {
  console.log(
    `${r.name}.mp4`.padEnd(20) +
      (r.size / 1024).toFixed(1).padEnd(12) +
      `${r.info.duration.toFixed(2)}s`.padEnd(11) +
      `${r.info.width}x${r.info.height}`.padEnd(12) +
      (r.reencoded ? 'yes' : 'no')
  );
}
