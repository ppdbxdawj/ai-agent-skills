---
name: jiangjiang-project-dev
description: |
  疆疆 (Jiangjiang) 工作用的项目开发多阶段工作流 Skill（Stage-gated Project Development Workflow）。
  严格按阶段隔离执行，当前已定义 Stage 1（PRD Review / 需求评审分析）、Stage 2（PRD 评审会复盘与方案更新）、
  Stage 3（撰写前端技术方案：人看飞书方案 + AI 看 *-fe-plan.md 双产物）、Stage 4（从远端 master 切分支按 Plan 开发实现与验证）、
  Stage 5（技术方案评审复盘与服务端/客户端 IDL 对齐）、Stage 6（埋点评审对齐与埋点全量落地）、
  Stage 7（PPE 联调部署、Spark AIO/短链排障、QA 用例对账与合码前 Rebase 全量走查）；
  后续未定义阶段严格区分开，禁止自行幻想或跨阶段执行。
  Trigger when 疆疆 mentions: "prd review"、"review 下这个 PRD"、"看下这个需求代码的更改计划 /
  需要和 pm 其他端确认的点 / 需要评论文档的点"、"这是 prd 评审的逐字稿，更新下问题和方案"、
  "开始撰写前端技术方案"、"从远端 master 最新的切一个分支出来开发，根据 plan"、"重新拉取下服务端 idl 看看是否够"、
  "技术评审逐字稿"、"埋点的评审逐字稿 / 埋点文档"、"读一下前端技术方案文档的评论"、"部署到 ppe"、
  "为什么这个包没有发布包 / 看不到新 UI"、"看下测试用例有没有遗漏"、"rebase origin master 后完整检查一遍当前分支所有功能"、
  "按项目开发流程走第 X 步"，或在给出飞书 PRD / 评审逐字稿 / 埋点表 / BITS 测试用例或开发任务要求对应阶段产出时使用。
license: MIT
metadata:
  author: 疆疆
  version: "0.7.0"
  tags:
    - workflow
    - prd-review
    - prd-review-sync
    - tech-design
    - plan-implementation
    - ppe-deploy
    - qa-audit
    - live-revenue-monorepo
---

# 疆疆项目开发工作流 | Jiangjiang Project Dev Workflow

本 Skill 用于管理疆疆日常工作项目的研发全流程。核心原则是：**阶段严格隔离（Strict Stage Isolation）** 与 **禁止自行脑补未定义阶段（No Hallucinated Stages）**。  
This skill governs 疆疆's project development workflow. Core principles: **strict stage isolation** and **zero hallucination on undefined stages**.

---

## 1. 核心铁律 | Core Rules

1. **阶段严格区分（Strict Stage Boundaries）**
   - 用户触发哪一步，就**只做哪一步**的动作与产出。
   - `Stage 1: PRD Review`（会前摸底与评论） ≠ `Stage 2: PRD 评审会复盘与方案更新`（会后根据逐字稿更新问题与方案） ≠ `Stage 3: 撰写前端技术方案`（产出飞书技术方案 + `*-fe-plan.md`），更不等于直接开始改业务代码或擅自 `commit / push`。
   - 未收到疆疆明确的下一阶段指令前，停在当前阶段的交付物。
2. **不自己幻想（No Hallucination）**
   - 尚未由疆疆口述定义的阶段（`Stage 8+`），只保留阶段占位，**严禁**凭经验自己编造流程规矩。
   - 当疆疆后续口述新阶段做法时，再新增对应的 `references/stage-X-*.md` 并同步更新 `evals/`。
3. **飞书文档铁律（Feishu via `lark-cli` Only）**
   - 所有飞书链接（`example.feishu.cn` / `feishu.cn`）**必须走 `lark-cli`**（`docs +fetch`、`+media-preview`、`drive +add-comment` 等）。
   - 若 `--as user` 报 `token_missing` / `need_user_authorization`，立即执行 `lark-cli auth login --domain docs --domain drive --domain wiki --no-wait --json` + `lark-cli auth qrcode` 发授权链接和二维码给疆疆，**禁止**切 Chrome AppleScript 抓飞书 DOM。

---

## 2. 阶段路由表 | Stage Routing Table

每次收到任务先判断属于哪个 Stage，**只加载对应 Stage 的 reference 文件**：

