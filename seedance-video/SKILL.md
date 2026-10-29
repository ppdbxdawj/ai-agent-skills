---
name: seedance-video
description: |
  使用 Seedance 2.0（即梦AI视频）的 Ark Content Generation API 生成视频。
  支持图生视频（参考图 r2v）、首帧/首尾帧图生视频（i2v）、文生视频（t2v）、
  视频延长、多模态参考生视频。默认模式为「图生视频-基于参考图」（r2v）。
  异步任务流程：创建任务 → 轮询状态 → 下载 MP4。

  Triggers: "seedance video", "生视频", "视频生成", "图生视频", "参考图生视频",
  "text to video", "image to video", "i2v", "r2v", "t2v", "video generation",
  "seedance 2.0", "即梦视频", "首帧生视频", "首尾帧生视频", "视频延长",
  "extend video", "reference image video", "多模态视频",
  "反重力", "物体漂移", "道具物理", "蒙太奇分拍", "拆分 Seg",
  "末帧参考", "串行生成", "并行生成", "标准禁止行".
  When the user asks for a creative/emotional/atmospheric video prompt, single-scene concept,
  multi-shot vibe, montage-like scene, or mixed creative + camera-control text, first consider
  `vibe-creating-prompt`; if suitable for Vibe Creating, use that skill before this Seedance
  execution workflow.
---

# Seedance Video Generation | 即梦视频生成

基于 Ark Content Generation API 的视频生成技能。异步任务制：创建 → 轮询 → 下载。

## Prompt 前置路由：Vibe Creating 优先级

写 Seedance 提示词前，先判断用户要的是「创意提纯」还是「执行生成」。

优先调用 `vibe-creating-prompt` 的情况：

- 单幕、单意象、情绪化画面、概念短片、氛围短片。
- 多镜头内容共同服务一个统一体验，而不是严格执行拍摄单。
- 用户输入混有焦段、机位、镜头号、剪辑术语，但底层目标是画面情绪、关键意象或观看感受。
- 用户要求“优化/改写/提纯/更适合视频生成/更有感觉”的 Seedance prompt。

直接使用本 Seedance workflow 的情况：

- 用户要实际调用 API、生成 MP4、串行/并行排程、下载、续跑或重跑。
- 用户要 `@图片N` 引用、服装锁定、render unit、末帧 continuity、manifest 或八角笼式短剧 Gate G prompt。
- 长篇剧情片需要精确对白同步，或用户明确要求保留镜头编号、参数、时间块和交付结构。
- UI 教程、功能演示、工业化执行拍摄单。

结合方式：

1. 若适合 Vibe Creating，先用 `vibe-creating-prompt` 输出创意版或轻度提纯版。
2. 再用本 skill 补齐 Seedance 执行层：参考图、比例、时长、音频、禁止行、continuity、render unit 拆分和脚本命令。
3. 如果 VC 会破坏用户硬约束，只提供可选 VC 版，不替换原执行稿。

## API 概览

| 项目 | 说明 |
|------|------|
| **创建任务** | `POST https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks` |
| **查询任务** | `GET  https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks/{id}` |
| **鉴权** | Header `Authorization: Bearer <ARK_API_KEY>` |
| **输出** | `content.video_url` 字段，MP4 格式 |

## 支持的模式

### 1. 图生视频-基于参考图（r2v）— 默认模式

模型精准提取参考图（支持 1-9 张）中对象的关键特征，在视频中高度还原对象的形态、色彩和纹理。

**content 结构**：
```json
{
  "type": "text",
  "text": "提示词，描述视频内容。用'图1'、'图2'等引用参考图"
}
{
  "type": "image_url",
  "image_url": { "url": "https://..." },
  "role": "reference_image"
}
```

**提示词示例**（参考图）：
- `"参考图生视频：团播视频，6个帅气的男主播分别为图1、图2...他们卖力地热舞"`
- `"以图1人物为主角，在城市街道上奔跑，电影感镜头，暖色调"`

**注意**：r2v 与首帧/首尾帧（i2v）不可混用。同一请求中不能同时存在 `first_frame` 和 `reference_image` 两种 role。

### 2. 首帧图生视频（i2v - first_frame）

