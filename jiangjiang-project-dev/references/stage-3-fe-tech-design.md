# Stage 3: 撰写前端技术方案（人看 + AI 看双产物） | FE Tech Design & AI Plan

`[疆疆 added 2026-10-29]`

当疆疆在完成 Stage 1（PRD Review）或 Stage 2（PRD 评审会复盘与方案更新）后，明确要求「开始撰写前端技术方案」或「按前端技术方案模板出技术方案文档」时，严格按本文件执行。  
Follow this file strictly when 疆疆 asks to write the Frontend Technical Design after Stage 1 / Stage 2.

---

## 1. 核心原则：人看与 AI 看严格拆分（同阶段双份产物） | Human vs. AI Dual Deliverables

同一阶段固定产出**两份互补文档**，并在飞书技术方案中互相挂载链接：

| 产物 | 目标读者 | 载体与位置 | 核心职责与边界 |
|---|---|---|---|
| **产物一：飞书前端技术方案**<br>（FE Tech Solution） | 👤 **人看**<br>（PM / Server / Client / QA / Tech Review） | 飞书个人知识库（`--parent-position my_library`） | **对齐边界与契约**：背景、Reference 表、Mermaid 流程图、排期估时、页面模块（入口/截图/UI/**业务层逻辑**/接口/估时）、通用技术细节、测试与发布、**待确认点（TBD 标红）**。<br>❌ **禁止塞入具体代码行号（如 `:6138-6167`）、内部函数名（如 `collectGalleryGifts`）、React `key` 表达式或冗长代码目录树**。 |
| **产物二：前端实施计划 `<feature>-fe-plan.md`**<br>（FE Implementation Plan） | 🤖 **AI 看 + 研发自检**<br>（Coding Agent / Fresh Reviewer） | 1. 仓库根目录本地 `<feature>-fe-plan.md`<br>2. **同步上传一份飞书文档**（`--parent-position my_library`），并把飞书链接挂在产物一的 `Reference` 表 `FE` 行与 `Code changes` 节中 | **零歧义驱动写代码**：目标与完成标准（含可运行命令 `rushx verify` / `rushx build`）、不做的部分（Non-goals）、现状与精确代码位置（`filepath:startLine-endLine` + Bug 根因）、分步实施步骤（第一步～第 N 步）、预期改动文件表、验证方式、提测准入用例表、风险与自检清单。 |

---

## 2. 产物一：飞书前端技术方案（人看）规范 | Spec for Human-Facing Tech Design

