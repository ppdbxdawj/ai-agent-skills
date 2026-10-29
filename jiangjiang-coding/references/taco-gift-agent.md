# taco_gift_agent | BFF 规则

Read this when touching `subspaces/taco/apps/taco_gift_agent/`.

## 角色

BFF：HTTP 接口 + 调礼物 server RPC + 数据聚合 + zod 校验。前端通常对接的是这一层，而不是直接打礼物 server。

## 关键路径

| 用途 | 路径 |
|---|---|
| HTTP 控制器 | `http-server/controller/` |
| zod schema | `schema/` |
| 礼物 server IDL（参考） | `node_modules/@gulux-bam/tikcast_goods_base_v3/idl/webcast/goods/community_gift.thrift` |

## 跟礼物 server 团队协调

- 写在 **`docs/` 下的 markdown** 里（例如 `docs/community-gift-p1-server-coordination.md`），不要塞进代码注释。
- 文档里要列：要确认的语义、可选实施方案（按优先级）、对前端 / BFF 的影响。

## 图片 / 资源处理

- **下载图片时把 URL 转成 prod URL** 再去拉。`[疆疆 added 2026-05-25 (from history)]`
  - 内网 / 测试环境的链接在远程实例上未必能访问；统一走 prod URL 才能保证跨环境可下载。
  - 涉及社群礼物 / community gift 参考图、图片合成、AI 生图素材回流等场景都适用。
- 由于 BFF 部署在远程实例（见 [`live-revenue-monorepo.md`](live-revenue-monorepo.md#部署--运行环境)），下载下来的文件**不要假设其他实例也有**；要么落 TOS / Redis 这类共享存储，要么每次需要时按需重新拉。

## AI 模型调用 | LLM call conventions

`[疆疆 added 2026-05-25 (from history)]`

- **OpenAI / Gemini 调用用 `fetch`，不用官方 SDK**：SDK 不方便插自定义 header / 公司代理；直接 `fetch` 更可控。
- **请求头带 `X-TT-LOGID`**：把上游 logid 透传给模型 gateway，方便 Argos 追踪整条链路。失败排查时这条 logid 是关键。
- 失败 / 超时不要静默吞，记日志（见 [`pitfalls.md`](pitfalls.md#排查时主动多打日志)）。

## 落库习惯 | DB persistence

`[疆疆 added 2026-05-25 (from history)]`

- **分步落库**：每完成一步能落库就落库，状态字段（`step` / `status`）随之推进；中间失败也不能让 DB 字段为空数组 / null，要落"失败 + 原因"。
- **失败落库写清原因**：写 `error_message` / `error_code` 列，不能只把 status 翻成 `failed` 就完事；后续排查 / retry 都靠这条。
- **服务重启能恢复未完成轮询**：worker 进程重启后能从 DB 把 in-flight 任务捞回来续跑（Magic Gift / 视频生成这类长链路尤其重要）。详见 [`architecture-and-data.md`](architecture-and-data.md#队列--限流--跨实例状态)。

## 后端接口日志 | Backend route logging

- 改 `taco_gift_agent` HTTP controller / RPC 桥接时，按现有风格补齐关键日志：permission denied、request、success、error 都带 `anchor_id` / `gift_id`、`operator_name`、变更字段和下游错误 message；不要只在 catch 里裸打 error。`[疆疆 added 2026-05-28]`

## Community Gift workflow 语义 | State machine / retry / backfill

- 改 Community Gift workflow 时，必须一起核对 `status`、`taco_status`、`review_result.pipeline_state`、`error_message`、`error_code`；不要只改一个字段导致状态机口径漂移。`[疆疆 added 2026-06-02]`
- 严格区分 retry / force rerun node / retry range / backfill / regenerate from scratch：回答和实现都要说清楚是 resume 当前节点、强制重跑某节点，还是重新生成新任务。`[疆疆 added 2026-06-02]`
- Boolean API 参数（如 `include_p4_pending_retry`、`forceRerunRecommend`）必须真实进入核心执行分支，并在日志、response 或 progress state 中能看出 matched / queued / skipped。`[疆疆 added 2026-06-02]`
- 对 P4 / PendingRetry / naming / TCS 终态这类业务状态，先定义哪些记录能动、哪些必须跳过：`Passed`、`Rejected`、`SyncedToGiftServer` 默认不被 AI recommend 覆盖；已有 PendingRetry 或最终 gift names 的 P4 主播默认不重复重生成。`[疆疆 added 2026-06-02]`

## 临时方案 ≠ 长期规则

具体某次需求的实现选型（例如「未激活主播改礼物 = delete + add 组合」、「permission removed 靠 user 是否在 RPC 列表判断」）属于**那一次的决定**，不要写进本 skill 当永久规则。下次同类问题先去 `docs/` 找最新协调结论。

## Regional gift（区域礼物）走专用 skill

接到 regional gift / 区域礼物 / Lark 选图 / Seedream 区域礼物相关任务，直接读：

- `live_revenue_monorepo/.cursor/skills/taco-regional-gift/SKILL.md`
- `live_revenue_monorepo/.cursor/skills/taco-regional-gift-prompt/SKILL.md`

不要在本 skill 里重述。

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