指定一张图片作为视频首帧，模型基于该图生成连贯视频。

```json
{
  "type": "image_url",
  "image_url": { "url": "https://..." },
  "role": "first_frame"
}
```

### 3. 首尾帧图生视频（i2v - first_frame + last_frame）

指定首帧和尾帧图片，模型生成自然过渡的视频。

```json
{ "type": "image_url", "image_url": { "url": "首帧url" }, "role": "first_frame" }
{ "type": "image_url", "image_url": { "url": "尾帧url" }, "role": "last_frame" }
```

### 4. 文生视频（t2v）

仅传入文字提示词，不传图片/视频素材。

### 5. 多模态参考（r2v 进阶）

支持同时传入：0-9 张参考图 + 0-3 个参考视频 + 0-3 个参考音频。至少传一张图或视频。

```json
{ "type": "image_url",  "image_url": { "url": "..." }, "role": "reference_image" }
{ "type": "video_url",  "video_url": { "url": "..." }, "role": "reference_video" }
{ "type": "audio_url",  "audio_url": { "url": "..." }, "role": "reference_audio" }
```

### 6. 视频延长

传入 1-3 段视频，通过 prompt 指定延长方向或中间补全。

| 输入 | 行为 | duration 含义 |
|------|------|---------------|
| 1段视频 | 向后延长或向前补全 | 延长内容的时长（不含原视频） |
| 2段视频 | 中间补全 | 总视频长度（含原视频） |
| 3段视频 | 补全各段衔接 | 总视频长度（含原视频） |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | Endpoint ID |
| `content` | array | 是 | 多模态内容数组（text/image_url/video_url/audio_url） |
| `ratio` | string | 否 | 画面比例：`16:9`（默认）/ `9:16` / `1:1` |
| `duration` | number | 否 | 视频时长（秒），默认 5 |
| `generate_audio` | boolean | 否 | 是否生成音频，默认 false |
| `watermark` | boolean | 否 | 是否加水印，默认 false |

## 任务状态

| 状态 | 说明 |
|------|------|
| `queued` | 排队中 |
| `running` | 生成中 |
| `succeeded` | 成功，`content.video_url` 可下载 |
| `failed` | 失败，查看 `error.message` |

## 脚本使用

**脚本位置**：`seedance-video-generate.ts`（本 skill 目录下）

**环境变量**：
- `ARK_API_KEY`（必填）— 填入 `.env` 文件或 export
- `ARK_MODEL_ID`（可选）— 默认模型 Endpoint ID

**API Key 配置位置**：复制 `.env.example` 为 `.env`，填入你的 key：
```bash
cp .env.example .env
# 编辑 .env，填入 ARK_API_KEY 和 ARK_MODEL_ID
```

### 图生视频-基于参考图（最常用）

```bash
npx ts-node seedance-video-generate.ts \
  --model "<Endpoint_ID>" \
  --prompt "以图1人物为主角，在海边奔跑，电影感运镜，黄金时刻暖光" \
  --ref-images "https://example.com/character.jpg" \
  --ratio 9:16 \
  --duration 5 \
  --audio
```

多张参考图：
```bash
npx ts-node seedance-video-generate.ts \
  --model "<Endpoint_ID>" \
  --prompt "图1和图2两个人在咖啡厅对面而坐，自然聊天，温馨氛围" \
  --ref-images "https://example.com/person1.jpg" "https://example.com/person2.jpg" \
  --ratio 16:9 \
  --duration 8
```

### 首帧图生视频

```bash
npx ts-node seedance-video-generate.ts \
  --model "<Endpoint_ID>" \
  --prompt "镜头缓缓推近，花瓣在微风中飘落" \
  --first-frame "https://example.com/opening.jpg" \
  --duration 5
```

### 首尾帧图生视频

```bash
npx ts-node seedance-video-generate.ts \
  --model "<Endpoint_ID>" \
  --prompt "从白天过渡到夜晚的延时摄影效果" \
  --first-frame "https://example.com/day.jpg" \
  --last-frame "https://example.com/night.jpg" \
  --duration 5
```

### 文生视频

