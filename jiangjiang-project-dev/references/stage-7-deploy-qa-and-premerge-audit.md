# Stage 7: PPE 联调部署、QA 用例对账与合码前全量走查 | PPE Deployment, QA Case Audit & Pre-Merge Review

`[疆疆 added 2026-11-19]`

当疆疆在完成功能与埋点开发（Stage 4 ~ Stage 6）后，要求部署 PPE 测试环境、排查为什么某包没发包/看不到新 UI、核对 QA 测试用例脑图是否有错漏、或要求 `rebase origin/master` 后完整检查全部分支新增功能时，严格按本文件执行。  
Follow this file strictly when 疆疆 asks to deploy to PPE, troubleshoot missing Spark/Gecko packages, audit QA test cases, or run a full post-rebase branch audit before merge/testing.

---

## 1. BITS 开发任务与 Spark AIO（`CUSTOM`）部署三道门禁 | BITS & Spark AIO Deployment Gates

1. **单任务收敛与全量真实构建包绑定**：
   - 同一个需求涉及的所有前端包（包括 `HYBRID` 旧 Gecko 包与 `CUSTOM` `tiktok_spark_deploy` 新包，如 `gift-gallery-main`、`giftgallery-indicator`、`@tt-live-lynx/live-goal-minor`）必须合并绑定在**同一个** BITS 开发任务与同一个 `ppe_<feature>` 泳道下；
   - 若因更换模板新建了替代开发任务，确认新任务已完整覆盖旧任务全部项目后，经疆疆同意用 `internal-cli bits develop close --dev-id <old_id> --reason "..." --yes` 关闭旧任务，防止每次 `git push` 重复触发两条流水线。
2. **【核心暗坑】识别并切换 `CUSTOM` 项目的 `[Spark AIO] 部署原子`**：
   - BITS 平台（无论 `44698` 还是 `34566` 模板）为 `CUSTOM`（`tiktok_spark_deploy`）项目首次生成的子流水线，默认只有 1 个 `SCM编译`（`job_atoms/scm_compile_beta`）占位节点——**跑绿了也只打 tar 包，根本不会部署到 PPE / Gecko**！
   - **必做检查与修复**：用 `internal-cli --json bits pipelines get <sub_pipeline_id>` 检查所有 `CUSTOM` 子流水线。若 `stages[0].jobs[0].uses` 仍是 `job_atoms/scm_compile_beta`，必须用 `internal-cli --json bits pipelines set --pipeline-id <sub_pipeline_id> --file <dsl.json> --yes` 将该节点升级为 `job_atoms/spark_aio_deployment@5.0.0`（传入准确的 `code_path`、`deploy_env: "ppe"`、`ppe_lane: "ppe_<feature>"`、`repo_name` 与 `scm_configs`），再调用 `internal-cli --json bits pipelines run --pipeline-id <sub_pipeline_id> --yes` 触发真实发包。
3. **Flinx 项目 Developer 权限前置排查**：
   - 若 `[Spark AIO] 部署原子` 报 `403: [ProjectAccess] no permission for projectId: ..., you are not project developer`，立即通过 `internal-cli --json bits job-run <job_run_id> --pipeline-run-id <run_id>` 提取输出里的 `flinx_url`（形如 `https://<internal-fe-platform>/project/<id>/settings`）列给疆疆申请 Developer 权限；疆疆回复审批通过后立即重跑子流水线并盯到 `jobStatus: 14 (SUCCESS)`。

---

## 2. Spark Platform 短链多入口与参数白名单双检 | Spark Short-Link Dual Check

1. **同一 `template.js` 的全部 `spark_page` 入口全覆盖**：
   - 同一个页面常有多个路由短链（如直播间中触进展馆走 `gift_gallery_index`，礼物面板右上角气泡进详情走 `gift_gallery_index_and_detail`，新建独立卡片走 `gift_gallery_pin_card`）。
   - 用 `internal-cli spark-platform` 搜索空间下关联该包的所有 `linkKey`，逐一检查 `link env list` 并补齐 `ppe_<feature>` 环境配置，防止从旁路入口进入时落回线上老包（表现为“API 返回正常但完全看不到新 UI”）。
