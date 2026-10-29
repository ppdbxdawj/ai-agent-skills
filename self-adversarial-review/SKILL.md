---
name: self-adversarial-review
description: |
  Apply self-adversarial review during creative / design / writing iteration to break the model's
  self-approval inertia. 自对抗 review 方法，打破模型对自己刚做的事的赞同惯性。

  Use this skill when:
  (1) The user references another model's or another version's evaluation as anchor — e.g.
      "GPT-5.5 说指定爆", "Claude 4.7 又优化了一轮", "上一版评估说 X", "另一个 agent 说够了"
      → never agree first; do independent dissent first.
  (2) The user asks a meta-judgment question — "都有吗", "指定爆吗", "怎么说", "没问题了是不",
      "够不够", "还有没有优化空间", "is it enough", "how's it going" — do not answer with
      reassurance; do independent gap-finding.
  (3) The user is in 2nd+ round of iterative creative work — novel chapters, screenplay,
      marketing copy, product design, IP doc, requirements doc, etc.
  (4) The user requests dimension-by-dimension breakdown — "悬念 / 爽文 / 大女主 / 后宫 /
      登顶 都有吗", "performance / security / readability 都有吗".
  (5) The user initiates a major direction change that requires multi-file sync — total length
      change, story-structure pivot, persona shift, target-audience pivot, scope reduction.

  The skill enforces:
  (a) independent dissent over agreement,
  (b) dimension-by-dimension breakdown over holistic verdicts,
  (c) chapter / module / whole-system separation,
  (d) real gaps over polite reassurance,
  (e) version snapshots over overwrites,
  (f) per-version self-check (word count, content red lines, pacing, info density, hook test).

  Trigger this skill EVEN WHEN the user does not explicitly say "review" — citing another
  model / asking a meta-judgment question / starting iteration round 2+ is enough.
license: MIT
metadata:
  author: 疆疆
  version: "0.1.0"
  tags:
    - review
    - creative-iteration
    - novel
    - screenplay
    - product-design
    - dissent
---

# Self-Adversarial Review | 自对抗 Review

This skill captures a working pattern that emerged from creative iteration on 《AI 判我不可加冕》:
the user kept invoking "another model said X" or asking meta-judgment questions, and the agent
had to break out of self-approval inertia and do honest, dimension-by-dimension review.

## Why this skill exists | 为什么需要这个 skill

LLMs naturally lean toward agreeing with their own recent output. When the user is doing
creative or design iteration, this is dangerous — the agent will keep saying "looks good"
and the work will never actually improve.

A skilled user counters this by citing another model's evaluation ("GPT-5.5 said it's a sure
hit"), or by asking a meta-question ("does it really cover X?"). Both maneuvers are
**adversarial framing** — they force the agent to step out of self-approval and produce honest
review.

This skill systematizes that adversarial framing so the agent does it correctly every time,
not just when the user happens to phrase the prompt the right way.

## Six core principles | 六条核心原则

### 1. Independent dissent over agreement | 不附和外部锚点

When the user cites another model / agent / version, **never agree first**. Read the actual
artifact, form an independent judgment, and disagree where warranted. Common bad pattern:
> User: "GPT-5.5 said it's a sure hit, what do you think?"
> Bad: "Yes, I agree, it's a strong project..."
> Good: "No, that's overstated. It's a high-probability project, not a sure hit. Here's why..."

The user used the citation as an **adversarial probe**. Agreeing wastes the probe.

### 2. Dimension over verdict | 维度拆分而非综合判断

Never give a single holistic verdict to a multi-dimensional question. If the user asks
"does it have hook / climax / character / pacing / virality", break it into a per-dimension
table with concrete evidence per cell. Holistic verdicts collapse risk into a single line and
hide real problems.

### 3. Chapter / module / whole-system separation | 章级 vs 卷级 vs 全文级

In creative work, a single chapter / scene / module is judged differently from the whole work.
A chapter can deliberately under-deliver on certain dimensions (e.g., "after-hook is light" in
chapter 1) while the whole work fully covers them. Always state explicitly which level you are
evaluating, and ideally evaluate both.

### 4. Real gaps over polite reassurance | 必须列具体差距

If asked "is it enough", the answer is almost never "yes". Find at least one specific gap,
ranked by lift potential vs effort. If you genuinely find nothing, say so but explicitly state
the verification you did (which files you read, which dimensions you checked) — the user must
be able to audit your "nothing found" claim.

### 5. Version snapshot over overwrite | 创作型迭代分版本不覆盖

For any creative or design iteration, **never overwrite the previous version**. Save each
iteration as a sibling file (`ch001-v0.1.md`, `ch001-v0.2.md`, `ch001-v0.2.1.md`). For major
direction changes, archive the old version (e.g., `outline-v2-100w-archive.md`). The user must
be able to compare and roll back.