```bash
npx ts-node seedance-video-generate.ts \
  --model "<Endpoint_ID>" \
  --prompt "写实风格，晴朗蓝天下一大片白色雏菊花田，镜头逐渐拉近定格在一朵雏菊特写，花瓣上晶莹露珠" \
  --ratio 16:9 \
  --duration 5
```

### 多模态参考（图+视频+音频）

```bash
npx ts-node seedance-video-generate.ts \
  --model "<Endpoint_ID>" \
  --prompt "以图1和图2的水果茶为主体，第一人称POV拍摄广告..." \
  --ref-images "https://example.com/tea1.jpg" "https://example.com/tea2.jpg" \
  --ref-videos "https://example.com/pov-ref.mp4" \
  --ref-audios "https://example.com/bgm.mp3" \
  --ratio 16:9 \
  --duration 11 \
  --audio
```

### 恢复轮询已创建的任务

```bash
npx ts-node seedance-video-generate.ts --task-id "task_xxxxx"
```

### JSON 模式（完全自定义请求体）

```bash
echo '{
  "model": "<Endpoint_ID>",
  "content": [
    { "type": "text", "text": "..." },
    { "type": "image_url", "image_url": { "url": "..." }, "role": "reference_image" }
  ],
  "ratio": "16:9",
  "duration": 5,
  "generate_audio": true
}' | npx ts-node seedance-video-generate.ts --json
```

### 全部 CLI 选项

| 选项 | 说明 |
|------|------|
| `--prompt "text"` | 文本提示词（必填，除 --json 模式） |
| `--model <id>` | 模型 Endpoint ID（或用 ARK_MODEL_ID 环境变量） |
| `--ref-images url1 url2 ...` | 角色/场景参考图（与 continuity 合计最多 9 张） |
| `--continuity-frame path` | 上一 Seg 末帧，作为**最后一张** `reference_image`（r2v，与角色参考图同请求） |
| `--ref-videos url1 ...` | 参考视频 URL（0-3 个） |
| `--ref-audios url1 ...` | 参考音频 URL（0-3 个） |
| `--first-frame url` | 首帧图 URL（i2v 模式） |
| `--last-frame url` | 尾帧图 URL（i2v 模式，需与 --first-frame 配合） |
| `--ratio 16:9\|9:16\|1:1` | 画面比例（默认 16:9） |
| `--duration N` | 视频时长秒数（默认 5） |
| `--audio` | 生成含音频的视频 |
| `--watermark` | 启用水印 |
| `--no-watermark` | 禁用水印（默认） |
| `--output-dir <dir>` | 输出目录（默认 ./output） |
| `--poll-interval N` | 轮询间隔秒数（默认 40） |
| `--timeout N` | 超时秒数（默认 600） |
| `--no-download` | 不自动下载视频 |
| `--json` | 从 stdin 读取完整 JSON 请求体 |
| `--task-id <id>` | 恢复轮询已有任务 |

## 先拆分，再排程（重要）

写 Seedance prompt 或提交任务前，必须先把剧本里的 `story Seg` 拆成可生成的 `render unit`，再判断每个 unit 是否需要上一 unit 的末帧参考。这个判断决定执行方式：**需要 continuity 的链必须串行；不需要 continuity 的 unit 可以并行提交**。

### 1. 什么时候要拆成多个 render unit

优先拆分这些情况：

| 情况 | 拆分方式 |
|------|----------|
| 同一 Seg 超过 15s，或 15s 内跨多个不连续地点/时间/光线 | 拆成多个 render unit，或至少在 prompt 内严格分拍 |
| 15s 内的同一场戏，硬切只是为了叙事分拍 | 优先保留一个 render unit，用 `0-4s / 4-7s / …` 内部分拍写清镜头与出镜名单 |
| 地点、时间、光线或服装参考图发生明确变化 | 拆成独立 render unit |
| 同一 Seg 前半只需要角色A、后半才需要角色B/C/D，且上传全量参考会导致提前出镜/重复角色 | 拆成独立 render unit；每个 unit 只上传当前画面会出现的参考图 |
| 道具物理复杂（布料、纸张、杯子、液体） | 拆成短 unit，单 unit 只承载一条道具动作链 |
| 多人对白容易抢嘴或嘴型重叠 | 按说话人拆分，或在同一 unit 内用 1–2s 硬切分拍 |
| 蒙太奇超过 8–10s 或含 4 个以上子镜头 | 优先拆成多个 render unit；若每拍不足模型最小时长，则保留一个 unit 内分拍 |
| 单个子镜头低于模型最小时长 | 不单独提交，合并到相邻 unit 或写成内部 `0-1.5s / 1.5-5s` 分拍 |

