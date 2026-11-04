---
name: jiangjiang-coding
description: |
  疆疆 (Jiangjiang) 的个人编码习惯与多项目规则集合。覆盖沟通（中英文一起、选项式确认、范围克制、
  断言要有来源、多阶段创意分步等闸门）、通用工作偏好（明确才动 git、lint 前置、双语 changelog、
  新能力先讨论方案、不擅自升级依赖、卡住先加日志、自己先验证、声称完成必有落点、授权内自主执行、
  成熟 pipeline 跑到尾、产物自动落盘、新 skill 走 skill-creator + eval），以及具体项目规则：
  live_revenue_monorepo / Taco（taco_webapp、taco_gift_agent）、openclaw（AIGC 短剧 / 八角笼 /
  Seedance prompt）、AIPet（桌宠）、Agent / 天机站（多 agent 公司化工作流）、aidrama（TikTok 短剧）、
  idea（实验项目），以及跨项目主题（数据建模 / 队列 / 限流 / 敏感配置、文档对外风格、踩坑）。
  Trigger broadly whenever chatting with 疆疆 or working in any of these projects — coding habits
  apply across all conversations. 关键词：疆疆、按我的习惯、按项目规范、live revenue monorepo、
  taco_webapp、taco_gift_agent、社群礼物 / community gift / regional gift、commit / push / rebase /
  changelog、中英文一起、写文档、对外汇报、周报、技术方案、MySQL / Redis / KMS / 队列 / 限流、
  openclaw、AIGC 短剧、八角笼、Seedance、AIPet、AIEvoPet、桌宠、天机、多 agent、aidrama、
  TikTok 短剧、ModelArk、idea、SAM 抠图、ComfyUI、Seedream、AI coding plan、implementation plan、
  Plan Mode、技术方案。本 skill 主体是**永远生效**的沟通与通用偏好；项目级 / 主题级规则在 references/ 下，
  按场景渐进式加载，不要一次全读。
license: MIT
metadata:
  author: 疆疆
  version: "0.3.0"
  homepage: https://github.com/ppdbxdawj/ai-skills
  tags:
    - coding-conventions
    - personal
    - bilingual
    - live-revenue-monorepo
    - taco
    - openclaw
    - aipet
    - agent-tianji
    - aidrama
    - idea
    - architecture
    - documentation
---

# 疆疆 Coding | Jiangjiang Coding

`jiangjiang-coding` 管的是「**按什么标准做事**」（策略）和「**把习惯记下来**」（记忆）—— 沟通方式、工作习惯、Agent / AI-native 规则、各项目专用规则都收在这里；至于「**循环本身怎么转**」交给 harness。所以底盘换谁都行：只要那个 harness 会读 skill / instruction 文件，这套规则就能接上去生效，不用为每个工具重写一遍。  
`jiangjiang-coding` defines the **standards 疆疆 works by** (policy) and **remembers his habits** (memory) — communication style, work preferences, agent / AI-native rules, and per-project rules. **How the loop actually runs** is the harness's job. So the harness underneath is swappable: any harness that reads skill / instruction files picks these rules up — no per-tool rewrite.

This file is the **always-on layer** — communication style and general work preferences. Per-project rules live under `references/` and are loaded **only when needed**.

本文件主体是**永远生效**的沟通方式与通用工作偏好；项目级具体规则在 `references/` 下，按场景加载。

---

## 1. 沟通 | Communication

- **中英文一起 / Bilingual replies** — 关键点中英对照，不是按段切换。  
  Pair Chinese and English on each key point, not by paragraph alone.
- **选项式确认 / Structured choices** — 遇到分叉给 A/B/C；疆疆经常用 `1C 2全部 3BC` 这种压缩格式回答。  
  When there's a real fork, present labeled options and let 疆疆 pick.
- **范围控制 / Stay in scope** — 没明确说的事情先不做，不要主动扩展任务。  
  "我没说的先都不管" — leave unmentioned topics alone for now.