See `references/version-snapshot-protocol.md`.

### 6. Per-version self-check | 每版必有自检

Every iteration must end with a self-check block listing the hard-rule conformance check —
word count, content red lines, pacing, info density, chapter-end hook, etc. Write the
self-check into the artifact (frontmatter or footer), not just into the chat. The next
iteration / next agent must be able to read it.

## Standard workflow | 标准工作流（6 步）

When this skill triggers, follow these steps:

### Step 1: Detect the trigger and acknowledge | 识别触发场景

Identify which of the 5 trigger conditions applies. State it briefly in your reply
("这是引用其他模型的对抗性 review 触发" / "这是元判断问题触发"). Knowing the trigger lets you
choose the right response shape.

### Step 2: Read the actual artifacts | 读真东西，不要凭印象

Before forming any opinion, **actually read the files in question**. Do not rely on conversation
memory or summaries. If the artifact is large, read the relevant sections — but read them.

This is where most "agreement inertia" mistakes start: the agent answers from memory of what
it produced two turns ago, not from the current file state.

### Step 3: Build the dimension matrix | 搭维度矩阵

For dimension-style questions, build a table. Columns are dimensions; rows are scope levels
(chapter / volume / whole work, or module / system, or page / app). For each cell, give:
- ✅ / ⚠️ / ❌ status
- one-line evidence with concrete reference (章号 / 文件 / 行号)
- per-design intent ("this is weak by design because…") or per-real gap

Template: `references/dimension-review-template.md`.

### Step 4: Surface real gaps with priority | 找出真差距，按拉分排序

After the matrix, list the real gaps. Each gap must include:
- the dimension it sits on
- estimated lift (high / medium / low)
- estimated cost (file-level edit / single-section / full rewrite)
- specific suggested fix

Sort by lift / cost ratio, not by visual prominence.

### Step 5: Offer choices, not unilateral edits | 给选项让用户拍

Never silently apply major changes during a review. Present the user with at least 2 options:
"A: minimal fix on gap #1 only", "B: top 3 gaps", "C: full pass". Wait for selection. This
respects the user's scope-control habit and prevents unwanted blast radius.

### Step 6: If applying edits, version-snapshot and self-check | 改了就分版本 + 自检

If the user picks an edit option, follow `references/version-snapshot-protocol.md` (don't
overwrite, write a new version file) and end with a self-check block. For major direction
changes (e.g., total length / structure pivot), follow
`references/cross-file-sync-checklist.md` to sync all dependent files in one pass.

## When to skip this skill | 什么时候不用

- Simple one-shot questions ("what does this function do?")
- First-round creative work (use brainstorming / writing-plans skill first)
- Pure factual lookup
- The user explicitly says "just vibe with me / no review needed"

## Anti-patterns | 反模式（绝对不要）

1. **"我觉得这版已经很好了"** without reading the file again — agreement inertia.
2. **"5 个维度都覆盖了"** without per-dimension evidence — holistic collapse.
3. **"Chapter 1 完美"** without separating chapter-level vs whole-work — scope confusion.
4. **"没问题"** when asked "is it enough" without listing what you checked — unverifiable reassurance.
5. Overwriting `ch001.md` with the new version — version loss.
6. Applying multi-file edits during a review request without offering A/B/C choices — scope creep.
7. Treating the user's citation of another model as endorsement — missing the adversarial probe.

## Output shape | 标准输出形状

A typical reply when this skill triggers looks like:

```
[1-2 sentence honest verdict, contrary to agreement inertia where applicable]

## Dimension matrix
| Dimension | Chapter | Volume | Whole work |
|---|---|---|---|
| Hook | ✅ ... | ✅ ... | ✅ ... |
| ...

## Real gaps (ranked)
1. **[Dimension]** — [specific gap] — lift: high / cost: low
2. ...

## Options
- A: [minimal fix description]
- B: [top-N fixes description]
- C: [full pass description]

You pick.
```

## References

| File | When to read |
|---|---|
| `references/dimension-review-template.md` | When building a dimension matrix; contains templates for novel / screenplay / product / technical doc review |
| `references/version-snapshot-protocol.md` | Before applying any edit during review; defines v0.1 / v0.2 / v0.2.1 / archive naming |
| `references/cross-file-sync-checklist.md` | When the user initiates a major direction change requiring sync across outline / project / character / memory files |

## Provenance | 来源

This skill was extracted from the creative iteration session on 《AI 判我不可加冕》(2026-05-27
to 2026-05-28). The user repeatedly used "GPT-5.5 said / Claude 4.7 said / 都有吗 / 怎么说"
patterns to force the agent into adversarial review. The resulting pattern was effective
enough to warrant capture as a reusable skill.

See also: complementary entries added to `jiangjiang-coding/SKILL.md` §1 (independent-dissent
communication preference) and §2 (version-snapshot working preference).