### 2.1 参考模板
- 原始结构模板：[`[Revenue]Gift Gallery FE Tech Solution // 礼物展览馆前端技术方案`](https://example.feishu.cn/wiki/<TECH_SOLUTION_TEMPLATE_TOKEN>)
- 双语排版范例：[`[Revenue]Gift Gallery Champion Mode Duplicate Gifts FE Tech Solution // 展馆挑战区新增重复礼物前端技术方案`](https://example.feishu.cn/wiki/<TECH_SOLUTION_EXAMPLE_TOKEN>)

### 2.2 固定章节与写法要求
1. `<title>[Revenue]<English Feature Name> FE Tech Solution // <中文需求名>前端技术方案</title>`
2. **双语结构与顶部跳转导航**：
   - **英文版在前，中文版在后**（以 `<hr/>` 分隔），两版共用同一套待确认编号（`S1~Sn`、`P1~Pn`、`C1~Cn`）。`[疆疆 updated 2026-10-30]`（注：此顺序仅适用于此后新建的技术方案文档；已交付文档不追溯调整，除非疆疆明确要求。）
   - **章节标题单语化（不写双语标题）**：既然文档已分为英文区和中文区，**英文区的各级章节标题和表头一律只写纯英文**，**中文区一律只写纯中文**（如 `背景`、`参考`、`状态流转`、`排期`、`涉及页面`、`通用技术细节梳理`、`测试与发布`、`待确认点`、`技术评审纪要`），不要再写 `Background // 背景` 这种双语拼接标题。`[疆疆 added 2026-10-29]`
   - **文档首行用 `English / 中文` 锚点直达链接**：文档创建并拿到中英文首标题的 `block_id`（通过 `lark-cli docs +fetch --detail with-ids`）及 Wiki URL 后，将文档第一段写为 `<p><b><a href="https://example.feishu.cn/wiki/<wiki_token>#<en_h1_block_id>">English</a> / <a href="https://example.feishu.cn/wiki/<wiki_token>#<cn_h1_block_id>">中文</a></b></p>`（中文分隔线处同理），点击即可直接跳转到对应语种段落。`[疆疆 updated 2026-10-30]`
3. **待确认项全部标红**：所有未决项、阻塞项、需上下游确认的点均用 `<span text-color="red">...</span>` 标红，绝不自行假设。
4. **章节清单（英文区在前用纯英文标题，中文区在后对应纯中文标题 — 必须严格 1:1 对齐原始模板结构）**：
   - `<h1>Background</h1>`（中文：`<h1>背景</h1>`；只写 1~2 条业务卡点与需求一句话结论，**不要**在背景里把每个包改什么复述一遍）
   - `<h1>Reference</h1>`（中文：`<h1>参考</h1>`）
     - **【强制拉取 Meego 真实节点负责人】**：填写 `POC` 列前，必须用 `internal-cli --json meego workitem get --url "<meego_url>" --fields '["_all"]'` 与 `internal-cli --json meego node get --url "<meego_url>"` 拉取该需求 Meego 的 `role_members` 和各节点真实负责人（PM、UI/UE、Server、iOS、Android、FE、QA、UX Writer 等），再用 `lark-cli contact +search-user` 转成飞书原生 `<cite type="user" user-id="ou_xxx">` 标签写入；**严禁**沿用其他需求的旧模板名单或凭印象猜人。若 `internal-cli meego` 未登录，走 `internal-cli --json meego login --begin --qr-image ./meego_qr.png` 发链接和二维码请疆疆扫码。`[疆疆 added 2026-11-04]`
     - **【强制拉取 Reference 关联文档与内嵌表】**：`Reference` 中引用的所有飞书文档（PRD、服务端技术方案、DW 埋点、UXW Content Tracker 等）必须重新 fetch 最新版本；若文档内含 `<sheet>` / `<bitable>` 或指向电子表格，必须用 `lark-cli drive +inspect` + `lark-cli sheets +workbook-info` / `+csv-get` 下钻读取对应子表，并用原生 `<cite type="doc">` 挂载链接。`[疆疆 added 2026-11-04]`
     - 完整行项：`PRD`、`Figma`、`Server`、`iOS`（独立行）、`Android`（独立行）、`FE`（写：`本文（人看）｜ <cite type="doc"> FE Plan（AI 看）｜ MR 链接`）、`Data / DS`、`Content / UXW`、`QA`、`Meego`、`Starling`、`Package name`、`Branch name`、`SCM`、`Roma 投放集合`、`Code baseline`。
   - `<h1>The flow chart</h1>`（中文：`<h1>状态流转</h1>`；`<whiteboard type="mermaid" path="@flow.mmd"></whiteboard>`，**不要**在画板下方再用一段长文字把时序图复述一遍）
   - `<h1>Schedule</h1>`（中文：`<h1>排期</h1>`）
     - **【内部估时规则 — 严禁把计算公式或倍数写进文档正文】**：先评估各模块纯开发基准耗时，落入文档时**每个模块开发估时按 `基准 × 3` 填写**；**联调时间至少 `2pd`（`≥ 2pd`）**；**整体再加 `20%` 的 buffer 时间**（文档里只呈现最终算好的数字，例如 `总估时：8pd（4.5pd 开发 + 2pd 联调 + 1.5pd buffer）`，绝对不要在文档中出现“×3”或“+20%”等内部规则字样）。`[疆疆 added 2026-10-29]`
   - `<h1>Including Pages</h1>`（中文：`<h1>涉及页面</h1>`）
     - 顶部汇总表（`页面 | 功能 | 备注 | 预估排期`）只写一句话核心职责与待确认编号，不展开细节；
     - 各页面子模块用简短 `<h3>` 标题（如 `<h3>直播间展馆中触</h3>`，不堆砌副标题），内部**固定用 `<h4>` 小标题**（不用 `<p><b>入口：</b></p>`）：`<h4><b>入口</b>：</h4>`、`<h4>页面截图：</h4>`、`<h4>UI：</h4>`、`<h4>逻辑：</h4>`（不含内部函数名/行号）、`<h4>涉及接口：</h4>`、`<h4>模块开发估时：</h4>`。`[疆疆 updated 2026-11-04]`
   - `<h1>General technical details combing</h1>`（中文：`<h1>通用技术细节梳理</h1>`；必须包含以下完整 `<h2>` 子节：`Interface / 接口梳理`、`Code changes / 本仓库改动`、`Page schema / 页面 Schema`、`Public Components / 公共组件`、`End Capability Grooming / 端能力梳理`、`RTL Solutions / RTL 方案`、`Landscape compatible / 横屏兼容`、`Event Log / 埋点方案`、`文案`、`Settings`）
   - `<h1>Test & Release</h1>`（中文：`<h1>测试与发布</h1>`；必须拆分为 6 个独立 `<h2>`：`Test focus / 测试重点`、`Security / 安全合规`、`Monitor / 监控方案`、`AB Test / AB 实验`、`Release plan / 上线方案`、`Rollback plan / 回滚方案`，不要合并成一个段落）
   - `<h1>TBD / Open Items</h1>`（中文：`<h1>待确认点</h1>`；分 `Server`、`PM`、`Client` 表格）
   - `<h1>Tech Review TODOs</h1>`（中文：`<h1>技术评审纪要</h1>`；`<checkbox>`）

5. **后续根据服务端方案/评论更新技术方案时的铁律** `[疆疆 added 2026-11-04]`：
   - **先读全部关联文档的评论**：用 `lark-cli drive file.comments list` 拉取前端技术方案、服务端技术方案、PRD 上的全部评论；修改正文时**必须保留挂有他人划词评论的原 block（如表格/段落）**，严禁全量 `overwrite` 导致评论锚点丢失。
   - **去 AI 味与砍除跨章节冗余**：中文部分用研发日常直白短句，严禁把同一个改动点在 `背景`、`状态流转`、`涉及页面总表`、`模块详情`、`接口梳理`、`测试重点` 里反复抄写 4~5 遍。
   - **不臆测汉字人名，给上下游的评论回复保持极简**：提及同事一律用飞书 `<cite type="user">` 或英文名（如 `Yanxin`），**严禁**根据拼音自己猜同音汉字名；回复服务端/其他端评论时只写对方需要知道的结论、字段值与需对方确认的一句话（如客户端 JSB 转写后服务端是否收到某字段），不要贴前端内部冗长实现过程。

---

## 3. 产物二：前端实施计划 `*-fe-plan.md`（AI 看）规范 | Spec for AI-Facing Implementation Plan

### 3.1 遵循的底层 Skill 与参考模板
- **底层规则源（必读）**：
  - [`~/.cursor/skills/jiangjiang-coding/references/plan-writing.md`](../../jiangjiang-coding/references/plan-writing.md)（AI 编码计划书写规则：Done Definition、Non-goals、Code Map、小步可验 Steps、Verification Plan、Risks、Review Checklist，以及复杂 plan 交付前跑 `ce-doc-review`）
  - [`~/.cursor/skills/jiangjiang-coding/references/communication-and-docs.md`](../../jiangjiang-coding/references/communication-and-docs.md)（标题不编号、少空行、反 AI 风）
- **仓库实例参考模板**：
  - 仓库根目录 `music-gift-tier2-label-fe-plan.md`、`songs-of-live-arena-fe-plan.md`、`gallery-champion-duplicate-gifts-fe-plan.md`（在 `plan-writing.md` 标准模板上增加了 `## 排期` 与带 `阻塞 (Y/N)` 列的 `## 提测准入用例` 表）

### 3.2 固定章节与双端同步要求
1. **本地落盘**：在仓库根目录创建 `<feature>-fe-plan.md`，首段注明技术方案飞书链接、代码基线、PRD 版本与 Meego 链接。
2. **包含章节**：
   - `## 目标与完成标准`（必须带可运行的 lint / typecheck / build / large-screen check 命令）
   - `## 不做的部分`（明确 Non-goals，防止 Agent 顺手重构或改无关包）
   - `## 现状与代码位置`（精确到文件路径、行号与现有实现/Bug 根因）
   - `## 方案与顺序安排`（区分哪些步骤立即可做、哪些依赖 TBD 确认）
   - `## 排期`
   - `## 实施步骤`（`### 第一步` ～ `### 第 N 步`，每步附局部验证方法）
   - `## 预期改动文件`（表格：`文件 | 改动 | 原因`）
   - `## 验证方式`
   - `## 提测准入用例`（按功能模块分表，含 `编号 | 操作 | 预期 | 阻塞(Y/N)`）
   - `## 风险与边界情况`
   - `## 自检清单`
3. **同步上传飞书并挂载链接**：
   - 使用 `lark-cli docs +create --as user --parent-position my_library --doc-format markdown --title "<中文需求名> — 前端实施计划 (FE Plan)" --content @...` 上传到飞书个人知识库；
   - 用 `lark-cli wiki +node-get` 获取其 Wiki URL（`https://example.feishu.cn/wiki/<token>`），回填挂载到产物一（飞书前端技术方案）的 `Reference` 表 `FE` 行与 `Code changes` 节。