| 阶段 / Stage | 触发词示例 / Triggers | 状态 / Status | 必读细则 / Reference |
|---|---|---|---|
| **Stage 1: PRD Review**<br>（会前需求评审与代码初步摸底） | 「prd review」、「根据第一阶段审查这个 prd」、「看下 XX 文件夹下针对这个 PRD 需求的代码更改计划、和 PM/其他端确认的点、需要评论文档的点」 | ✅ **已生效 (Active)** | [`references/stage-1-prd-review.md`](references/stage-1-prd-review.md) |
| **Stage 2: PRD 评审会复盘与方案更新**<br>（Post-PRD Review Meeting Sync） | 「这是 prd 评审的逐字稿，你看下更新下问题和方案，然后 XX、YY 的前端都要我们来改」 | ✅ **已生效 (Active)** | [`references/stage-2-prd-review-sync.md`](references/stage-2-prd-review-sync.md) |
| **Stage 3: 撰写前端技术方案**<br>（FE Tech Design Writing） | 「开始撰写前端技术方案」、「用之前的前端技术方案模板写技术方案」、「进入第三阶段」 | ✅ **已生效 (Active)** | [`references/stage-3-fe-tech-design.md`](references/stage-3-fe-tech-design.md) |
| **Stage 4: 切分支按 Plan 开发实现**<br>（Branch & Implement from Plan） | 「从远端 master 最新的切一个分支出来开发，根据 plan」、「按 fe-plan 开始写代码」 | ✅ **已生效 (Active)** | [`references/stage-4-branch-and-implement.md`](references/stage-4-branch-and-implement.md) |
| **Stage 5: 技术方案评审复盘与 IDL 对齐**<br>（Tech Review & IDL Alignment） | 「这是技术评审逐字稿」、「重新拉取下服务端 idl，看看是否够」、「看看这个组件能不能复用」、「读一下技术方案文档的评论，经过我审核」 | ✅ **已生效 (Active)** | [`references/stage-5-tech-review-and-idl.md`](references/stage-5-tech-review-and-idl.md) |
| **Stage 6: 埋点评审对齐与埋点全量落地**<br>（Tracking Review & Event Implementation） | 「埋点的评审逐字稿在这里，这个是埋点文档，一起看下埋点相关的改动及执行方案」、「和客户端的补充在前端技术方案文档里并 at 客户端开发」 | ✅ **已生效 (Active)** | [`references/stage-6-tracking-review.md`](references/stage-6-tracking-review.md) |
| **Stage 7: PPE 联调部署、QA 用例对账与合码前全量走查**<br>（PPE Deploy, QA Case Audit & Pre-Merge Review） | 「部署到 ppe」、「为什么这个包没有发布包 / 看不到 UI」、「看下测试用例脑图有没有遗漏」、「rebase origin master 后完整检查一遍当前分支所有功能」 | ✅ **已生效 (Active)** | [`references/stage-7-deploy-qa-and-premerge-audit.md`](references/stage-7-deploy-qa-and-premerge-audit.md) |
| **Stage 8+: 后续阶段**<br>（如正式灰放量监控 / 全量复盘等，待后续定义） | 「按项目开发流程走第 8 步」等 | ⏸️ **待疆疆定义 (TBD — 勿自行脑补)** | 待补充（若触发，先向疆疆确认本阶段具体要求再落入 skill） |

---

## 3. 阶段间防串味自检 | Anti-Mixing Checklist

在执行任何一步前，先做 3 秒自检确认当前命中的是 **Stage 1 ~ Stage 7** 中的哪一阶段：

- 如果是 **Stage 1（PRD Review）**：
  - ✅ 是否先切回了 `master` 并拉取最新代码，且全程保持业务代码**只读**？
  - ✅ 是否核验了目标包 `lynx.config.ts` 的活跃 `entry` 与线上 Spark 短链实际指向的包（防止规划到已停编迁移的死代码）？
  - ✅ 是否用 `lark-cli` 读了 PRD（缺权限就走 split-flow 发二维码，不用 Chrome 抓飞书）？
  - ✅ 输出是否严格聚焦三件事：**① 代码更改计划**、**② 需与 PM / 其他端确认的点**、**③ 拟评论到文档的点（PM-only、不 `@` 人、先和疆疆 check）**？