经验阈值：Seedance 常见最小时长为 4–5s；低于 4s 的镜头不要单独提交。若剪辑目标是 3s，但 API 不接受，应提交 5s 并在计划中标注 `edit_duration=3`、`render_duration=5`。不要把“内部硬切”误判成必须拆 render unit：像 9–11s 的餐厅误会或后台羞辱，只要地点/服装/参考集稳定，就保留一个 unit；像 Seg5 这种前后参考集冲突的场景才拆。

### 2. continuity 判定表

| 判定 | 是否传上一末帧 | 执行方式 |
|------|----------------|----------|
| 同一地点、同一时间、同一光线连续，镜头从上一段自然接下去 | 是 | 串行，先完成上一 unit，优先用接口返回的末帧提交下一 unit |
| 同一场戏被技术性拆段，主体位置/灯光/机位需要延续 | 是 | 串行 |
| 上一末帧中的角色会造成“多余角色/重复角色”风险，但空间光线必须延续 | 通常仍传，但 prompt 必须写明末帧仅用于场景/光线，禁止把其中人物当角色 | 串行，审片重点查 ghost |
| 硬切、闪回、梦境、居家/舞台切换、换地点、换服装参考图 | 否 | 可并行 |
| 蒙太奇快切、训练合集、标题卡、投票光效 | 否 | 可并行 |
| 下一段只需要角色一致性，不需要空间延续 | 否，使用角色参考图即可 | 可并行 |

### 3. 生成计划必须写清

对整集或 trailer，先产出一个计划表：

```text
unit_id | source_seg | prompt_file | ref_images | duration | continuity_from | execution_group | reason
```

- `continuity_from` 为空：可放入并行批次。
- `continuity_from=上一unit_id`：必须在同一串行链里；上一 unit 完成后优先读取接口返回的末帧 URL，只有接口没有末帧字段时才从 mp4 抽末帧。
- 同一串行链之间可以并行。例如 `stage_open_chain: seg01 -> seg02 -> seg03a` 与 `stage_return_chain: seg09b -> seg09c` 可以同时启动，但链内不能乱序。15s 内同一场戏的内部硬切通常不单独建串行链。
- 计划中同时保留 `edit_duration` 与 `render_duration`，避免 API 最小时长污染剪辑时长。

### 4. continuity prompt 必写句

当使用 `--continuity-frame` 时，在 prompt 正文中加入：

```text
@图片{N+1}为上一镜头末帧，仅用于场景、光线、机位和空间延续；角色身份、服装和动作仍严格以@图片1…@图片N为准。禁止把@图片{N+1}中的人物/动物当作额外角色，禁止因此复制任何@图片N。
```

## 同集连续 Seg 衔接（重要）

同一集里，若 **下一个 Seg 与上一个 Seg 相关**（同一场戏拆段、空间/光线/机位延续），必须把 **上一 Seg 的最后一帧** 作为 **参考图** 输入下一段，而不是只靠文字描述。

### 与 i2v 首尾帧模式的区别

| 方式 | API | 用途 |
|------|-----|------|
| **接口返回末帧 URL（优先）** | r2v：`reference_image`，末帧排在角色图**之后** | 场景/光线延续，角色仍靠 `@图片1…@图片N` 锁定 |
| 本地抽帧 fallback | r2v：`reference_image`，用 `extract-last-frame.sh` 从 mp4 抽图 | 仅当任务结果没有末帧字段时使用 |
| i2v 首帧衔接 | `first_frame` = 上段末帧 | 不能与 `reference_image` 混用；适合纯画面接力、无多角色参考锁 |

Angela's Music Dream 等多角色短剧：**用末帧参考图（r2v）**，不用 i2v 首帧替代角色参考。末帧来源优先级：**任务接口返回的 last-frame URL > 本地 ffmpeg 抽帧**。

### 操作步骤