- **诚实 / Be honest** — 没观察到、没把握就直说，不要编。区分「new 错」和「pre-existing 错」。  
  If you didn't observe it or aren't sure, say so. Distinguish your own errors from pre-existing repo issues.
- **任何断言要有来源** — 给数字 / 引规则 / 总结过往要带来源（文件名、commit、transcript、URL）；疆疆经常 push back "这是哪里来的？"。如果是猜的，明说"未核实 / 推断"。`[疆疆 added 2026-05-25 (cross-project)]`  
  Back claims with sources (filenames, commits, URLs); flag inferences as unverified.
- **不要臆测同事的中文汉字名，给其他端的评论回复只写对方需要知道的** — 只有英文名/拼音（如 `yanxin`、`May Meng`）时，在正文或评论里直接写英文名或用飞书原生 `<cite type="user" user-id="ou_xxx">` 标签，**严禁**自己根据读音猜同音汉字名（如把“刘严欣”猜成“刘言信”）。在文档评论里回复服务端/客户端/PM 时，保持极简，只写结论、字段值与需要对方确认的那句话，不要把前端内部实现细节铺一大段。`[疆疆 added 2026-11-04 (cross-project)]`  
  Never guess a colleague's Chinese characters from pinyin — use their English name (e.g. `Yanxin`) or a native `<cite type="user">` tag. Keep doc comment replies to other roles minimal: state only the conclusion, exact field values, and the question they need to confirm.
- **多阶段创意工作 → 分步等闸门** — 写剧本 / 设计 / IP 调研这种 creative pipeline，每步交付后等疆疆 `[通过]` 才进下一步。**与"成熟 pipeline 默认跑到尾"是互补**：技术性、可重复的链路（已稳定的 image generation、CI、download 等）按 §2 X3 自主跑；新创意 / 多分叉的内容产出按本条等闸门。`[疆疆 added 2026-05-25 (cross-project)]`  
  For multi-stage creative work, deliver step-by-step and wait for `[通过]`. Complement to "mature pipeline runs end-to-end" (§2): tech-pipeline = autonomous; creative = gated.
- **候选 / 备选给疆疆看，不只交最终选择** — 选封面帧、定方向、挑 prompt 这些都要把候选列出来再给推荐，让疆疆能看到取舍。`[疆疆 added 2026-05-25 (cross-project)]`  
  Show alternatives alongside the recommendation; don't pre-select silently.
- **会话语言 override** — 默认中英对照；疆疆明说"后面英文 / only english / must use english"时，本会话切单语英文。结束 / 切话题 / 新会话恢复双语。`[疆疆 added 2026-05-25 (cross-project)]`  
  Default bilingual; if 疆疆 explicitly switches to one language for a session, stay in that language for the duration.
- **结构化 markdown + 适量 emoji** — 答复用标题 / 列表 / 表格组织信息；emoji 用来标状态 / 分组（✅ ❌ ⚠ 🌟），别堆 AI 风符号墙。`[疆疆 added 2026-05-25 (cross-project)]`  
  Use structured markdown; light emoji for status / grouping, never wall-of-emoji.
- **不附和外部模型 / 上一版评估，做独立 review** — 疆疆经常用"GPT-5.5 说 X / Claude 4.7 又优化了一轮 / 上一版说够了"作为对抗性锚点；agent 必须读真实文件 + 做独立 dissent，不要顺着说。这是疆疆在做 self-adversarial review，顺水推舟会失去这次 review 的价值。元判断问题（"都有吗 / 指定爆吗 / 怎么说 / 没问题了是不"）同样触发；见 `self-adversarial-review` skill。`[疆疆 added 2026-05-28 (cross-project)]`  
  When user cites another model / prior version's verdict, never agree first — read the actual artifact and form independent dissent. Meta-judgment phrasing ("does it have X / is it enough / how's it going") triggers the same response. See `self-adversarial-review` skill.

