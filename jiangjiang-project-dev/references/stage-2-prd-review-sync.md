# Stage 2: PRD 评审会复盘与方案更新 | Post-PRD Review Meeting Sync

`[疆疆 added 2026-10-29]`

当疆疆在完成 Stage 1（PRD Review）后，给出 **PRD 评审会议逐字稿 / 会议纪要 / 妙记**，并要求「更新下问题和方案」（常伴随补充明确前端需负责的业务包范围，如 `live goal`、`中触`、`gallery` 都要改）时，严格按本文件执行。  
Follow this file strictly when 疆疆 provides a PRD review meeting transcript/minutes after Stage 1 and asks to update the open questions and code change plan.

---

## 1. 输入与前置动作 | Inputs & Pre-conditions

1. **完整读取评审逐字稿 / 纪要**：
   - 仔细通读附件逐字稿或飞书妙记全文，梳理产品（PM）、服务端（Server）、客户端（Client）、前端（FE）、数仓（DW）在会上的讨论与最终拍板结论。
   - **严守来源铁律**：总结会上的每一条决议时，必须标注逐字稿行号区间（如 `[Transcript L262-L269]`），不凭印象臆造。
2. **补充摸底新增范围的代码库（全程只读）**：
   - 若会上或疆疆指令中新增了 Stage 1 未覆盖的前端包（例如从仅看 `gallery` 扩展到 `live-goal`、`live-goal-indicator`、`giftgallery-indicator`），立即在最新 `master` 上只读定位新增包的相关组件、接口、跨端传参（如 `sendGiftV2` 的 `enter_from` / `giftEnterSource` 枚举值）。
   - **本阶段仍然保持业务代码只读（Read-only on codebase）**。

---

## 2. Stage 2 必交的三项产出 | Three Required Deliverables

分析完成后，按以下三个模块结构化输出（关键点中英对照）：

### 产出一：PRD 评审会核心决议盘点表 | 1. Key Decisions from PRD Review Meeting

以表格形式对照 Stage 1 的疑问与会上的拍板结论：
- **列结构**：`议题 / Topic` | `会前疑问 / Pre-Review Question` | `评审会拍板结论 / Meeting Decision` | `逐字稿来源 / Source ([Transcript Lxx-Lyy])`
- 重点标明：
  - 哪些会前歧义已经拍板定案；
  - 哪些交互在会上被**裁剪/简化**（如取消轮播、复用现有动效、不做停留态实时推送等）；
  - 哪些范围在会上被**新增纳入**（如顺带修改关联包按钮、新增参与者名单半屏等）。

### 产出二：更新后的全量前端代码更改计划 | 2. Updated Full-Scope FE Code Change Plan

- **跨端已有契约核对表（如适用）**：例如会上服务端询问前端各入口送礼 `enter_from` 字符串是什么，直接查清代码列出精确的文件行号与参数值表，方便直接同步给服务端。
- **按业务包 / 模块分节拆解**（覆盖疆疆指定的全部前端模块，如 `giftgallery-indicator` 中触、`gift-gallery-main` 展馆主包、`gift-gallery` 规则页、`live-goal` & `live-goal-indicator` 目标与 Pin 卡）：
  - 对照会后最新需求范围，引用真实文件路径与行号（`startLine:endLine:filepath`）；
  - 明确每個模块因会议决议带来的方案调整（删除了哪些原计划改动、新增了哪些文件/状态/按钮逻辑）。

### 产出三：更新后的剩余待确认点（TBD） | 3. Updated Remaining Open Items

剔除会上已解决的问题，只保留进入 **Stage 3（撰写前端技术方案）** 时仍需与各角色敲定的点：
- **Server（服务端）**：具體新增 IDL 字段名与类型、新增接口路径与分页/上限、跨模块动作的后端链路（如在展馆详情页直接 Pin 礼物的接口方式）、跟版 IDL 的 merge 时间点等。
- **PM（产品）**：会上记了 Todo 待会后跟设计/老板确认的遗留点（如某实验组是否最终开启、某 Banner 点击跳哪里、Starling Key 与埋点表何时补齐）。
- **Client / 其他端（如有）**：客户端跟版节奏与 JSB 参数配合。

---

## 3. 本阶段禁区（Non-goals of Stage 2）

- ❌ 不直接修改仓库里的业务代码。
- ❌ 不在未收到疆疆明确的 Stage 3 指令前，擅自创建飞书前端技术方案文档或本地 `<feature>-fe-plan.md`。
