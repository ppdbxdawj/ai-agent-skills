# Architecture & Data | 架构与数据规则

Read this when designing data models, queues, service boundaries, secret handling, or any cross-instance shared state.

涉及数据建模、队列、服务边界、敏感配置、跨实例共享状态时读这个。

`[疆疆 added 2026-05-25 (from history)]`

## 数据库 / Schema

- **MySQL 不用 `JSON` 类型，统一 `TEXT` 存 JSON string**：跨实例 / 跨工具一致性更好，迁移、备份、查询都更稳；读写两端各自做 `JSON.parse` / `JSON.stringify`。  
  Use `TEXT` columns with stringified JSON instead of native `JSON` type — better cross-tool consistency, easier migrations.
- **每列 `COMMENT` 都要写，且中英文双语**（"中文说明 / English description"）：方便后续接手 / 写 RFC / 给非中文同事 review。  
  Every column needs a bilingual `COMMENT` for handoff and review.
- **`BLOB` / `TEXT` 列不要 `NOT NULL` 且没有默认值**：MySQL 不允许给这两类列设默认值，加 `NOT NULL` 会逼 INSERT 时必传，链路上很容易卡。允许 NULL，或者改成 `VARCHAR` 留默认值。  
  `BLOB` / `TEXT` cannot have a literal default; `NOT NULL` on them blocks easy inserts. Allow NULL or use `VARCHAR` with a default.
- **关联用 ID，不用字符串松散绑定**：例如 `prompt_id` 比 `prompt_name` 更可靠；改名时不用全表 update。  
  Reference rows by ID, not by name — renames don't ripple.

## 大表 SQL / Backfill

- **SQL / backfill / 队列任务默认按大规模系统处理**：先看是否能用索引、是否有 bounded query / chunking、是否可观测进度、是否有 retry / failure 处理；不要写一次性全表扫、无上限循环、或者跑完才知道失败的脚本。`[疆疆 added 2026-05-25 (from memory)]`  
  Treat SQL, backfills, and queue jobs as large-scale by default: indexed access, bounded chunks, progress visibility, and explicit retry/failure handling.
- **批量任务必须解释 queued / skipped**：backfill、retry range、queue drain 这类任务要有 total / matched / queued / skipped-by-reason / failed counters；不要只返回“已启动”让用户事后猜为什么没跑。`[疆疆 added 2026-06-02]`  
  Batch jobs must expose total / matched / queued / skipped-by-reason / failed counters; “started” alone is not enough.
- **规则归位先分通用 vs 业务**：大表、SQL、backfill、队列是通用工程规则，放这里；Community Gift 的具体业务语义 / server 协调结论放 `taco-gift-agent.md` 或对应 `docs/`，不要混成永久通用规则。`[疆疆 added 2026-05-25 (from memory)]`  
  Keep generic engineering guidance separate from Community Gift business-specific rules.

## 队列 / 限流 / 跨实例状态

- **限流 / 排队走 Redis，不用纯内存队列**：服务部署在多实例（见 [`live-revenue-monorepo.md`](live-revenue-monorepo.md#部署--运行环境)），单实例内存队列在另一台机器上看不到。Redis（PSM 走公司统一的 `toutiao.redis.taco`）+ worker 长轮询是基线方案。  
  Use Redis-backed queues for rate limiting / batching; per-process memory queues don't see other instances.
- **服务重启能恢复未完成轮询 / 中间态**：状态写 Redis / DB，进程重启后 worker 能从 DB 把"in-flight"任务捞回来续跑，不要让重启吞任务。  
  Restart-resilient: pending work must be reconstructable from Redis / DB so a deploy doesn't drop tasks.
- **Workflow 触发**：HTTP 入口立刻返 ACK，下载 / 生成 / 处理放后台 worker；不要让客户端等几十秒同步流程。  
  Workflow entry returns ACK immediately; do the heavy lifting in a background worker.

## 敏感配置

- **模型 key、敏感配置走 KMS，不硬编码、不进 git**：API key、Cookie、内部 token 都从 KMS 取；连 fallback default 都不要写。  
  Secrets (model keys, cookies, internal tokens) come from KMS; no hardcoded fallbacks.

## 服务 / 节点设计

- **能拆原子化能力就拆**：每个独立"能力"（抠图、生图、合成、上传…）做成独立的 Service + RPC + HTTP 三件套；上层 workflow 只负责编排，不写业务。节点契约（输入 / 输出 schema）先定，再拼编排层。  
  Make each capability an atomic Service+RPC+HTTP unit; the workflow layer only orchestrates. Nail the node contract before wiring orchestration.
- **能配置 / 算法解决的不占 LLM**：UI 状态判断、规则匹配、定时任务、参数校验等用代码 / 配置实现，不要丢给 LLM 跑；LLM 留给真正需要"理解 + 生成"的环节，省 token、稳定性也更好。`[疆疆 added 2026-05-25 (cross-project)]`  
  If a rule, schedule, or state check can be solved by code/config, don't burn LLM tokens on it.
- **Skill 自包含**：一个 skill 涉及的脚本 / 模板 / 文档一律放在 `<skill>/` 目录里（如 `<skill>/scripts/`、`<skill>/references/`），不要散在 repo 别处让 agent 猜路径。`[疆疆 added 2026-05-25 (cross-project)]`  
  Skills are self-contained: scripts, templates, references all under `<skill>/`. Don't scatter dependencies elsewhere in the repo.

## 资产输出 / 数据导出 | Asset output formats

`[疆疆 added 2026-05-25 (cross-project)]`

- **生图 / 视频 prompt 类 CSV：单列 `prompt`**。负向约束、风格修饰、参考图引用都写进这一列正文，不另起列。多个项目（taco regional gift、AIPet 资产、idea Seedream 帅哥、openclaw novel-to-storyboard）都按这套来。  
  Asset prompt CSVs use a single `prompt` column; negatives / style / refs go inside the prompt body, not as separate columns.
- 例外：调用脚本需要批处理多种参数（model / size / count）时才加列；纯生图 prompt 不要画蛇添足。

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
