/**
 * Seedance Video Generation — 调用 Ark Content Generation API 生视频
 * 接口：POST https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks
 * 
 * 支持模式：
 *   - 图生视频（基于参考图 r2v）— 默认
 *   - 文生视频（t2v）
 *   - 首帧图生视频（i2v first_frame）
 *   - 首尾帧图生视频（i2v first+last frame）
 *
 * 用法:
 *   npx ts-node seedance-video-generate.ts --prompt "提示词" --ref-images img1.jpg img2.jpg
 *   npx ts-node seedance-video-generate.ts --prompt "提示词" --first-frame img.jpg
 *   echo '{"prompt":"...","ref_images":["url"]}' | npx ts-node seedance-video-generate.ts --json
 *
 * 环境变量：
 *   ARK_API_KEY    — 必填，Ark API Key
 *   ARK_MODEL_ID   — 可选，模型 Endpoint ID（默认需手动指定或通过 --model）
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// ─── .env loader ────────────────────────────────────────────────────────────
function getScriptDir(): string {
  if (typeof __dirname !== 'undefined') return __dirname;
  // ESM fallback
  const url = (globalThis as any).import?.meta?.url ?? '';
  if (url) {
    const { fileURLToPath } = require('url');
    return path.dirname(fileURLToPath(url));
  }
  return process.cwd();
}

function loadEnv(): void {
  const scriptDir = getScriptDir();
  const dirs = [scriptDir, path.resolve(scriptDir, '..')];
  for (const dir of dirs) {
    const envPath = path.join(dir, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eq = trimmed.indexOf('=');
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
            if (key && process.env[key] === undefined) process.env[key] = val;
          }
        }
      }
      break;
    }
  }
}
loadEnv();

// ─── Constants ──────────────────────────────────────────────────────────────
const API_BASE = 'https://ark.ap-southeast.bytepluses.com/api/v3';
const CREATE_URL = `${API_BASE}/contents/generations/tasks`;
const DEFAULT_POLL_INTERVAL_MS = 40_000;
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

// ─── Types ──────────────────────────────────────────────────────────────────
type ContentItem =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string }; role?: string }
  | { type: 'video_url'; video_url: { url: string }; role?: string }
  | { type: 'audio_url'; audio_url: { url: string }; role?: string };

interface CreateTaskRequest {
  model: string;
  content: ContentItem[];
  ratio?: string;
  duration?: number;
  generate_audio?: boolean;
  watermark?: boolean;
}

interface TaskResponse {
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  content?: {
    video_url?: string;
    last_frame_url?: string;
    last_frame?: string | { url?: string; image_url?: string | { url?: string } };
    cover_url?: string;
    thumbnail_url?: string;
    poster_url?: string;
    duration?: number;
    resolution?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// ─── HTTP helpers (Node 18+ fetch, fallback to https) ───────────────────────
async function apiRequest(url: string, options: {
  method: string;
  headers: Record<string, string>;
  body?: string;
}): Promise<{ status: number; data: any }> {
  if (typeof globalThis.fetch === 'function') {
    const resp = await fetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });
    const data = await resp.json().catch(() => null);
    return { status: resp.status, data };
  }

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const mod = parsedUrl.protocol === 'https:' ? https : http;
    const req = mod.request(parsedUrl, {
      method: options.method,
      headers: options.headers,
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let data: any = null;
        try { data = JSON.parse(raw); } catch { data = raw; }
        resolve({ status: res.statusCode ?? 0, data });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ─── Core API ───────────────────────────────────────────────────────────────
function getApiKey(): string {
  const key = process.env.ARK_API_KEY || process.env.arkApiKey || '';
  if (!key) {
    throw new Error(
      'Missing ARK API key. Set env ARK_API_KEY.\n' +
      'Get yours at: https://console.byteplus.com/ark'
    );
  }
  return key;
}

function authHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`,
  };
}

async function createTask(req: CreateTaskRequest): Promise<TaskResponse> {
  console.error('[Seedance] Creating video generation task...');
  console.error('[Seedance] Model:', req.model);
  console.error('[Seedance] Content items:', req.content.length);
  console.error('[Seedance] Ratio:', req.ratio ?? '16:9');
  console.error('[Seedance] Duration:', req.duration ?? 5, 's');

  const { status, data } = await apiRequest(CREATE_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(req),
  });

  if (status < 200 || status >= 300) {
    console.error('[Seedance] Create task failed:', { status, data });
    throw new Error(`Create task HTTP ${status}: ${JSON.stringify(data)}`);
  }
  console.error('[Seedance] Task created, ID:', data?.id);
  return data as TaskResponse;
}

async function getTask(taskId: string): Promise<TaskResponse> {
  const url = `${CREATE_URL}/${taskId}`;
  const { status, data } = await apiRequest(url, {
    method: 'GET',
    headers: authHeaders(),
  });
  if (status < 200 || status >= 300) {
    console.error('[Seedance] Get task failed:', { status, data });
    throw new Error(`Get task HTTP ${status}: ${JSON.stringify(data)}`);
  }
  return data as TaskResponse;
}

async function pollUntilDone(taskId: string, opts?: {
  pollIntervalMs?: number;
  timeoutMs?: number;
}): Promise<TaskResponse> {
  const interval = opts?.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const timeout = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const start = Date.now();

  while (true) {
    const result = await getTask(taskId);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (result.status === 'succeeded') {
      console.error(`[Seedance] Task succeeded after ${elapsed}s`);
      return result;
    }
    if (result.status === 'failed') {
      console.error(`[Seedance] Task failed after ${elapsed}s:`, result.error);
      throw new Error(`Video generation failed: ${result.error?.message ?? 'unknown'}`);
    }

    if (Date.now() - start > timeout) {
      throw new Error(`Task timed out after ${(timeout / 1000).toFixed(0)}s (status: ${result.status})`);
    }

    console.error(`[Seedance] Status: ${result.status} (${elapsed}s elapsed), polling in ${interval / 1000}s...`);
    await new Promise(r => setTimeout(r, interval));
  }
}

// ─── Download helper ────────────────────────────────────────────────────────
async function downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
  console.error(`[Seedance] Downloading video to ${outputPath}...`);
  if (typeof globalThis.fetch === 'function') {
    const resp = await fetch(videoUrl);
    if (!resp.ok) throw new Error(`Download failed: HTTP ${resp.status}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(outputPath, buf);
    console.error(`[Seedance] Downloaded ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
    return;
  }

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(videoUrl);
    const mod = parsedUrl.protocol === 'https:' ? https : http;
    const req = mod.get(parsedUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return downloadVideo(loc, outputPath).then(resolve).catch(reject);
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(outputPath, buf);
        console.error(`[Seedance] Downloaded ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
        resolve();
      });
    });
    req.on('error', reject);
  });
}

// ─── Local file → base64 data URL ───────────────────────────────────────────
const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.bmp': 'image/bmp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4', '.aac': 'audio/aac',
};

function resolveUrl(input: string): string {
  if (input.startsWith('http://') || input.startsWith('https://') || input.startsWith('data:')) {
    return input;
  }
  const absPath = path.resolve(input);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Local file not found: ${absPath}`);
  }
  const ext = path.extname(absPath).toLowerCase();
  const mime = MIME_MAP[ext];
  if (!mime) {
    throw new Error(`Unsupported file type: ${ext} (file: ${absPath})`);
  }
  const data = fs.readFileSync(absPath);
  const b64 = data.toString('base64');
  console.error(`[Seedance] Encoded local file ${path.basename(absPath)} (${(data.length / 1024).toFixed(1)} KB) → base64 data URL`);
  return `data:${mime};base64,${b64}`;
}

// ─── Build content array from CLI args ──────────────────────────────────────
function buildContent(opts: {
  prompt?: string;
  refImages?: string[];
  continuityFrame?: string;
  refVideos?: string[];
  refAudios?: string[];
  firstFrame?: string;
  lastFrame?: string;
}): ContentItem[] {
  const content: ContentItem[] = [];
  const hasFirstOrLastFrame = opts.firstFrame || opts.lastFrame;
  const hasRefMedia = (opts.refImages?.length ?? 0) > 0
    || (opts.refVideos?.length ?? 0) > 0
    || (opts.refAudios?.length ?? 0) > 0;

  if (hasFirstOrLastFrame && hasRefMedia) {
    throw new Error(
      'Cannot combine first/last frame (i2v) with reference media (r2v) in the same request. ' +
      'Use one mode at a time.'
    );
  }

  if (opts.prompt) {
    content.push({ type: 'text', text: opts.prompt });
  }

  if (opts.firstFrame) {
    content.push({
      type: 'image_url',
      image_url: { url: resolveUrl(opts.firstFrame) },
      role: 'first_frame',
    });
  }
  if (opts.lastFrame) {
    content.push({
      type: 'image_url',
      image_url: { url: resolveUrl(opts.lastFrame) },
      role: 'last_frame',
    });
  }

  const allRefImages = [...(opts.refImages ?? [])];
  if (opts.continuityFrame) {
    allRefImages.push(opts.continuityFrame);
  }
  if (allRefImages.length > 9) {
    throw new Error(
      `Too many reference images (${allRefImages.length}). Seedance r2v allows at most 9. ` +
        'Reduce character refs or omit continuity frame.'
    );
  }
  for (let i = 0; i < allRefImages.length; i++) {
    const img = allRefImages[i];
    content.push({
      type: 'image_url',
      image_url: { url: resolveUrl(img) },
      role: 'reference_image',
    });
    if (opts.continuityFrame && i === allRefImages.length - 1) {
      console.error(
        `[Seedance] Continuity frame appended as reference_image #${i + 1} (last of ${allRefImages.length})`
      );
    }
  }
  for (const vid of opts.refVideos ?? []) {
    content.push({
      type: 'video_url',
      video_url: { url: resolveUrl(vid) },
      role: 'reference_video',
    });
  }
  for (const aud of opts.refAudios ?? []) {
    content.push({
      type: 'audio_url',
      audio_url: { url: resolveUrl(aud) },
      role: 'reference_audio',
    });
  }

  return content;
}

// ─── CLI ────────────────────────────────────────────────────────────────────
function printUsage(): void {
  console.error(`
Seedance Video Generation CLI

Usage:
  npx ts-node seedance-video-generate.ts [options] --prompt "your prompt"

Modes:
  Reference Image (r2v, default):
    --ref-images url1 url2 ...   Character/scene reference images (1-9 total with continuity)
    --continuity-frame path    Previous segment last frame (appended as last reference_image)
    --ref-videos url1 ...        Reference videos (0-3)
    --ref-audios url1 ...        Reference audios (0-3)

  First Frame (i2v):
    --first-frame url            First frame image
    --last-frame url             Last frame image (optional, with first-frame)

  Text to Video (t2v):
    Just --prompt without any image/video/audio

Options:
  --prompt "text"       Text prompt (required)
  --model <id>          Model/Endpoint ID (or set ARK_MODEL_ID env)
  --ratio 16:9|9:16|1:1 Aspect ratio (default: 16:9)
  --duration N          Video duration in seconds (default: 5)
  --audio               Enable audio generation (generate_audio=true)
  --no-watermark        Disable watermark (default)
  --watermark           Enable watermark
  --output-dir <dir>    Output directory (default: ./output)
  --poll-interval N     Poll interval in seconds (default: 40)
  --timeout N           Timeout in seconds (default: 600)
  --no-download         Skip downloading the video
  --json                Read full JSON request body from stdin

  --task-id <id>        Resume polling an existing task (skip creation)

Environment:
  ARK_API_KEY           Required. Your Ark API key.
  ARK_MODEL_ID          Optional. Default model/endpoint ID.
`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  let prompt: string | undefined;
  let model: string | undefined;
  let ratio = '16:9';
  let duration = 5;
  let generateAudio = false;
  let watermark = false;
  let outputDir = './output';
  let pollInterval = DEFAULT_POLL_INTERVAL_MS;
  let timeout = DEFAULT_TIMEOUT_MS;
  let download = true;
  let jsonMode = false;
  let taskId: string | undefined;

  let firstFrame: string | undefined;
  let lastFrame: string | undefined;
  let continuityFrame: string | undefined;
  const refImages: string[] = [];
  const refVideos: string[] = [];
  const refAudios: string[] = [];

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--prompt':
        prompt = args[++i];
        break;
      case '--model':
        model = args[++i];
        break;
      case '--ratio':
        ratio = args[++i];
        break;
      case '--duration':
        duration = parseInt(args[++i], 10);
        break;
      case '--audio':
        generateAudio = true;
        break;
      case '--watermark':
        watermark = true;
        break;
      case '--no-watermark':
        watermark = false;
        break;
      case '--output-dir':
        outputDir = args[++i];
        break;
      case '--poll-interval':
        pollInterval = parseInt(args[++i], 10) * 1000;
        break;
      case '--timeout':
        timeout = parseInt(args[++i], 10) * 1000;
        break;
      case '--no-download':
        download = false;
        break;
      case '--json':
        jsonMode = true;
        break;
      case '--task-id':
        taskId = args[++i];
        break;
      case '--first-frame':
        firstFrame = args[++i];
        break;
      case '--last-frame':
        lastFrame = args[++i];
        break;
      case '--continuity-frame':
        continuityFrame = args[++i];
        break;
      case '--ref-images': {
        i++;
        while (i < args.length && !args[i].startsWith('--')) {
          refImages.push(args[i++]);
        }
        i--;
        break;
      }
      case '--ref-videos': {
        i++;
        while (i < args.length && !args[i].startsWith('--')) {
          refVideos.push(args[i++]);
        }
        i--;
        break;
      }
      case '--ref-audios': {
        i++;
        while (i < args.length && !args[i].startsWith('--')) {
          refAudios.push(args[i++]);
        }
        i--;
        break;
      }
      default:
        if (!args[i].startsWith('--') && !prompt) {
          prompt = args[i];
        }
        break;
    }
  }

  model = model || process.env.ARK_MODEL_ID || '';
  if (!model) {
    console.error('[Seedance] Error: No model specified. Use --model <endpoint_id> or set ARK_MODEL_ID env.');
    process.exit(1);
  }

  // JSON mode: read full request from stdin
  if (jsonMode) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    const body = JSON.parse(raw);
    if (!body.model) body.model = model;
    const result = await createTask(body);
    const final = await pollUntilDone(result.id, { pollIntervalMs: pollInterval, timeoutMs: timeout });
    console.log(JSON.stringify(final, null, 2));
    if (download && final.content?.video_url) {
      fs.mkdirSync(outputDir, { recursive: true });
      const outFile = path.join(outputDir, `seedance-${result.id}.mp4`);
      await downloadVideo(final.content.video_url, outFile);
    }
    return;
  }

  // Resume polling existing task
  if (taskId) {
    console.error(`[Seedance] Resuming poll for task ${taskId}...`);
    const final = await pollUntilDone(taskId, { pollIntervalMs: pollInterval, timeoutMs: timeout });
    console.log(JSON.stringify(final, null, 2));
    if (download && final.content?.video_url) {
      fs.mkdirSync(outputDir, { recursive: true });
      const outFile = path.join(outputDir, `seedance-${taskId}.mp4`);
      await downloadVideo(final.content.video_url, outFile);
    }
    return;
  }

  if (!prompt) {
    console.error('[Seedance] Error: --prompt is required.');
    printUsage();
    process.exit(1);
  }

  const content = buildContent({
    prompt,
    refImages,
    continuityFrame,
    refVideos,
    refAudios,
    firstFrame,
    lastFrame,
  });

  const reqBody: CreateTaskRequest = {
    model,
    content,
    ratio,
    duration,
    watermark,
  };
  if (generateAudio) reqBody.generate_audio = true;

  const createResult = await createTask(reqBody);
  const final = await pollUntilDone(createResult.id, { pollIntervalMs: pollInterval, timeoutMs: timeout });

  console.log(JSON.stringify(final, null, 2));

  if (download && final.content?.video_url) {
    fs.mkdirSync(outputDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outFile = path.join(outputDir, `seedance-${ts}-${createResult.id}.mp4`);
    await downloadVideo(final.content.video_url, outFile);
    console.error(`[Seedance] Video saved: ${outFile}`);
  }
}

main().catch((err) => {
  console.error('[Seedance] Fatal error:', err.message || err);
  process.exit(1);
});