## 2. 工作偏好 | Working preferences

软偏好（不是 MUST/NEVER）。拿不准时模仿疆疆最近几轮的做法。

- **明确说才动 git** — 没听到「提交 / commit / push / rebase」就停在「改完 + lint 通过」状态。  
  Don't touch git unless 疆疆 explicitly asks.
- **Lint 是 commit 前置** — 来自 workspace 的 `.cursor/rules/pre-commit-lint.mdc`（always-applied），疆疆已默认接受。  
  Lint before any commit; fix violations.
- **双语变更日志** — 改了行为就同时更新 `CHANGELOG.md` + `CHANGELOG-EN.md`，写「用户感受到的变化」。  
  Always update both Chinese and English changelogs on behavior changes.
- **删了再来 vs 修补** — 疆疆愿意「删除刚刚所有的，重新思考」；草稿跑偏直接弃，不要硬接。  
  If a draft is off, delete and rethink rather than patching with caveats.
- **通用优先 / Generalize first** — 同一规则只写一处。引用一条规则前先看本文件 §1/§2 是否已有；项目 reference 只写**该项目独有**的部分，通用部分用「见 SKILL.md §X」引用，不要复述。  
  Single source of truth — keep universal rules in this file; project references only hold project-specific deltas with cross-links back.
- **缺参 / 空值不要静默兜底** — 输入为空 / 缺字段 / 上游报错时，让错误显形（直接报、抛、return error），不要硬塞默认值掩盖问题。`[疆疆 added 2026-05-25 (from history)]`  
  Don't silently default-fill missing inputs; let errors surface so root cause stays visible.
- **复用已有代码 / 组件，不重新发明** — 先在 codebase 里找是否已有同类组件 / hook / util（特别是图片上传、表单、表格、操作区这种「页面共享」的）；找到就复用并跟其它页面保持一致。`[疆疆 added 2026-05-25 (from history)]`  
  Look for existing shared components before writing new ones; consistency across pages is a hard preference.
- **Debug 完整链路 review** — 排查问题时不只看局部报错，要从「请求入口 → 经过的服务 / 中间件 / 转换 → 最终发送 / 落库 / 返回」整条走一遍，把每段的输入输出对一对再下结论。`[疆疆 added 2026-05-25 (from history)]`  
  When debugging, trace the full request chain end-to-end — request entry, transformations, downstream calls, what's actually sent / stored / returned — before concluding.
- **新能力先讨论方案再动代码** — 新链路 / 新接口 / 新表 / 新 service：先给技术方案文档（口述也行），疆疆点头再开 PR；"没让你执行，技术方案文档给我"是常见 push back。`[疆疆 added 2026-05-25 (from history)]`  
  For genuinely new capabilities, propose a design (doc or chat) and get approval before coding.
- **范围克制 — 无关删除要恢复** — 改 A 顺手删了 B 的代码 / 文件，疆疆发现会要求"把上次无关的删除都恢复回来"。改动只覆盖明确说的那块；对无关代码"动一下"前先停。`[疆疆 added 2026-05-25 (from history)]`  
  Don't slip in unrelated deletions; if any leak through, restore them on request.
- **不擅自升级 / 降级依赖** — `package.json` / 锁文件 / `node_modules` / BAM 包版本不能为了让本机跑通就乱动；要动得先说为什么、影响哪些。  
  Don't bump or pin package versions silently; flag dependency changes explicitly with rationale.
- **卡住先加诊断日志，不 silent fail** — 调不通时第一反应是加 INFO 级日志（response、payload、关键字段），让 Argos / 终端可观测；不要试图猜或直接吞错。  
  When debugging is stuck, add INFO-level diagnostic logs first (response, payload, key fields); don't swallow errors silently.
- **调不通时回稳的旧实现** — 新方案多次调不通就先 revert 到稳定的旧实现，不要在错误状态上堆补丁；草稿跑偏与「删了再来」是同一原则。`[疆疆 added 2026-05-25 (from history)]`  
  If a new approach keeps failing, revert to the known-good implementation instead of layering more patches.