1. **规划**：在分镜/CD-storyboard 标注每 Seg 是否 `related_to_previous`。
2. **顺序生成**：相关 Seg 必须等上一段任务 `succeeded` 后再提交下一段；无关 Seg 可并发。
3. **优先用接口返回末帧**：查询任务结果后，检查 `content.last_frame_url`、`content.last_frame`、`content.cover_url`、`content.thumbnail_url` 等末帧/封面字段；若有 URL，直接作为下一段 `--continuity-frame`（脚本会把 URL 作为 `reference_image` 传入）。
4. **没有接口末帧时才抽帧**：

```bash
bash extract-last-frame.sh /path/seg01.mp4 /path/continuity/seg01-last.jpg
```

5. **提交下一段**（末帧为最后一张参考图）：

```bash
npx ts-node seedance-video-generate.ts \
  --prompt "…@图片3为上一镜头末帧，仅用于场景与光线延续…" \
  --ref-images char1.png char2.png \
  --continuity-frame /path/continuity/seg01-last.jpg \
  --ratio 9:16 --duration 8 --audio
```

6. **整集 manifest 串联**（推荐）：

```bash
npx ts-node seedance-chain-episode.ts \
  --manifest episode-manifest.json \
  --out-dir ./render/EP01
```

`episode-manifest.json` 示例见同目录 `episode-manifest.example.json`。

### Prompt 写法（连续 Seg）

- 上传顺序表：`@图片1…@图片N` = 角色；`@图片N+1` = 上一 Seg 末帧。
- 正文必须写清：`@图片N+1` 仅为上一镜头末帧，用于场景/光线/机位延续，**不得**改变 `@图片1…@图片N` 的外形与服装。
- 禁止把末帧里的人物当成名单外无关人员或重复角色。

## 蒙太奇 / 多节拍 Seg（防同一角色出现两次）

**典型失败**：一句话并列「@图片2做A、@图片3做B…舞台并肩」，模型在同一画面或快切里生成两个相同角色（如两个 Jollie）。

**必须**：

1. 按 `0-2s / 2-4s / …` **硬切分拍**，每子镜头 1.5–2.5s。
2. 子镜头写清出镜名单：`画面内仅有@图片3与@图片1，各一个身体` 或 `画面内仅有@图片4，单主体`。
3. 有道具/手部动作时写清**运动学接触链**：`手/爪 → 道具 → 目标/台面/身体`，例如口红贴手和嘴、吹风机贴手且喷嘴朝头发、笔尖贴白板、碗放桌面；禁止工具/面粉/乐器/笔悬空漂移。
4. 同框镜头：`@图片1与@图片2、@图片3、@图片4、@图片5一字排开，每个@图片各一个身体，禁止同一@图片出现两次`。
5. **末镜同框**用中全景（膝上），动物写清短毛绒腿踩地、仅上半身动作；末 0.5s 可定格；禁止腿植物化/藤蔓化。
6. 全段强调：`任意时刻每个@图片N最多只出现1个该角色身体`。
7. 禁止行必须含：`禁止重复角色…` + `禁止腿或四肢变成植物、藤蔓、花朵、茎干`。

项目级细则见 `Angela's Music Dream` → `docs/production-reference-rules.md` §11–§12。

## 双节拍 Seg（两空间 / 两动作，非蒙太奇快切）

**典型失败**：一句写完「@图片1 弹琴；镜头移到墙头四萌豆偷看」——模型在同一时段混出两个空间，或物体漂移。

**必须**：

1. **按出镜名单分时段硬切**，不要一句并列两个空间的全部角色。
2. 第一节拍：`画面内仅有@图片1`，单空间单动作。
3. 第二节拍：只写该空间该组角色；动物墙头用 `墙沿以下不出镜、不画腿`。
4. 末 1–1.5s 可 **定格**，减少末帧形体突变。

**如果仍然出现重复角色，必须升级为 render-unit 拆分**：

- `seg05a`：只上传弹琴人物参考图，只拍室内弹琴；禁止动物、玩偶、彩色毛绒物出现在钢琴/窗边。
- `seg05b`：只上传偷看的动物参考图，只拍室外窗台背影；窗内只保留钢琴/琴键/光影作为模糊环境线索，不上传也不画弹琴人物主体。
- 原则：不要为了“后半段会用到”而在前半段同一个请求里上传非当前画面的角色。Seedance 容易把所有上传参考图提前塞进画面，导致重复角色或空间混叠。

