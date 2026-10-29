# Dimension Review Template | 维度审视模板

Templates for breaking holistic verdicts into per-dimension matrices. Pick the template that
matches the artifact under review. Add or remove rows as needed.

## How to use

1. Pick the matching template below.
2. Fill in **all cells** — empty cells hide real risk.
3. Per cell, give one-line evidence with concrete reference (file path + line / chapter number).
4. End with **"Real gaps (ranked)"** list — every ⚠️ / ❌ in the matrix must reappear here with
   lift / cost estimate.

---

## Template A: Web novel / 网文小说

Use when reviewing chapters, outlines, or full novel design. The dimensions reflect 晋江 /
起点 / 番茄 中文网文 conventions and the design patterns in 神冕宇宙 / AI 判我不可加冕.

| Dimension | 章 (current chapter) | 卷 (current volume) | 全文 (whole work) |
|---|---|---|---|
| 悬念 (suspense) | | | |
| 爽点 (payoff / 爽文 hits) | | | |
| 大女主主控 (heroine agency) | | | |
| 男主算计可视化 (male-lead-calculation visibility) | | | |
| 后宫密度 (harem cadence) | | | |
| AI 技术锚点 (real-world tech anchor) | | | |
| 反派记忆度 (villain memorability) | | | |
| 截屏金句 (screenshot-grade lines) | | | |
| 章末钩子 (chapter-end hook strength) | | | |
| 信息量控制 (info-load discipline) | | | |
| 毒点风险 (toxicity / red-line risk) | | | |
| 文风 (prose register / pacing) | | | |

### Cell legend

- ✅ strong — has clear evidence in artifact
- ⚠️ weak / under-supplied — exists but light or fragile
- ❌ missing — no evidence in artifact
- ⚪ N/A by design — intentionally absent (must state intent)

### Real gaps (ranked)

| # | Dimension | Where | Gap | Lift | Cost |
|---|---|---|---|---|---|
| 1 | | | | high/med/low | file/section/rewrite |

---

## Template B: Screenplay / 剧本

| Dimension | 场 (scene) | 集 (episode) | 全剧 (series) |
|---|---|---|---|
| 3 秒钩 (3s opening hook) | | | |
| 主线推进 (main-plot progression) | | | |
| 人物欲望 (character want clarity) | | | |
| 场景压力 (scene-level pressure) | | | |
| 反派当下行动 (villain present-tense action) | | | |
| 视觉锁 (visual lock per character) | | | |
| 台词金句 (quotable dialogue) | | | |
| 转场强度 (transition strength) | | | |
| 集末钩 (episode-end cliffhanger) | | | |

---

## Template C: Product / feature design

| Dimension | 单功能 (single feature) | 模块 (module) | 全产品 (whole product) |
|---|---|---|---|
| User intent fit | | | |
| Edge-case coverage | | | |
| Failure mode visibility | | | |
| Onboarding friction | | | |
| Performance budget | | | |
| Security / privacy red lines | | | |
| Telemetry / observability | | | |
| Rollback / kill-switch | | | |
| Cost (eng / runtime / human) | | | |

---

## Template D: Technical document / requirements / design doc

| Dimension | 段 (section) | 章 (chapter) | 全文 (whole doc) |
|---|---|---|---|
| 受众明确 (audience clarity) | | | |
| 范围声明 (scope statement) | | | |
| 决策记录 (decisions captured) | | | |
| 替代方案 (alternatives considered) | | | |
| 风险 / 失败模式 (risks / failure modes) | | | |
| 验收标准 (acceptance criteria) | | | |
| 责任人 / 时间 (owner / timeline) | | | |
| 引用 / 来源 (citations / sources) | | | |

---

## Template E: Code / module review

| Dimension | 函数 (function) | 文件 (file) | 模块 (module) |
|---|---|---|---|
| Correctness on happy path | | | |
| Edge cases (empty / null / overflow) | | | |
| Error surfacing (no silent default-fill) | | | |
| Logging / observability | | | |
| Performance / hot path | | | |
| Security / secret handling | | | |
| Test coverage on new behavior | | | |
| Reuses existing components (no reinvention) | | | |
| Production / test code in lockstep | | | |
| Backward compatibility / migration | | | |

---

## Adding a new template

If you find a recurring artifact type (e.g., growth experiment doc, marketing landing page,
LLM prompt suite), copy one of the above as a starting point. Keep rows and columns minimal —
8-12 dimensions × 3 scope levels is the sweet spot. More than that and the matrix becomes
unreadable.