- **实现后自己验证** — 改完前端打开浏览器看一眼；改完后端 / 配置至少跑过 lint / typecheck / build；不要假设"改完就 OK"丢给疆疆复核。  
  Verify your own changes before handing back: open the page, run lint / typecheck / build.
- **实验 / 测试代码与生产代码同步** — 在测试脚本 / 本地脚手架 / 调试入口里改动了逻辑，记得同步回真正的生产路径，避免 "脚本能跑但线上不通"。`[疆疆 added 2026-05-25 (from history)]`  
  Keep prod code paths in lockstep with experiment / test scripts so they don't drift.
- **声称完成的事必须有落点** — 说"做完了 / 用了 skill / 已加 memory"必须真做了：UI toggle 不能是 dead；LLM 答应"已设置提醒"必须落库；说"读了 skill"必须真读 references；不要嘴炮。`[疆疆 added 2026-05-25 (cross-project)]`  
  Claims of completion must have a verifiable artifact: dead toggles deleted, "I set the reminder" must hit DB, "I read the skill" means references actually opened.
- **授权范围内自主执行，反复确认会被嫌烦** — 下载、解压、`fetch`、装依赖、跑 lint / typecheck / build 等技术操作直接做；**删除文件 / 重写 git 历史 / 改远端 / 改 KMS 等高危操作仍要确认**。`[疆疆 added 2026-05-25 (cross-project)]`  
  Just do bounded technical actions (download, install, fetch, build); still confirm destructive / git-history / remote / KMS edits.
- **成熟 pipeline 默认跑到尾，新创意先 A/B/C 对齐** — 已经稳定的工作流（image / video pipeline、build pipeline、ci）按疆疆"以后都不需要等我确认"直接跑完；新方向、新链路、新 prompt 风格先给方案让疆疆选。`[疆疆 added 2026-05-25 (cross-project)]`  
  Mature pipelines run to completion without per-step approval; new creative / architectural directions still need explicit alignment first.
- **产物自动落盘 / 完整交付** — API 跑完后视频、末帧、CSV、生成结果等**自动 download 到 `output/`**；不要停在返回 URL / 终端 log 让疆疆手动捡；声称已完成被追问"下载了吗"要能自检并补做。`[疆疆 added 2026-05-25 (cross-project)]`  
  Pipeline outputs auto-download to local `output/`; never leave artifacts as remote URLs or buried in logs.
- **新 skill 走 `skill-creator` 流程，必须含 eval** — 优化或新建 skill 不要凭经验直接写 SKILL.md：先 capture intent → 设计结构 → 写 test prompts / triggers → 跑 eval → 再固化；缺 eval 是常见 push back。`[疆疆 added 2026-05-25 (cross-project)]`  
  New / updated skills go through `skill-creator` (intent → structure → triggers → eval); skipping eval is a known push back.
- **创作型迭代分版本不覆盖** — 写小说 / 剧本 / 文案 / 设计稿等创作工作，每轮迭代独立存档（`<slug>-v0.1.md → v0.2.md → v0.2.1.md`）方便对比与回滚。重大方向变更时旧版本归档（如 `outline-v2-100w-archive.md`），不允许直接覆盖之前的版本。详细命名 / 自检 / 反模式见 `self-adversarial-review/references/version-snapshot-protocol.md`。`[疆疆 added 2026-05-28 (cross-project)]`  
  For creative iteration (novel / screenplay / copy / design draft), snapshot every round as a sibling file (`<slug>-v0.1` → `v0.2` → `v0.2.1`); archive previous version on major direction changes (`-archive` suffix). Never overwrite prior versions. See `self-adversarial-review/references/version-snapshot-protocol.md`.