## 道具 / 液体 / 布料 Seg（防反重力与漂移）

**典型失败**（Seg8 类）：布料拱起悬空、曲谱漂在胸前与手脱离、咖啡杯断手漂浮、液体反重力或凭空出现。

**全段开头建议加一句**：

```text
遵守真实重力；人物双脚踩地；物体有重量与接触阴影。
```

**分类型写法**：

| 类型 | 必须写清 | 禁止 |
|------|----------|------|
| **布料** | `@图片N 拎起/松手 → 垂直下落 → 落在肩上再垂下` | 「从上方落下」却不写谁拿着；僵直拱形悬空 |
| **纸质道具** | `贴手掌传递，手递手`；末态 `平放在桌面/台面` | 曲谱/纸张在空中停住、漂在胸前 |
| **液体** | `杯口向下倾斜，液体只向下流入水平纸面`；杯与手完整连接 | 断手断杯、液体向上飘、凭空溅出 |
| **镜头** | 道具戏优先 **固定中景** | 「快速跟摇」加剧漂移 |

**分拍**：每节拍写 **情绪/表情/视线** + 道具动作链（拿→递→放→倒）；物理约束用短句即可，**勿用技术说明挤掉演技**。羞辱、冲突、误会戏必须写可见情绪（僵住、冷笑、受伤等）。

用 `0-4s / 4-7s / 7-10s / 10-11s` 硬切；末镜可缓推特写强化情绪。

## 服装锁定 + 外用道具（防衣服乱套）

**典型失败**：羞辱戏里「裙子/布料落下」→ 模型给主角穿上礼裙、或与牛仔外套/百褶裙层叠；道具布竖直漂浮并融入身体。

**段首必须写**各 `@图片N` 具体服装（照参考图枚举），并声明 `全段禁止换装、禁止第二套服装层叠`。

**外用道具**写法：

- `独立小块浅粉软布（外用羞辱道具，不是穿着、不是礼服）`
- `只盖住头肩，与@图片1已穿服装完全分离`
- 避免 `亮色舞台裙装` 等大面积缎面描写（易污染全身服装）

**禁止行**须含：`禁止把外用道具布料与角色服装融合` / `禁止换装、礼裙层叠错乱`。

### 道具 Seg 提交块示例（11s）

```text
竖屏9:16，11秒，美式3D现代音乐短剧。后台；遵守真实重力，双脚踩地，物体有重量与接触阴影。
0-4s：固定中景，画面内仅有@图片1与@图片2。@图片2在画面边缘拎起裙装布料松手，布料受重力垂直下落落在@图片1肩头再垂下；@图片1服装不变。
4-7s：硬切固定中景，画面内仅有@图片1–@图片4。@图片4双手握曲谱贴胸；@图片2双手接过贴掌递给@图片1，@图片1双手握紧贴胸。
7-10s：硬切中近景，画面内仅有@图片1与@图片2。@图片1把曲谱平放台面；@图片2右手握杯口向下倾，咖啡液向下流入纸面。
10-11s：同构图末帧定格，曲谱贴台面不动。
SFX：布料落下、纸张摩擦、咖啡倾倒；音乐后期添加。
禁止：（粘贴本 skill 目录 `seedance-standard-forbid.txt` 全文）
```

## 标准禁止行（所有 Seg 提交块末尾）

**每个提交块末尾统一粘贴**（全文见同目录 `seedance-standard-forbid.txt`）：

```text
禁止：…（全文见 `seedance-standard-forbid.txt`，含禁止道具布料与服装融合、禁止换装与服装层叠错乱）
```

短剧项目若另有角色规则（如动物只用 base、禁止 BGM），在禁止行之前用正文锁定，或见项目 `docs/production-reference-rules.md`。

## Prompt 结构检查清单（写提交块前）

