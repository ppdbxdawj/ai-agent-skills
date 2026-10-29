/**
 * Sequential episode render with optional r2v continuity:
 * when segment N is related to N-1, prefer the API-returned last-frame URL
 * from segment N-1. Only fall back to local ffmpeg extraction when the task
 * response does not include a last-frame reference.
 *
 * Manifest JSON:
 * {
 *   "ratio": "9:16",
 *   "generate_audio": true,
 *   "poll_interval_sec": 40,
 *   "segments": [
 *     {
 *       "name": "seg01",
 *       "prompt_file": "/path/prompt.txt",
 *       "ref_images": ["/path/char.png"],
 *       "duration": 13,
 *       "related_to_previous": false
 *     },
 *     {
 *       "name": "seg02",
 *       "prompt_file": "/path/prompt.txt",
 *       "ref_images": ["/path/a.png", "/path/b.png"],
 *       "duration": 8,
 *       "related_to_previous": true
 *     }
 *   ]
 * }
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';

function getScriptDir(): string {
  if (typeof __dirname !== 'undefined') return __dirname;
  return process.cwd();
}

const SCRIPT_DIR = getScriptDir();
const GENERATE = path.join(SCRIPT_DIR, 'seedance-video-generate.ts');
const EXTRACT = path.join(SCRIPT_DIR, 'extract-last-frame.sh');

type Seg = {
  name: string;
  prompt_file: string;
  ref_images: string[];
  duration: number;
  related_to_previous?: boolean;
};

type Manifest = {
  ratio?: string;
  generate_audio?: boolean;
  poll_interval_sec?: number;
  timeout_sec?: number;
  segments: Seg[];
};

function usage(): void {
  console.error(`
Usage:
  npx ts-node seedance-chain-episode.ts --manifest episode.json --out-dir ./render

Options:
  --manifest <path>   Episode manifest JSON
  --out-dir <dir>     Output directory for mp4 + continuity frames
  --dry-run           Print commands only
`);
}

function extractLastFrame(videoPath: string, framePath: string): void {
  execSync(`bash "${EXTRACT}" "${videoPath}" "${framePath}"`, { stdio: 'inherit' });
}

function getNestedUrl(value: unknown): string | undefined {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) return value;
  if (!value || typeof value !== 'object') return undefined;
  const obj = value as Record<string, unknown>;
  if (typeof obj.url === 'string' && /^https?:\/\//.test(obj.url)) return obj.url;
  if (typeof obj.image_url === 'string' && /^https?:\/\//.test(obj.image_url)) return obj.image_url;
  if (obj.image_url && typeof obj.image_url === 'object') return getNestedUrl(obj.image_url);
  return undefined;
}

function getContinuityRefFromTask(stdout: string): string | undefined {
  const trimmed = stdout.trim();
  if (!trimmed) return undefined;
  try {
    const task = JSON.parse(trimmed) as Record<string, unknown>;
    const content = (task.content ?? {}) as Record<string, unknown>;
    const preferredKeys = [
      'last_frame_url',
      'last_frame',
      'lastFrameUrl',
      'lastFrame',
      'end_frame_url',
      'endFrameUrl',
      'cover_url',
      'thumbnail_url',
      'poster_url',
    ];
    for (const key of preferredKeys) {
      const url = getNestedUrl(content[key]);
      if (url) return url;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function runSegment(opts: {
  prompt: string;
  refImages: string[];
  continuityFrame?: string;
  duration: number;
  ratio: string;
  audio: boolean;
  pollSec: number;
  timeoutSec: number;
  outDir: string;
  name: string;
  dryRun: boolean;
}): { mp4: string; continuityRef?: string } {
  const tmpDir = path.join(opts.outDir, '.tmp', opts.name);
  const outMp4 = path.join(opts.outDir, `${opts.name}.mp4`);
  if (!opts.dryRun) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
  const cmd = [
    'npx', 'ts-node', GENERATE,
    '--prompt', opts.prompt,
    '--ratio', opts.ratio,
    '--duration', String(opts.duration),
    '--output-dir', tmpDir,
    '--poll-interval', String(opts.pollSec),
    '--timeout', String(opts.timeoutSec),
    ...(opts.audio ? ['--audio'] : []),
    ...(opts.refImages.length ? ['--ref-images', ...opts.refImages] : []),
    ...(opts.continuityFrame ? ['--continuity-frame', opts.continuityFrame] : []),
  ];
  console.error(`\n[chain] ${opts.name} related_continuity=${!!opts.continuityFrame}`);
  if (opts.dryRun) {
    console.log(cmd.join(' '));
    return { mp4: outMp4 };
  }
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd: SCRIPT_DIR, encoding: 'utf8', stdio: 'pipe' });
  if (r.status !== 0) {
    console.error(r.stdout);
    console.error(r.stderr);
    throw new Error(`segment failed: ${opts.name}`);
  }
  const mp4s = fs.readdirSync(tmpDir).filter((f) => f.endsWith('.mp4'));
  if (mp4s.length !== 1) throw new Error(`expected 1 mp4 in ${tmpDir}, got ${mp4s.length}`);
  fs.copyFileSync(path.join(tmpDir, mp4s[0]), outMp4);
  const continuityRef = getContinuityRefFromTask(r.stdout);
  if (continuityRef) console.error(`[chain] ${opts.name} API last-frame ref: ${continuityRef}`);
  else console.error(`[chain] ${opts.name} no API last-frame ref; fallback extraction will be used if needed`);
  console.error(`[chain] saved ${outMp4}`);
  return { mp4: outMp4, continuityRef };
}

function main(): void {
  const args = process.argv.slice(2);
  let manifestPath = '';
  let outDir = './output-chain';
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--manifest') manifestPath = args[++i];
    else if (args[i] === '--out-dir') outDir = args[++i];
    else if (args[i] === '--dry-run') dryRun = true;
    else if (args[i] === '--help' || args[i] === '-h') {
      usage();
      process.exit(0);
    }
  }
  if (!manifestPath) {
    usage();
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Manifest;
  fs.mkdirSync(outDir, { recursive: true });
  const continuityDir = path.join(outDir, 'continuity-frames');
  fs.mkdirSync(continuityDir, { recursive: true });

  const ratio = manifest.ratio ?? '9:16';
  const audio = manifest.generate_audio ?? true;
  const pollSec = manifest.poll_interval_sec ?? 40;
  const timeoutSec = manifest.timeout_sec ?? 1200;

  let prevMp4: string | undefined;
  let prevContinuityRef: string | undefined;
  for (let i = 0; i < manifest.segments.length; i++) {
    const seg = manifest.segments[i];
    const prompt = fs.readFileSync(seg.prompt_file, 'utf8').trim();
    let continuityFrame: string | undefined;
    if (seg.related_to_previous) {
      if (!prevMp4) throw new Error(`${seg.name}: related_to_previous but no previous mp4`);
      if (prevContinuityRef) {
        continuityFrame = prevContinuityRef;
        console.error(`[chain] ${seg.name} uses API-returned previous last frame`);
      } else {
        continuityFrame = path.join(continuityDir, `${manifest.segments[i - 1].name}-last.jpg`);
        if (!dryRun) extractLastFrame(prevMp4, continuityFrame);
        console.error(`[chain] ${seg.name} uses locally extracted previous last frame`);
      }
    }
    const result = runSegment({
      name: seg.name,
      prompt,
      refImages: seg.ref_images,
      continuityFrame,
      duration: seg.duration,
      ratio,
      audio,
      pollSec,
      timeoutSec,
      outDir,
      dryRun,
    });
    prevMp4 = result.mp4;
    prevContinuityRef = result.continuityRef;
  }
  console.error(`[chain] all ${manifest.segments.length} segments done -> ${outDir}`);
}

main();