- 如果是 **Stage 2（PRD 评审会复盘与方案更新）**：
  - ✅ 是否完整读了评审会逐字稿/纪要，并对每条拍板结论标注了 `[Transcript Lxx-Lyy]` 来源？
  - ✅ 是否对新增模块做了活跃构建入口核验与只读摸底（不改业务代码、不抢跑建飞书技术方案文档）？
  - ✅ 输出是否严格聚焦三件事：**① 评审会核心决议盘点表**、**② 更新后的全量前端代码更改计划**、**③ 收敛后的剩余待确认点（TBD）**？
- 如果是 **Stage 3（撰写前端技术方案）**：
  - ✅ 是否同时产出了**人看的飞书前端技术方案**（英文版在前、中文版在后、无内部行号/代码树、单语标题、首行 `English / 中文` 锚点直达、TBD 标红、内部估时公式不外露）与 **AI 看的 `<feature>-fe-plan.md`**（本地落盘 + 飞书上传并互链）？
- 如果是 **Stage 4（切分支按 Plan 开发实现）**：
  - ✅ 是否先执行了 `git fetch origin master && git checkout -b feat/<slug> origin/master`？
  - ✅ 是否严格只改动了 `*-fe-plan.md` 预期改动文件表内的文件（遵守 Non-goals，未动无关文件或手改生成目录）？
  - ✅ 是否跑完了 lint / doctor / large-screen check 等验证命令并确保本次改动 0 新增错误，且在 `*-fe-plan.md` 回写了 `## 实施记录与待确认`？
- 如果是 **Stage 5（技术方案评审复盘与服务端/客户端 IDL 对齐）**：
  - ✅ 拉取服务端 IDL（`internal-cli codebase mr diff -R "org/api_idl"` + `rushx idl`）后，是否清理了 `.idl/` 临时目录并还原了顺带更新的无关 proto 生成文件？
  - ✅ 对含动态倒计时、多阶段切换或前端 Starling 富文本/复数的模块（如多态 Banner），是否检查了服务端有无下发显式 `type/phase` 枚举与 `start_s / end_s` 时间戳（而非只给拼死的 `banner_text` 字符串）？
  - ✅ 评估跨包组件复用时，当疆疆说「只是和你讨论放哪里好」时是否只输出多维度对比而未抢跑改代码？对不同服务端接口/IM 通道的场景是否按通道归属拆包隔离，确保原业务底座与原业务埋点 100% 零改动？
  - ✅ 多场评审结论有出入需确认时，是否给出了结构化清单 + 飞书消息模板，并在收到回复后遵守「先改技术方案文档、再更新代码」？读取文档评论准备回复时是否**先请疆疆审核**？
- 如果是 **Stage 6（埋点评审对齐与埋点全量落地）**：
  - ✅ 用 `lark-cli sheets +csv-get` 读埋点表时，是否核对了 `current_region` 读全了右侧 `Q~T` 列（`param取值` / `备注` / `触发时机`）？
  - ✅ 是否将埋点表与评审逐字稿交叉对账，区分了 `FE` vs `Client` 埋点，把客户端埋点补进技术方案并 `<cite type="user">` `@` 了真实 iOS/Android 研发？
  - ✅ 新增 `gift_enter_from` 时是否检查了前端传参、服务端计值白名单与数仓营收表三方闭环？修改 `overwrite.ts` 后是否跑了 `rushx logger`？
- 如果是 **Stage 7（PPE 联调部署、QA 用例对账与合码前全量走查）**：
  - ✅ 部署 BITS 开发任务时，是否检查了所有 `CUSTOM`（`tiktok_spark_deploy`）子流水线已从默认 `scm_compile_beta` 切换为 `job_atoms/spark_aio_deployment@5.0.0`，并排查了 Flinx 项目 Developer 权限？
  - ✅ 是否核查了目标页面关联的**全部 `spark_page` 短链**均已绑定 `ppe_*` 泳道，且 `nonStrict: false` 短链已显式声明新增 query 参数透传？
  - ✅ `rebase origin/master` 后是否人工精读了自动合并文件（确保主干他人新功能零丢失），并派发多个独立上下文只读 `explore` 子 Agent 按包走查清零 P0/P1 问题？