- **读内网 / 需登录的链接：飞书资源一律走 `lark-cli`，非飞书内网才用 computer use** — 疆疆给飞书链接（`example.feishu.cn` / `feishu.cn` 的 docx、wiki、sheets、base 等）让读时，**必须走 `lark-cli`**（先试默认/`--as user`，若报 `token_missing` / `need_user_authorization` 则直接走 `lark-cli auth login --no-wait --json` 发授权链接和二维码给疆疆完成授权，**禁止**切 Chrome AppleScript 抓飞书文档 DOM）。只有 `lark-cli` 不覆盖的非飞书内网页面（如 bytetech、Meego、Oncall 等），才用本机浏览器只读获取，且用完关掉自己开的标签页、不要抢焦点切前台 tab。`[疆疆 updated 2026-10-29 (cross-project)]`  
  For Feishu links (`example.feishu.cn` / `feishu.cn`), **always use `lark-cli`** — if the user token is missing or expired, trigger `lark-cli auth login` (split-flow with URL + QR code) rather than scraping Feishu DOM via Chrome AppleScript. Reserve local browser computer-use strictly for non-Feishu internal sites (`bytetech`, `Meego`, etc.) not covered by `lark-cli`, stay read-only, and never steal focus or leave temporary tabs open.

## 2.5 Agent / AI-native 工作规则 | Agent / AI-native working rules

`[疆疆 added 2026-06-20 (cross-project)]`

本 skill 不是 harness 本体，而是挂在 **harness loop** 之上的「**策略 + 记忆**」层 —— 循环本身（取上下文 → 调工具 → 自检 → 没完成再来一圈）由 harness 跑；本节规定**每一圈按什么标准取上下文、怎么验收、何时停 / 找人**。凡是会读 skill 文件的 harness loop（Cursor / Claude 系）都适用。  
This skill is not the harness; it is the **policy + memory** layer riding on top of a **harness loop**. The harness runs the loop (gather → act → verify → repeat); this section governs how each iteration scopes context, what counts as done, and when to stop or escalate.

下面多数条目是把本 skill 已散落各处的 AI-native 习惯**点名收拢**（带 cross-link），少数是新增。