2. **`nonStrict: false` 短链的新增 Query 参数透传白名单**：
   - Spark 短链默认只向 Lynx 页面转发 `deployConfig` 中 `value.s`（`&param=!(param~1)`）与 `value.d`（`{"param":{}}`）显式声明的参数！
   - 若本次跳转新增了 URL 参数（如 `show_team_up`、`scroll_target`、`detail_gift_id`），必须检查目标短链（如 `goal_faq_page`）是否已声明透传；未声明时必须同步更新 `ppe_<feature>`（并在上线清单中提醒同步更新线上生效版本）。若接口返回 `no permission for linkId`，把短链管理页 URL 发给疆疆申请写权限后再写入。

---

## 3. QA 测试用例脑图（BITS / ByteTest）交叉审计 | QA Test Case Mindmap Audit

当疆疆给出 BITS 测试用例链接（`/quality/case/caseDetail/<caseId>?projectId=<pid>`）时：
1. 使用 `internal-cli --json bytest case get --id <caseId> --product-id <pid> --space-id <sid>` 直接拉取完整 `TestCaseMind` JSON 树（不依赖人工截图，不漏深层子节点）；
2. 逐分支对照**最新定稿 PRD + 各轮评审会拍板决议 + 最新 Figma 状态矩阵 + 服务端 IDL + 埋点表**，分两张表输出可直接发给 QA 的审查结论：
   - **（一）现有用例中的错误 / 过期描述（❌ 需修改）**：标明脑图完整路径、当前错误写法、最新正确预期及拍板来源；
   - **（二）脑图完全遗漏的核心与边界场景（➕ 需补充）**：重点覆盖多段位主题色、空状态/达成态、低版本客户端交叉兼容、连麦嘉宾隔离、横竖屏旋转保持、Opt-out 与地区合规（EEA）等。

---

## 4. Rebase 主干后的并行独立子 Agent 全量走查与合码门禁 | Post-Rebase Adversarial Audit & Pre-Merge Gate

当疆疆要求 `rebase origin/master` 并完整检查当前分支新增功能时：
1. **拉取最新主干并精细合并**：
   - 先用 `git fetch origin master` 查看 `HEAD..origin/master` 落在当前涉及包内的所有上游新提交（如其他同学刚合入的活动功能）；
   - 执行 `git rebase origin/master`；对发生冲突及 Git `Auto-merging` 自动合并的文件**必须逐行通读全文**，并跑全量单测确认主干他人新功能（代码、埋点、Starling 词条）**100% 零丢失、零回归**。
2. **分包派发独立只读 `explore` 子 Agent 做对抗式逐行走查**：
   - 严禁由写代码的主 Agent 自己扫一眼说“没问题”。按包边界并行启动 2~3 个全新上下文的只读 `explore` 子 Agent，对着 `git diff origin/master..HEAD` 逐行排查 [`tiktok-live-lynx.md`](../../jiangjiang-coding/references/tiktok-live-lynx.md) 与 [`pitfalls.md`](../../jiangjiang-coding/references/pitfalls.md) 中的高发缺陷（Protobuf3 `0/"0"/""` 与 `??` 短路、Native IM 剥离新字段、`x-overlay-ng` 弹窗层级与 `minHeight` 裁剪、`lynx-rtl` 二次翻转、ICU 复数缺 `other` 分支、`I18n.t` 插值、共享容器 `unsubscribeEvent`、EEA/Opt-out/神秘人边界）；
   - 主 Agent 亲自核实子 Agent 报告的每一处源码行号，剔除误报后按 **P0（阻断） / P1（高危） / P2（体验/埋点细节）** 汇总并给 `AskQuestion` 选项供疆疆拍板。
3. **修复验证与合入 `master` 前最终收口清单**：
   - 修复后跑通全部涉及包的 `doctor`、`lint`、`typecheck`、单元测试（补充回归单测）、生产态 `build` 以及仓库根目录 `node scripts/large-screen/check.cjs --base origin/master`；
   - **合码上线前必检两项**：
     1. 服务端 `org/api_idl` 特性分支合入 `master` 后，将各前端包 `sab.config.js` 的临时 IDL `branch` 切回 `'master'`；
     2. 将新建或新增了透传参数的 Spark 短链同步发布到 **线上（Online / Production）** 环境。
