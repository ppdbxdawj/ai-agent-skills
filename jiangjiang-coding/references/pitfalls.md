# 踩过的坑 | Pitfalls

Read this when something behaves unexpectedly, **before** assuming it's your bug.

## Typecheck pre-existing 错误

`rushx _phase:lint` 通过 **≠** `rushx typecheck` 通过。typecheck 经常爆 pre-existing 的 `@taco/idl`、`@tiktok-fe/taco-ai-prompt`、`react-hook-form` 等 import 缺失。**这些不是当前改动引入的**；如实告诉疆疆，别试图全部修。

> Lint 命令本身见 [`live-revenue-monorepo.md`](live-revenue-monorepo.md#命令速查)。

## Vite dev 启动失败

`rushx dev` 报 `Failed to resolve entry for package "@tiktok-fe/taco-ai-prompt"` 这类，是仓库依赖解析问题，通常**不是 UI 任务能直接修**的。告诉疆疆，跳过 live preview，靠 lint + screenshot review 走流程。

## 列表 total 是分页下界

后端社群礼物 list 接口返回的 `total` 是**分页下界**（"还有更多"信号），不是 `COUNT(*)`。所以：

- 前端不要把 `total` 当真实条数展示。
- 不要加 quick jumper。
- 跨页筛选要在服务端做，不要在前端按已加载的页过滤。

## RPC 字段被悄悄移除

部分礼物 server RPC 字段会被移除（例如 community gift 的 `HasPermission`），前端逻辑要靠**用户是否出现在 RPC 响应**来判断状态，而不是某个字段。改字段判断逻辑前先确认 IDL 当前形态。

## Commitlint 曾 reject body 超长

提醒：曾经因为 body 单行超长被 reject。完整规则与 HEREDOC 模板见 [`git-and-changelog.md`](git-and-changelog.md#commit-message)。

## 主链路通了 ≠ retry 链路通

`[疆疆 added 2026-05-25 (from history)]`

排查问题时，**主链路 + retry 链路要分别 review 一遍**。Magic Gift / Community Gift 这类有"失败重试"分支的 pipeline 经常出现：主流程改了字段名 / 新加了步骤，retry 路径没同步；表面看主链路 OK，retry 一触发就崩。修主链路时同步检查 retry 入口（通常在同一文件下面或 `*-retry.ts` / `retry/` 目录里）。

## 排查时主动多打日志

`[疆疆 added 2026-05-25 (from history)]`

调不通 / 行为不符合预期时**第一动作是加日志**，不是猜：

- 把上游 / 下游 response 整体 stringify 打出来（脱敏后）
- payload 的关键字段单独标注（"前 / 后"）
- 透传 `X-TT-LOGID` 让 Argos 串得起来（见 [`taco-gift-agent.md` AI 模型调用](taco-gift-agent.md#ai-模型调用--llm-call-conventions)）

完整原则见 SKILL.md §2「卡住先加诊断日志」。

## 密钥处理 | Secrets & credentials

`[疆疆 added 2026-05-25 (cross-project)]`

- **密钥 / API key / token 一律放本地 `.env`**（必须在 `.gitignore` 里）；代码 / 提交 / log / chat 里**绝不暴露**。
- **模板是 `.env.example`**：列出需要的字段名 + 注释说明，**字段值留空**让疆疆自己填；不要预填 placeholder（"YOUR_KEY_HERE"），更不要复制别处看到的真值。
- **commit 前最后一次 `git diff` 自检**有没有手滑加了 `.env` / 含 token 的配置文件；中招过一次就是事故。
- 公司内场景走 **KMS**（见 [`architecture-and-data.md` 敏感配置](architecture-and-data.md#敏感配置)），个人 / 开源项目走 `.env`。

## 能力缺失：先补工具，再交付

`[疆疆 added 2026-05-25 (cross-project)]`

接到任务发现自己缺能力（没采集器、没 MCP、没浏览器、没 skill）时：

1. **先把工具 / MCP / skill 装好或写出来**
2. 再用工具完成任务并交付

**禁止**：用"我没办法访问 / 没有这个能力"当理由空报告。如果真的装不了（比如需要付费、需要内部审批），告诉疆疆并给替代方案。

## API 探测 / 联调设次数上限

`[疆疆 added 2026-05-25 (cross-project)]`

写探测脚本、批量调用、轮询时**必须设上限**（次数 / 时间 / 费用），超限自动停。  
- 例：外部 API 联调 ≤20 次失败就停止，不要一直试到把 quota 烧光。
- 长轮询设 timeout（60s / 5min / …），别让 worker 卡死。

## 开源 / 对外发布前扫描

`[疆疆 added 2026-05-25 (cross-project)]`

把仓库 / 文档对外发布（GitHub public、外部分享、技术 blog、demo 站）前主动扫一遍：

- **API key、token、cookie、内部 URL** — 用 `rg "(api_key|token|secret|bearer|cookie:)"` 之类粗筛
- **本地绝对路径** — `/Users/<username>/...` / `~/Desktop/...` 这种暴露身份的路径
- **公司 / 雇主标识** — 字节内部 PSM、`*.<internal-domain>`、内部工具名（除非已经公开过）
- **个人信息** — 邮箱、手机、企业账号

发现一个改一个再发布；不要 push 到 public 之后才 force-push 删除（历史里仍可查）。

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
