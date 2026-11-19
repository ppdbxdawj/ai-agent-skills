# live_revenue_monorepo | monorepo 通用与 Taco 基础规则

Read this when working anywhere under `live_revenue_monorepo`.
- 直播间与营收 ReactLynx 包（中触、展馆、Live Goal、Pin 卡、`x-overlay-ng`、`lynx-rtl`、Starling ICU）请同时阅读专篇：[`tiktok-live-lynx.md`](tiktok-live-lynx.md)。
- Taco 端到端业务细则见 [`taco-webapp.md`](taco-webapp.md) 与 [`taco-gift-agent.md`](taco-gift-agent.md)。

## 基本结构

- 目录分层：`packages/apps/*`、`packages/libs/*`、`subspaces/*`（如 `subspaces/taco/apps/<app>`、`subspaces/tiktok_live_lynx/*`、`subspaces/live_goal/*`）。
- monorepo 工具：**rush / rushx**（严禁裸跑 npm / pnpm / yarn 装包或调脚本）。
- 远端：`<internal-gitlab-domain>`（GitLab），不是 GitHub。MR 走 GitLab UI 或 `internal-cli codebase mr`，不要用 `gh`。

## 部署 / 运行环境（服务端 & BFF）

代码**部署在远程多实例环境**，不是本机。`[疆疆 added 2026-05-25 (from history)]`

- 涉及存储 / 缓存 / 文件下载 / 进程间状态时，方案要**跨实例可用**：用 Redis、TOS、DB 等远程存储；不要假设"写到本地磁盘"或"读本机进程内变量"能被另一台实例的请求看到。
- 任何"我刚下载的图在 `/tmp/...`"这种思路都要警惕：另一台实例上根本没这个文件。

## 命令速查

| 用途 | Taco 包常用命令 | Sab / ReactLynx 包常用命令 |
|---|---|---|
| Lint（commit 前必跑） | `rushx _phase:lint` | `rushx lint`（或 `rushx verify`） |
| Typecheck | `rushx typecheck` | `rushx typecheck` / `rushx type-check` |
| Dev | `rushx dev` | `rushx start` / `rushx dev` |
| Build | `rushx _phase:build` | `rushx build` |
| 大屏适配检查（Lynx 必跑） | — | `node scripts/large-screen/check.cjs --base origin/master` |

注意：
- `rushx lint` 在 `taco_webapp` 未定义，要写 `rushx _phase:lint`。
- `rushx typecheck` 经常报 pre-existing 错误 — 详情见 [`pitfalls.md`](pitfalls.md#typecheck-pre-existing-错误)。

## `git refresh-branch` alias

全局 git alias，写在 `~/.gitconfig`，跨平台 / 跨仓库通用：`[疆疆 added 2026-05-25 (from history)]`

```bash
git refresh-branch
# 等价于：checkout master → fetch origin master → reset --hard origin/master
#         → 删除当前 feature 分支 → 用同名 checkout -b 重新切出
```

需要"切回 master、rebase、删除本地分支、再切出来同名分支"这一连串动作时**直接调它**，不要手敲那串命令。

## 服务间通信 / 地址规范（Taco）

`[疆疆 added 2026-05-25 (from history)]`

- **内部服务互调优先 BAM RPC，不留 HTTP 兜底**：Taco 各 app 之间走公司内部 BAM RPC（Kitex），不要为了"调试方便"保留一个 HTTP 路径并行跑；分叉的两套接口长期会漂移。
- **内部服务地址用真实前缀**：写 base URL 用 `https://<internal-service-domain>/...` 这类生产域名 prefix，不要 hardcode `http://localhost:3000`；不同环境要走配置 / KMS。
- **URL 归一化**：图片 / 资源链接遇到 `<mirror-cdn-domain>` 这类内部域名要归一化成 `<internal-cdn-domain>` 才能跨实例访问（与 [`taco-gift-agent.md` 图片处理规则](taco-gift-agent.md#图片--资源处理) 同源）。
- **Workflow / 长任务入口立刻返 ACK**：HTTP 路由不做下载 / 生成等长操作，先入队后台 worker 处理。详见 [`architecture-and-data.md`](architecture-and-data.md#队列--限流--跨实例状态)。

## 已生效规则

- `.cursor/rules/pre-commit-lint.mdc` 是 always-applied（详细要求见 SKILL.md §2「Lint 是 commit 前置」）。
- **`docs/` 目录不做 lint / prettier 检查** — 文档目录的 markdown 是"协调记录"性质，不要被 ESLint / Prettier 强制格式化卡住；写 ignore 规则时 `docs/` 默认排除。`[疆疆 added 2026-05-25 (from history)]`

## 内置 skill 入口（不要重复发明）

monorepo 内已有大量项目专用 skill，任务命中这些主题时**先看那些**：

- 仓库级 `.agents/skills/`：`sab-reactlynx3-workflow`、`i18n-on-demand`、`activity-standards`
- 仓库级 `.cursor/skills/`：`taco-regional-gift`、`taco-regional-gift-prompt`
- `subspaces/taco/.cursor/skills/`：`workflow-builder`、`post-coding-verify`、`testing-knowledge`、`storage-knowledge`、`kitex-knowledge`、`tcc-deploy`、`metrics-knowledge`、`overpass-knowledge` 等

### Skill 查找顺序（通用）

`[疆疆 added 2026-05-25 (cross-project)]`

接到任务想找 skill 时按这个顺序找，**不要只搜 workspace 子目录**：

1. **`~/.cursor/skills/`** — 全局个人 skill（`jiangjiang-coding`、`jiangjiang-project-dev` 等）
2. **项目 `.cursor/skills/` 与 `.agents/skills/`** — 当前 repo 的项目 skill
3. **其他用户级 skill 仓库** — `~/.claude/skills/`、`~/.agents/skills/`、`~/seedream-image-skill/<skill>/` 等

每一层都看一遍再说"没有相关 skill"。`[疆疆 added 2026-05-28]`

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
