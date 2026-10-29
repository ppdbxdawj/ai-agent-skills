# Stage 1: PRD Review | 需求评审与代码摸底

`[疆疆 added 2026-10-29]`

当疆疆说「prd review」，或给出飞书 PRD 链接 + 目标代码目录（如 `gallery` 文件夹下），要求看代码更改计划、待确认点和文档评论点时，严格按本文件执行。  
Follow this file strictly when 疆疆 asks for a `prd review` or provides a Feishu PRD URL + target directory to evaluate code changes, cross-role questions, and doc comments.

---

## 1. 输入与前置动作 | Inputs & Pre-conditions

### Step 1.1：切回 `master` 并拉取最新代码 | Sync Latest `master`

- 在仓库根目录执行：
  ```bash
  git checkout master && git pull origin master
  ```
- 若当前分支有未提交修改阻断切换，先汇报给疆疆确认处理方式，不要擅自丢弃。
- **本阶段全程代码只读（Read-only on codebase）**：只探索和阅读代码，不修改业务源码、不建开发分支（除非疆疆额外明说）。

### Step 1.2：用 `lark-cli` 读取飞书 PRD | Read PRD via `lark-cli`

- **强制使用 `lark-cli`**：
  ```bash
  LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 \
    lark-cli docs +fetch --as user --doc "<PRD_URL>" --detail with-ids
  ```
- **严禁使用 Chrome AppleScript 抓取飞书文档 DOM**。
- **权限缺失处理**：
  - 若报 `token_missing` / `need_user_authorization`，立即按 `lark-shared` split-flow 发起授权：
    ```bash
    LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 \
      lark-cli auth login --domain docs --domain drive --domain wiki --no-wait --json
    ```
  - 在 `/tmp` 下用 `lark-cli auth qrcode "<verification_url>" --output "lark_auth_qr.png"` 生成二维码 PNG，将原始链接 + 二维码图片展示给疆疆，等疆疆回复已授权后再执行 `lark-cli auth login --device-code <device_code>`。
- **文档内嵌素材下钻**：
  - PRD 中包含原型图 / 设计图（`<img token="...">`）时，用 `lark-cli docs +media-preview --as user --token <token> --output ...` 拉取并查看图片内容，不能漏看图中的 UI/文案细节。
  - PRD 中包含嵌入电子表格（`<sheet>`）或多维表格（`<bitable>`）时，提取 token 切 `lark-sheets` / `lark-base` 读取。

### Step 1.3：盘点目标目录下的现有代码 | Inspect Target Codebase

- 在最新 `master` 上，定位疆疆指定的文件夹（例如 `gallery` 涉及的所有前端/Lynx 包，注意区分老包与迁移后的新包，如 ReactLynx 2 vs ReactLynx 3）。
- 顺着 PRD 提到的每个场景，逐一核对现有代码的：
  - 页面与组件树（Entry / Sub-components / Popups / Sheets）
  - 接口与 IDL 字段定义（如请求参数、返回列表结构、唯一键是 `gift_id` 还是格子 index/slot ID）
  - 状态计算、缓存 key（本地 Storage key、今日/本周首次弹窗频控逻辑）
  - 跳转传参、JSB 事件、埋点上报参数与 Starling 多语言 key

---

## 2. Stage 1 必交的三项产出 | Three Required Deliverables

分析完成后，按以下三个模块结构化输出（关键点中英对照）：

### 产出一：代码更改计划 | 1. Code Change Plan

- **涉及包与范围说明**：先明确指定名称（如 `gallery`）在仓库中对应哪些具体目录/package（如果存在新旧两套工程，明确指出分别在哪、改哪套或两套都改）。
- **逐场景改动拆解**：对照 PRD 的每个业务场景（例如：计值/冠名展示、首次弹窗提示、规则页说明、埋点、多语言文案等），逐一说明：
  - **现有代码是怎么实现的**（引用真实文件路径与行号 `startLine:endLine:filepath`）
  - **是否需要前端改代码**（区分「现有逻辑已天然按数组项独立渲染、无需改动」vs「以 `gift_id` 做唯一 key/查找，存在重复礼物冲突需改造」vs「需新增组件/字段/文案」）
  - **具体怎么改**（涉及哪些文件、改哪些状态/参数/key）

### 产出二：需要与 PM、其他端确认的点 | 2. Points to Confirm with PM & Other Roles

按协作角色清晰分组（每条带编号，如 `P1`、`S1`、`C1`），只列真正未明确、有歧义或影响技术实现的点：

- **PM（产品）**：交互细节边界、弹窗频控口径、多语言 Starling 文案与 key、AB 实验分组控制方（服务端下发还是端上实验参数）、埋点是否新增参数等。
- **Server（服务端）**：IDL 接口字段是否变更、重复礼物在列表/详情/IM 消息中的唯一标识（是否仅靠 `gift_id` 会撞车）、弹窗触发标记是否由服务端下发等。
- **Client / 其他端（iOS / Android / 礼物面板）**：端上礼物面板冠名标识、Schema 跳转传参、直播间公屏/橫幅联动等是否受重复 `gift_id` 影响。
- **UI / UXW / DS / QA**（如有）：设计稿定稿状态、文案 key、埋点验收口径。

### 产出三：需要评论文档的点（先与疆疆 Check） | 3. Draft Doc Comments (Check Before Posting)

- 将需要在 PRD 文档上划词/按块评论的问题单独列出，**先发给疆疆确认（Check），严禁未经确认直接调 `lark-cli` 往文档上发评论**。
- **评论编写规范**（源自疆疆既有偏好）：
  - **PRD 阶段只发需产品（PM）确认的点**：服务端 / 客户端等技术方案层面的问题留到后续技术方案阶段再发，不在 PRD 阶段混发。`[疆疆 added 2026-10-29]`
  - **评论中不要 `@` 人**：直接写问题本身，不要带 `@某某`。`[疆疆 added 2026-10-29]`
  - **极简原则**：只留**需要对方回答**的问题，每条一两句话说清，不写长篇大论或纯知会（FYI）性质的废话。
  - **语言约定**：评论在 PRD 文档上的用**中文**（评论在服务端英文方案文档上的用**英文**）。
  - **定位清晰**：每条标明【对应 PRD 章节 / 原文锚点文字 + `block_id`】→【拟评论内容】。
- 等疆疆回复确认（或修改某几条）后，再调用 `lark-cli drive +add-comment` 写入飞书文档。

---

## 3. 本阶段禁区（Non-goals of Stage 1）

- ❌ 不直接修改仓库里的业务代码。
- ❌ 不在疆疆确认前直接往飞书 PRD 发送评论。
- ❌ 不自动跨入后续阶段（如擅自创建飞书技术方案文档、做技术方案 review 等）。