| 场景 | 用哪套规则 |
|------|------------|
| 蒙太奇 / 多动作快切 | §蒙太奇分拍 + 防重复 |
| 两空间 / 两节拍（弹琴→墙头） | §双节拍 |
| 布料 / 纸张 / 液体 / 传递道具 | §道具物理 + 固定机位 |
| 外用羞辱布 + 人类服装 | §服装锁定 + 外用道具（段首枚举服装） |
| 多人同框末镜（动物） | 中全景膝上 + 短腿踩地 + 末帧定格 |
| 四萌豆拍手（Seg2 类） | @图片1 手空中拍两下→横移依次入画横排拍手；禁止缓拉浮头 |
| 整集 / trailer 生成 | 先产出 render-unit 计划；标注 `continuity_from`；串行链与并行批次分开 |
| 导演修订 FULL-105s | 见项目 `docs/FULL-105s-director-revision-map.md` |
| 同集连续 Seg | §同集衔接 + `--continuity-frame` |
| 所有 Seg | 末尾粘贴 `seedance-standard-forbid.txt` |

## Agent 工作流

1. **用户描述需求**：要生成什么样的视频、用哪些参考图；是否同集连续 Seg。
2. **拆 render unit**：按地点、服装、道具复杂度、对白主体、API 最小时长拆分；短镜头合并为内部分拍。
3. **排程**：为每个 unit 标注 `continuity_from`。有 continuity 的链内串行；无 continuity 的 unit 或不同串行链可以并行。
4. **选 prompt 模板**：蒙太奇 / 双节拍 / 道具物理 / 普通单段 / continuity；对照上方检查清单改写分拍表。
5. **确认参数**：prompt（含分时段 + 标准禁止行）、参考图、`--continuity-frame`、ratio、`render_duration`、音频。
6. **执行**：串行链用上一 mp4 抽末帧后提交下一段；独立 unit 用并行 shell 直接提交。
7. **等待完成**：40s 轮询，下载 MP4；输出文件复制为 `项目-segNN-版本.mp4` 便于查找。
8. **返回结果**：视频路径、失败重试项、以及实际使用的 continuity frame。

```bash
cd ~/.cursor/skills/seedance-video
npx ts-node seedance-video-generate.ts \
  --model "<endpoint_id>" \
  --prompt "你的提示词" \
  --ref-images "角色图1" "角色图2" \
  --continuity-frame "上一seg接口返回的末帧URL或fallback抽帧.jpg" \
  --ratio 9:16 \
  --duration 5 \
  --audio
```

## 提示词技巧（图生视频-参考图模式）

### 角色引用
在 prompt 中用「图1」「图2」等引用上传的参考图顺序：
```
"以图1人物为主角，图2为配角，两人在雨中相遇，对视3秒后图1转身离去"
```

### 运镜描述
```
"镜头从远景缓缓推近至中景" / "跟随拍摄" / "环绕360度" / "俯拍鸟瞰"
"固定机位" / "手持晃动感" / "轨道横移" / "缓慢上升crane shot"
```

### 风格关键词
```
"电影感" / "写实风格" / "动漫风格" / "复古胶片质感"
"高对比度" / "莫兰迪色调" / "赛博朋克霓虹" / "黄金时刻暖光"
```

### 完整 prompt 结构（短剧 / 多参考图）

推荐结构（与 `@图片N` 上传顺序一致，**不要写角色英文名**）：

```text
竖屏9:16，{时长}秒，{风格与场景}；{重力/踩地声明（有道具时必填）}。
0-{t1}s：{镜头}，画面内仅有@图片…；{单节拍动作链}。SFX：…
{t1}-{t2}s：硬切…
…
禁止：（seedance-standard-forbid.txt 全文）
```

通用要素：`[画幅时长] + [分拍时段] + [每拍出镜@图片白名单] + [动作/道具物理链] + [SFX 无 BGM] + [标准禁止行]`

简单单段（无分拍）仍可用：

```
[风格] + [镜头运动] + [主体描述（用图N引用）] + [动作/行为] + [环境/光线] + [情绪氛围]
```

示例：
```
"电影感写实风格，镜头从中景缓慢推近至特写。以图1为主角的年轻女性站在落地窗前，
窗外是城市夜景，她缓缓转身面向镜头微笑。暖色室内灯光与冷蓝夜景形成对比，
情绪温柔而略带忧郁。浅景深，背景虚化。"
```
