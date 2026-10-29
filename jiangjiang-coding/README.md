# 疆疆 Coding Skill

[English](#english) | [中文](#中文)

---

<a id="english"></a>

## English

A personal agent skill capturing 疆疆's coding habits and project rules. Designed to trigger broadly in chat and load project rules **progressively** — only the relevant reference is read for each task.

### Layout

```
jiangjiang-coding/
├── SKILL.md                              # always-on: communication + work preferences + trigger table
├── README.md
└── references/
    # cross-cutting
    ├── git-and-changelog.md              # commit, bilingual changelog, rebase, push
    ├── architecture-and-data.md          # MySQL/TEXT, Redis queues, KMS, atomic services, CSV format
    ├── communication-and-docs.md         # heading style, anti-AI tone, doc cadence, external pitch
    ├── plan-writing.md                   # AI coding plan / implementation plan / Plan Mode template
    ├── pitfalls.md                       # commitlint, retry path, secrets in .env, scope-before-share
    # project-specific
    ├── live-revenue-monorepo.md          # rushx, subspaces, internal RPC, deploy env, skill lookup order
    ├── taco-webapp.md                    # routes, UI preferences, tr() i18n
    ├── taco-gift-agent.md                # BFF, RPC coordination via docs/, LLM call conventions
    ├── openclaw.md                       # AIGC drama: 八角笼, Seedance prompts, 字幕/水印, IP 调研
    ├── aipet.md                          # AIEvoPet desktop pet: lifecycle, memory, pixel art, OSS
    ├── tianji-agent.md                   # Multi-agent company workflow, agent/memory.md, 玄学 product
    ├── aidrama.md                        # TikTok short drama: reference image, 9:16, ModelArk, Gate A→H
    └── idea.md                           # experiments: SAM, ComfyUI, transparent video, batch scripts
```

### Install

```bash
npx skills add ppdbxdawj/ai-skills@jiangjiang-coding
```

Manual (Cursor):

```bash
git clone https://github.com/ppdbxdawj/ai-skills.git
cp -r ai-skills/jiangjiang-coding ~/.cursor/skills/
```

### How to extend

每份文件最末有 `## 待补充` 区块。直接告诉 agent「把这条加到 jiangjiang-coding 的 X 部分」，agent 会归位到对应文件并打 `[疆疆 added <date>]` 标记。

---

<a id="中文"></a>

## 中文

记录疆疆个人编码习惯与项目规则的 agent skill。设计为聊天中广泛触发，项目规则**渐进式**加载 —— 每次只读与当前任务相关的那一份 reference。

### 文件结构

```
jiangjiang-coding/
├── SKILL.md                              # 永远生效：沟通 + 工作偏好 + 触发表
├── README.md
└── references/
    # 通用
    ├── git-and-changelog.md              # 提交、双语 changelog、rebase、推送
    ├── architecture-and-data.md          # MySQL TEXT、Redis 队列、KMS、原子化、CSV 资产格式
    ├── communication-and-docs.md         # 标题排版、反 AI 风、文档节奏、对外合作 qualify
    ├── plan-writing.md                   # AI coding plan / implementation plan / Plan Mode 模板
    ├── pitfalls.md                       # commitlint、retry 链路、密钥 .env、开源前扫描
    # 项目专用
    ├── live-revenue-monorepo.md          # rushx、subspaces、内部 RPC、远端部署、skill 查找顺序
    ├── taco-webapp.md                    # 路由、UI 偏好、tr() 国际化
    ├── taco-gift-agent.md                # BFF、礼物 server 协调、LLM 调用、分步落库
    ├── openclaw.md                       # AIGC 短剧：八角笼、Seedance prompt、字幕水印、IP 调研
    ├── aipet.md                          # AIEvoPet 桌宠：lifecycle、记忆日记、像素风、开源
    ├── tianji-agent.md                   # 多 agent 公司化工作流、agent/memory.md、玄学产品
    ├── aidrama.md                        # TikTok 短剧：参考图模式、9:16、ModelArk、Gate A→H
    └── idea.md                           # 实验项目：SAM 抠图、ComfyUI、透明视频、批量脚本
```

### 安装

```bash
npx skills add ppdbxdawj/ai-skills@jiangjiang-coding
```

手动（Cursor）：

```bash
git clone https://github.com/ppdbxdawj/ai-skills.git
cp -r ai-skills/jiangjiang-coding ~/.cursor/skills/
```

### 扩展方式

每份文件末尾有 `## 待补充` 区块。直接告诉 agent「把 X 加到 jiangjiang-coding 的 Y 部分」，agent 会归位并标 `[疆疆 added <date>]`。
