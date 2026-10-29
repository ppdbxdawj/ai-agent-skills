# Communication & Docs | 文档与对外沟通规则

Read this when writing technical write-ups, weekly reports, design docs, review materials, leadership-facing summaries, or any text that goes outside the immediate dev pair.

写技术文档、周报、设计文档、评审材料、对 leader 的变更说明、以及任何**给团队外的人看的文字**时读这个。

`[疆疆 added 2026-05-25 (from history)]`

> 沟通**对话**风格（中英文一起、选项式确认）见 [`SKILL.md`](../SKILL.md#1-沟通--communication)；本文件只管**文档 / 对外文本**。

## 标题与排版

- **标题从 `#` 开始逐级降**（`#` → `##` → `###`），**不要加序号**（"1. 标题 / 1.1 子标题" 这种是文档软件风，疆疆讨厌）。  
  Heading levels start from `#` and step down; no numeric prefixes.
- **不随便加空行**：语义连续的内容不要插空行断开，评审 / 周报里特别要紧凑。  
  Don't sprinkle blank lines between continuous content.
- **核心数据不用表格**：表格留给真正多列对照的内容；趋势 / 关键数字 / 结论用叙述。  
  Reserve tables for genuine multi-column comparisons; lead with narrative for key numbers.

## 视角与署名

- **弱化「我」**：写"研发"或"研发同学"代替"我"；自然第一人称段落里也用"我们"。  
  Soften first-person; use "研发" / "we" rather than "I".
- **跨研发边界的事写"和设计 / 产品一起做"**，不要让自己看起来在替别人做决策。  
  Cross-functional work: phrase as "和设计 / 产品一起", not as solo ownership.
- **"运营" 改 "产品"**：TikTok 直播这边对外通常说 PM / 产品而不是运营。  
  Use "产品" instead of "运营" in TikTok-live-facing writing.

## 风格 / Anti-AI

疆疆**强烈不喜欢 AI 风**。写完通读一遍专挑这些：

- **不堆专有名词**：技术名词、模型名、SDK 名能省就省，留必要的；不要为了"看起来专业"塞一堆。  
  Don't stack jargon for show.
- **不堆数字**：成果别拼成 "+47% / -32% / 3.2x" 这种密集数字带；选关键的、用句子说。  
  Avoid dense number lists; explain in sentences.
- **不空泛大词**："赋能 / 闭环 / 链路打通 / 端到端解决方案" 全删。  
  Cut buzzwords ("赋能", "闭环", "全链路", "解决方案").
- **不写得像 AI**：写完跑一遍 humanizer / antislop check（参考 `~/.claude/skills/humanizer/SKILL.md` 与 `~/.claude/skills/antislop/SKILL.md`）。  
  Run a humanizer pass before sharing.
- **不要"流水线 / 链路"这类抽象词**，需要时换成"端到端生产链路"或更具体的环节描述。  
  Replace "流水线" / "链路" with concrete pipeline stage names.

## 内容深度

- **结合 codebase 找真正的难点**，不要复述业务背景；技术分享 / 周报的价值在"我们具体踩了什么坑、怎么解的"。  
  Surface real engineering hard parts from the codebase; don't rehash business context.
- **核心概念全文只在一处深度展开**：第二次出现就引用 / 链接到第一次，不要重写定义。  
  Define a core concept once, cross-link afterward.
- **难点叙述 = 难点 + 结果**：说清遇到什么难、最后怎么解；不要把过程铺成流水账。  
  Hard-part bullets pair the obstacle with the outcome.

## 自我表达 / 元信息

- **不单列"我提的建议"或"为什么离不开我"**：贡献写在事情里，不另起章节当功劳簿。  
  Don't carve out a "my contributions" section; let work speak for itself.
- **不写"PRD 缺失 / PM 不到位 / 完整实录"** 这类元吐槽。  
  No meta-complaints about PRD / PM gaps; no "complete log" framing.
- **不写自己代码 bug 当卖点**："修了一个我之前埋的坑" 在对外文档里没必要展示，外人不需要知道。  
  Don't externalize self-introduced bugs as accomplishments.

## 公司内规

- **MQ / 任务队列等基础设施不写产品名**（BullMQ、Kafka、RabbitMQ 等）：公司有统一选型；外露具体技术名容易踩内部规范。说"队列 / 消息队列 / 后台 worker"即可。  
  Don't name third-party infra products (BullMQ, Kafka, etc.); the company has standard stacks. Say "queue" / "background worker" instead.

## 文档 vs 改代码

- **改 plan 文档** 和 **改代码逻辑** 是两件事，不要混。疆疆要"改 plan"时只动 markdown，不顺手改代码。  
  Plan-doc edits and code edits are separate operations; don't combine on a "update plan" instruction.

## 同步变更的轻量场景

- 不是所有变更都要写文档：内部 chat 里几句精简的话往往就够了，**疆疆明确说"不用写文档"时就别写**。  
  Not every change needs a doc; if 疆疆 says "no doc needed" then a chat-level summary is the deliverable.

## 大文档协作节奏

- **大文档按章节逐个推进**，不要一次性铺一篇大草稿。每章疆疆 review 完再开下一章。  
  Long docs: section by section with checkpoints, not one big drop.
- **草稿跑偏要回滚后整篇重看**，不要打补丁式修补。  
  If the draft drifts, revert and re-plan instead of patching.
- **同一 deliverable 持续迭代同一文档**：分享稿、调研、PRD 这种"一份成品"的产物，反复在原文上改；**不要**每改一版就开 `_v2.md` / `_v3.md` / `final.md` 把内容拆散。`[疆疆 added 2026-05-25 (cross-project)]`  
  Iterate on the same doc rather than spawning v2 / v3 files; one source of truth per deliverable.
- **大段调研 / 架构对比走独立 doc，不塞 plan**：实施 plan 文档保持轻量；把"为什么选 X 不选 Y"这种长篇调研拆到 `docs/research-*.md` 之类的独立文档，再在 plan 里链接。`[疆疆 added 2026-05-25 (cross-project)]`  
  Long research / architecture comparisons live in their own docs (e.g. `docs/research-*.md`); the plan only links to them.

## 给 leader 的变更说明

- **简短 + 书面 + 可汇报**：阶段性大改完成后压成几句话即可；不要长篇技术描述。  
  Stage summaries to leadership: a few sentences, written tone, easy to forward.

## 对外合作 / 询盘

`[疆疆 added 2026-05-25 (cross-project)]`

- **先 qualify 意图再给联系方式**：外部找上门时先问合作类型（投资 / 媒体 / 技术合作 / 招聘…）、规模、对接需求；问清楚再决定给哪位同事的邮箱 / 飞书。
- **不要默认给邮箱 / 群发**：直接公开邮箱 → 容易被钓鱼 / 营销轰炸；先在 chat / 平台里把意图聊清楚，必要时再点对点交换联系方式。

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