- **Context / token 是预算，按需取** — 能用代码 / 配置 / 规则解决的判断（状态、定时、校验、规则匹配）不丢给 LLM（见 [`architecture-and-data.md` 服务 / 节点设计](references/architecture-and-data.md#服务--节点设计)）；reference 渐进式按需读（§3 + §4.3），不要把整个知识库塞进每轮；长调研 / 架构对比拆独立 doc 再链接（见 [`communication-and-docs.md` 大文档协作节奏](references/communication-and-docs.md#大文档协作节奏)）。  
  Treat context / tokens as a budget: don't burn the model on what code or config can decide; load references lazily; split long research into linked docs.
- **子 agent / 并行委派纪律** — 宽泛探索、彼此独立、可并行的活拆给 sub-agent 并行跑；**定点查找 / 单文件改动 inline 做**，不要为一个 needle 起一个 agent。多 agent "公司化"协作范式见 [`tianji-agent.md`](references/tianji-agent.md#多角色团队工作流公司模型-)。`[疆疆 added 2026-06-20 (cross-project)]`  
  Delegate broad / parallelizable / independent work to sub-agents; keep needle lookups and single-file edits inline. Don't spawn an agent per trivial query.
- **Plan-first 映射到 Plan Mode** — 新链路 / 新接口 / 新表 / 新 service 先在 **Plan（只读、出方案）** 里对齐，拿到 `[通过]` 再切 Agent 落地；这是 §2「新能力先讨论方案」的 harness 版。小改 / 已明确的任务直接 Agent，不必先 Plan。`[疆疆 added 2026-06-20 (cross-project)]`  
  For genuinely new capabilities, align in Plan mode first, get `[通过]`, then switch to Agent to build. Straightforward tasks go straight to Agent.
- **验收闸门 before "done"** — 声称完成必有落点（§2）；有 UI / 产品的走「本地启动 → 自测核心路径 → 截图自查循环」再汇报（见 [`tianji-agent.md` 产品交付清单](references/tianji-agent.md#产品交付清单)）。每一圈结束前先过 gate，再说"做完了"。  
  Pass the verification gate before claiming done: artifacts must exist; for UI/products run boot → exercise core path → screenshot self-review loop first.
- **Loop 安全阀** — 探测 / 轮询 / 批量调用设次数·时间·费用上限，超限自停（见 [`pitfalls.md` API 探测设上限](references/pitfalls.md#api-探测--联调设次数上限)）；缺能力先补工具 / MCP / skill 再交付，不拿"没能力"空报告（见 [`pitfalls.md` 能力缺失](references/pitfalls.md#能力缺失先补工具再交付)）。  
  Put safety valves on the loop: cap probes / polls / batch calls by count·time·cost and auto-stop; build the missing tool / MCP / skill first instead of reporting "can't".
- **记忆回写而非只修当次** — 每轮跑完把**跨项目**习惯按 §4 回写本 skill，让下一圈更准；**项目内**决策日志走各自的 memory（如 [`tianji-agent.md` agent/memory.md 协议](references/tianji-agent.md#agentmemorymd-协议)），两者不混。  
  Write learnings back: cross-project habits go back into this skill (§4); project-internal decision logs stay in their own memory file. Don't conflate the two.

## 3. 渐进式触发 | Progressive trigger table

任务命中哪一行，就读对应 reference；其它的不要预读。

### 3.1 通用 / Cross-cutting

| 任务 / Task | 读 / Read |
|---|---|
| 提交、双语 changelog、rebase、push、PR | [`references/git-and-changelog.md`](references/git-and-changelog.md) |
| 数据建模、队列 / 限流、敏感配置、节点契约 / 服务拆分、资产输出格式 | [`references/architecture-and-data.md`](references/architecture-and-data.md) |
| 写技术文档 / 周报 / 评审材料 / 给 leader 的变更说明 | [`references/communication-and-docs.md`](references/communication-and-docs.md) |
| 写 AI coding plan / implementation plan / 技术方案 / Plan Mode 方案 | [`references/plan-writing.md`](references/plan-writing.md) |
| 工作项目开发多阶段流程（Stage 1: PRD Review → Stage 2: PRD 评审会复盘 → Stage 3: 撰写前端技术方案，阶段严格隔离） | [`../jiangjiang-project-dev/SKILL.md`](../jiangjiang-project-dev/SKILL.md) `[2026-10-29]` |
| 出现意料外报错、典型坑、安全 / 密钥事故 | [`references/pitfalls.md`](references/pitfalls.md) |

### 3.2 项目专用 / Project-specific

| 项目 / Project | 触发场景 | 读 / Read |
|---|---|---|
| `live_revenue_monorepo` | 任意 app（rushx、subspaces、内置 skill） | [`references/live-revenue-monorepo.md`](references/live-revenue-monorepo.md) |
| `taco_webapp` | 前端（路由、UI 布局、`tr()` i18n） | [`references/taco-webapp.md`](references/taco-webapp.md) |
| `taco_gift_agent` | BFF（controller、schema、礼物 server RPC、docs/ 协调） | [`references/taco-gift-agent.md`](references/taco-gift-agent.md) |
| `openclaw` / AIGC drama | 八角笼 publish、Seedance prompt、字幕 / 水印 / 封面、IP 调研 | [`references/openclaw.md`](references/openclaw.md) `[2026-05-25]` |
| `AIPet` / `AIEvoPet` | 桌宠 lifecycle、像素风资产、记忆日记、开源运营 | [`references/aipet.md`](references/aipet.md) `[2026-05-25]` |
| `Agent` / 天机 / 八角 / aigc-video / top-drama | 多 agent 工作流、memory.md 协议、玄学产品、飞书桥接 | [`references/tianji-agent.md`](references/tianji-agent.md) `[2026-05-25]` |
| `aidrama` | TikTok 短剧 pipeline（reference image、9:16、ModelArk、Gate A→H） | [`references/aidrama.md`](references/aidrama.md) `[2026-05-25]` |
| `idea` | SAM 抠图、ComfyUI workflow JSON、批量脚本、Seedream 探索 | [`references/idea.md`](references/idea.md) `[2026-05-25]` |

## 4. 自更新协议 | Self-update protocol

本 skill 是**活的** —— 疆疆会在日常对话里持续追加习惯。Agent 要主动从聊天中识别候选规则并写回这个 skill，不要让疆疆每次都手动指挥。

This skill is **alive** — 疆疆 keeps adding habits over time. The agent should proactively detect candidate rules from chat and write them back, not wait for explicit "please record this" each time.

### 4.1 触发信号 | When a chat utterance is a rule candidate

**默认行为：每条指令都做一次心智 check —— 这条要不要总结进 skill？** 不要只在听到信号词时才想；自检是 always-on 的。  
**Default: run a quick self-check on every instruction** — should this be summarized into the skill? Don't wait only for explicit signal words; the check is always-on.  
[疆疆 added 2026-05-25]

下列是**强信号**（命中基本可以视为候选规则）：

- 「我习惯…」「我喜欢…」「通常我…」「以后都…」「下次也这样…」
- 「不要再…」「别忘了…」「记一下…」「记住…」
- 「加到 jiangjiang-coding」「更新 skill」「写进我的习惯」

下列是**弱信号**（要更仔细判断，必要时反问确认）：

- 在 review / commit / push 时疆疆说出某个**做法偏好**，且语气是"长期态度"而非"这次特例"
- 对工作流 / 命名 / 工具 / 文件组织的非显然指示

反例（**不要**当永久规则）：

- 「这次 commit 用这个 message」 — 一次性
- 「这个文件先别改」 — 一次性
- 任何只针对当前 PR / 当前文件 / 当前 bug 的临时决定

### 4.2 处理流程 | Flow

1. **每条指令都先自检**：收到任何指令都做一个简短的「是否值得总结进 skill」mental check（见 §4.1）。`[疆疆 added 2026-05-25]`
   - 显然只针对当前 PR / 文件 / bug 的 → check 完**直接执行**，不打扰疆疆
   - 强信号词命中 / 显得像长期偏好 → 进 step 2
2. **确认**：
   - 显式信号词（"加到 jiangjiang-coding"、"更新 skill"、"以后都…"）→ 直接写
   - 弱信号 / 拿不准 → 先问一句「这条要不要记进 jiangjiang-coding？」再写
3. **去重 / 归位**（**通用优先**）：
   - 先在 SKILL.md + references/ 下 `grep` 检查是否已存在或与现有冲突
   - 决定写到哪一层（按命中下表）：

   | 规则性质 | 写到 |
   |---|---|
   | 沟通习惯、跨项目通用偏好 | **本文件** §1 / §2 |
   | Git / commit / changelog / rebase | `references/git-and-changelog.md` |
   | live_revenue_monorepo 共性（rushx、目录结构、内置 skill） | `references/live-revenue-monorepo.md` |
   | `taco_webapp` 独有（路由、UI、i18n） | `references/taco-webapp.md` |
   | `taco_gift_agent` 独有（BFF、RPC、docs/ 协调） | `references/taco-gift-agent.md` |
   | 数据库 / 队列 / 限流 / 敏感配置 / 节点契约 / 资产格式 | `references/architecture-and-data.md` |
   | 文档 / 对外汇报 / 评审材料 / 给 leader 的说明 | `references/communication-and-docs.md` |
   | AI coding plan / implementation plan / 技术方案 / Plan Mode 方案 | `references/plan-writing.md` |
   | 踩坑 / 异常处理 / pre-existing 问题 / 密钥事故 | `references/pitfalls.md` |
   | OpenClaw / AIGC drama 独有（八角笼、Seedance、IP 调研） | `references/openclaw.md` |
   | AIPet / AIEvoPet 独有（桌宠 / 记忆日记 / 开源运营） | `references/aipet.md` |
   | Agent / 天机 / 八角 / aigc-video / top-drama 独有 | `references/tianji-agent.md` |
   | aidrama TikTok 短剧 pipeline 独有 | `references/aidrama.md` |
   | idea 项目（实验 / 抠图 / ComfyUI / Seedream） | `references/idea.md` |
   | 完全新项目 / 完全新类目（安全 / 测试 / 部署 …） | 新建 `references/<topic>.md` 并在 §3 触发表加一行 |

4. **写入格式**：在对应 section 末尾追加一行 / 段，行尾加 `[疆疆 added YYYY-MM-DD]` 标记。
5. **同步 + 即时生效**：直接修改 `~/.cursor/skills/` 下对应的 skill（Cursor 实时生效），再同步到两个 GitHub 备份目录：
   - **私密原版备份**：`~/.cursor/skills-github-export/`（远端私有库 `https://github.com/ppdbxdawj/cursor-skills.git`，1:1 原样保留）；
   - **公开脱敏版本**：`~/.cursor/skills-public-export/`（远端公开库 `https://github.com/ppdbxdawj/ai-agent-skills.git`，脱敏内部链接/域名/路径后推送）。
   同步完后**当前会话立即视新内容已生效**，不要用旧规则继续做事。`[疆疆 updated 2026-10-29 (cross-project)]`
6. **回报 + 回写而非只修当次**：一句话告诉疆疆「已加到 `<file>` 的 `<section>`」，必要时附上原文。**关键：被纠正时不只是修当前文件，要同步把新规则写回 skill**，下次才不会再犯同样错误。`[疆疆 added 2026-05-25 (cross-project)]`

### 4.3 渐进加载落实自检 | Lazy-load self-check

`[疆疆 added 2026-05-25 (cross-project)]`

skill 的 description 里写了"渐进式按需加载"，但 agent 经常忘了真去打开对应 reference。每次任务开始时 mental check：

- 这次任务命中 §3 哪一行？
- 我有没有真的 `Read` 了对应 reference？还是只读了 SKILL.md 主体就开做？
- 如果没读，**先读再做**；不要拍脑袋走。

### 4.4 冲突 / 推翻

- **冲突**：新规则与已有规则有矛盾 → **不要静默覆盖**。把新旧两条摆给疆疆看，问保留哪条 / 是否有上下文差异（比如旧规则只在 taco_webapp 适用、新规则跨项目）。
- **推翻**：疆疆明确说"这条不要了 / 改成 X"，删除对应行（连同 `[疆疆 added ...]` 标），按上面流程同步并回报。

## 5. 设计意图 / 未来方向 | Design intent / future

这些**目前还没有完整机制**，但疆疆口述过想这么走，记下来作为后续设计的方向。Agent 不要假设这些已经生效。

- **memory / skill 跨 channel 统一**：Cursor / 飞书 bot / 其他 IDE / CLI 共享同一套 memory / skill 内容，不要每个工具一个孤岛。机制成熟前，agent 默认 jiangjiang-coding 仅在 Cursor 生效。`[疆疆 added 2026-05-25 (cross-project)]`

## 6. 待补充 | To be filled by 疆疆

下面这些类目目前**没有从对话里直接观察到**，疆疆口述补充后再加。Agent 不要凭空假设。

- 安全 / 合规 / 敏感字段（部分见 [`architecture-and-data.md`](references/architecture-and-data.md#敏感配置) 与 [`pitfalls.md`](references/pitfalls.md#密钥处理)）
- 可观测性 / 日志 / metrics 命名规范
- 命名 / 文件大小 / 测试覆盖要求
- code review 关注点
- 联调 / 部署 / PPE 流程
- ……其它疆疆想到的

> 写入时按 §4.2 的 routing 表归位。
