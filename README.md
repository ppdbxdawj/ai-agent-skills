# AI Agent Skills | 多端通用 Agent 技能库

A tool-neutral collection of reusable AI Agent skills (following the standard `SKILL.md` + `references/` + `evals/` specification), compatible with **Cursor**, **Claude Code**, **OpenAI Codex**, **OpenCode**, and **OpenClaw**.

一套跨工具通用的 AI Agent 技能集合（遵循标准 `SKILL.md` + `references/` + `evals/` 规范），支持 **Cursor**、**Claude Code**、**OpenAI Codex**、**OpenCode** 与 **OpenClaw** 等主流 Agent 环境。

---

## 目录与技能清单 | Skill Catalog

### 1. 研发工程与工作流 | Engineering & Dev Workflows

| Skill | 说明 / Description |
|---|---|
| [`jiangjiang-coding`](./jiangjiang-coding) | 个人编码习惯、AI-native 工作流策略、架构与数据规范、AI Coding Plan 编写模板与常见工程避坑指南。<br>Personal coding conventions, AI-native harness policies, architecture/data rules, implementation plan templates, and engineering pitfalls. |
| [`jiangjiang-project-dev`](./jiangjiang-project-dev) | 严格按阶段隔离（Stage-gated）的研发项目全流程工作流：覆盖 **Stage 1（PRD Review 需求评审与代码摸底）**、**Stage 2（PRD 评审会复盘与方案更新）** 与 **Stage 3（撰写前端技术方案 + AI Plan 双产物）**。<br>Stage-gated R&D workflow covering Stage 1 (PRD Review), Stage 2 (Post-Review Meeting Sync), and Stage 3 (Human-facing Tech Design + AI Implementation Plan dual deliverables). |
| [`rd-doc-writing`](./rd-doc-writing) | 研发工程师文档方法论：覆盖技术方案、SOP、调研文档、项目复盘、技术分享与晋升答辩文档的推导与排版。<br>R&D engineering documentation guide covering technical design docs, SOPs, research write-ups, and architecture reviews. |
| [`technical-doc-writing`](./technical-doc-writing) | 金字塔原理、观点化标题与结构化业务/技术/双周报/关键决策文档写作规范。<br>Pyramid principle, opinionated headings, and structured technical/business/decision document writing. |
| [`three-key-doc-writing`](./three-key-doc-writing) | 面向读者的极简文档三关键（用户思维补齐信息差、F 型结构化阅读、删繁就简说大白话）。<br>Reader-oriented documentation focusing on closing information gaps, F-shaped scanability, and concise plain language. |
| [`neat-freak`](./neat-freak) | 研发阶段收尾时的文档与 Agent 记忆对齐清理工具，确保 `README.md`、`CLAUDE.md`/`AGENTS.md` 与真实代码零漂移。<br>End-of-session knowledge cleanup that reconciles project docs and agent memory against the actual codebase. |
| [`storage-analyzer`](./storage-analyzer) | macOS / Windows 只读磁盘空间扫描与三级清理建议报告生成工具。<br>Read-only disk space analyzer and interactive HTML cleanup report generator for macOS and Windows. |
| [`find-skills`](./find-skills) | Agent 技能检索、发现与安装指引。<br>Discover and install agent skills from open ecosystems. |

### 2. 多模态 AIGC 与内容创作 | Multimodal AIGC & Creative Production

| Skill | 说明 / Description |
|---|---|
| [`seedream-image`](./seedream-image) | 即梦 Seedream 5.0 / 4.0 高质量提示词生成与 Ark API 生图（文生图、多图融合、角色一致性、海报/知识卡片）。<br>High-quality prompt engineering and image generation via Seedream 5.0/4.0 (text-to-image, multi-image fusion, character consistency). |
| [`seedance-video`](./seedance-video) | 即梦 Seedance 2.0 图生视频（r2v）、首尾帧生视频（i2v）、文生视频（t2v）、分镜排程与连续帧串联脚本。<br>Seedance 2.0 video generation workflow supporting reference-to-video (r2v), first/last frame (i2v), and multi-segment continuity chaining. |
| [`vibe-creating-prompt`](./vibe-creating-prompt) | 情绪化画面与多镜头描述的 Vibe Creating 视频提示词提纯器。<br>Distills emotional/multi-shot visual concepts into Vibe Creating video prompts while preserving hard constraints. |
| [`novel-to-storyboard`](./novel-to-storyboard) | 从小说原文提取角色/场景/道具资产，切分剧本并产出半秒级 Seedance 分镜提示词。<br>Extracts character/scene/prop assets from fiction and generates half-second granularity Seedance storyboards. |
| [`screenwriting-master`](./screenwriting-master) | 覆盖 1–3 分钟概念超短片、5–10 分钟叙事短片、90 分钟电影长片与多集剧集的全格式编剧方法论。<br>Full-format screenwriting methodology covering ultra-short concepts, narrative shorts, feature films, and multi-episode series. |
| [`story-structure-ip`](./story-structure-ip) | IP 角色故事五问体检表、六大故事结构（三幕、救猫咪、Harmon 8 步圆环等）与拉片分析框架。<br>IP story diagnostics ("Five Questions"), six classic story structures (Save the Cat, Harmon Story Circle, etc.), and shot-by-shot analysis. |
| [`self-adversarial-review`](./self-adversarial-review) | 创作与设计迭代中的自对抗审阅协议，打破模型顺从惯性，强制分维度找真差距与多版本快照归档。<br>Self-adversarial review protocol that breaks model approval inertia through dimension-by-dimension gap analysis and version snapshots. |
| [`khazix-writer`](./khazix-writer) | 深度科技公众号长文叙事与排版方法论。<br>Long-form tech article writing and narrative structuring. |
| [`aihot`](./aihot) | 中文 AI 每日资讯与论文/模型/行业动态简报查询。<br>Daily Chinese AI news, model releases, and paper digest fetcher. |

---

## 安装与使用 | Installation & Usage

将所需技能目录复制到对应工具的全局或项目级 `skills` 目录下即可自动生效：

Copy any skill folder into your agent tool's global or workspace `skills` directory:

```bash
# Clone the repository
git clone https://github.com/ppdbxdawj/ai-agent-skills.git

# Install into Cursor global skills (~/.cursor/skills/)
cp -r ai-agent-skills/<skill-name> ~/.cursor/skills/

# Or install into Claude Code /通用 .agents skills (~/.agents/skills/)
cp -r ai-agent-skills/<skill-name> ~/.agents/skills/
```

---

## 许可证 | License

[MIT License](./LICENSE)
