# Stage 5: 技术方案评审复盘与服务端/客户端 IDL 对齐 | Tech Review & IDL Alignment

`[疆疆 added 2026-11-09]`

当疆疆在完成首版代码开发（Stage 4）后，给出服务端/前端技术评审会逐字稿、要求重新拉取服务端 IDL 检查是否够用、评估跨包组件是否能复用、或要求查看/回复技术方案文档评论时，严格按本文件执行。  
Follow this file strictly when 疆疆 provides tech review transcripts, asks to re-pull and evaluate Server IDL changes, evaluates component reuse across packages, or reviews tech design comments.

---

## 1. 服务端 IDL 多轮迭代拉取与精确评估 | Server IDL Pull & Completeness Check

1. **查看服务端 IDL MR 最新 Diff**：
   - 使用 `bytedcli codebase mr view -R "tikcast/api_idl" <MR_IID>` 与 `bytedcli codebase mr diff -R "tikcast/api_idl" <MR_IID>` 查看最新 Version 的 proto 改动。
   - **警惕口头字段名与 proto 真实字段名差异**：服务端同学在 IM 消息或会上口头说的字段名（如 `is_team_up_gift`、`progress_count`、`left_count_to_light_up`）常与 proto 实际提交的字段名（如 `team_up_mode_gift`、`base_sent_count + team_up_sent_count`、`left_count_to_lit_up`）存在拼写或拆分差异，必须以 `.proto` 源码为准并在前端适配层兼容。
2. **执行 `rushx idl` 并保持工作区干净**：
   - 在涉及的包目录下运行 `rushx idl`（`sab-kit idl`）更新 `src/typings/idl/`。
   - **必须清理缓存与无关文件**：跑完后立即删除临时 `.idl/` 缓存目录（避免占满磁盘或污染 git），并用 `git checkout` / `git clean` 还原顺带更新的无关 proto 生成文件，**只保留本次需求涉及的 `.ts` 类型文件**。
3. **评估 IDL 是否够用并给出可直接复制的回复文案**：
   - 对照前端真实交互全链路逐项核查：
     - **送礼参数**：是否有 `gift_type`（区分 `1=小礼可连击不关卡片` vs `2=大礼送出后关闭卡片播全屏特效`）、`price`、`gift_icon`？
     - **实时状态更新与去重**：30s 存活期内进度更新是否有唯一标识（如 `pin_id`）供前端判断「首次弹卡 vs 原地刷新进度（避免重复调 `showLynxPinCard` 导致闪烁或把观众手动关掉的卡又弹出来）」？
     - **中途进房快照**：观众中途进房走 MUnify 快照（`timing = NORMAL_PROGRESS`）时是否携带未过期的状态数据？
     - **主播侧操作与冷却**：是否包含发起操作的 HTTP 接口 `.proto` 及重进页面时的状态/冷却时间戳？
   - 输出结论时分 **「已满足 ✅」** 与 **「还需补齐/确认 ⚠️」**，并在回复末尾附上一小段**可直接复制发给服务端同学的确认文案**。

---

## 2. 跨包组件/页面复用评估与按服务端通道拆包原则 | Component Reuse & Channel-Aligned Package Split

`[疆疆 updated 2026-11-10]`

当评估某功能（如展馆众筹 Pin 卡）能否复用既有包页面（如 `live-goal/src/pages/pin`）或放在哪个包更好时：

1. **讨论阶段严禁抢跑改代码**：
   - 当疆疆明确说「只是和你讨论放哪里好，而不是让你执行」时，**严禁改动任何代码**；先从 **接口依赖（API）、IM 与事件通道、页面复杂度、包大小与 Spark AIO 构建配置、多语言（Starling 任务归属）、埋点与风险隔离** 6 个维度给出客观对比表，等疆疆拍板后再执行。
2. **先拆清「客户端 Native 容器层」与「前端 Lynx 页面层」**：
   - **容器层**：检查客户端 JSB（如 `business.showLynxPinCard`、`business.isHavePinCard`）是否只管槽位尺寸、倒计时关闭和同槽位互斥替换（如固定传 `name: 'live_goal_pin_card'`）。若容器层通用，优先复用 Native 容器以省去客户端发版改动。
   - **页面层**：逐项核查既有 Lynx 页面的 5 个耦合维度：
     1. 点击按钮是否有强耦合的前置 HTTP 请求（如强依赖 `goal_id` 调 `/webcast/goal/pin_card/action`）？
     2. 实时进度与关闭监听的是哪个客户端事件通道（如 `live_stream_goal_indicator_message` vs `unify_base_module_update_message`）？
     3. 横竖屏文案是否被写死成了原业务文案（如横屏写死 `"Support my LIVE Goal"`）？点击卡片空白处跳转到哪个页面（跳 Live Goal 面板 vs 跳展馆对应礼物详情页）？
     4. 送礼归因 `gift_enter_from` 是否需要独立区分？
     5. 曝光/点击/关闭埋点是否会污染原有业务大盘，或者为了拦截埋点而侵入原业务埋点代码？
3. **按服务端接口与 IM 通道归属拆包，确保原业务底座与原业务埋点 100% 零改动**：
   - 当服务端存在多条触发通道（例如：场景 1 & 2 从 Live Goal 页点 Pin 走 `/webcast/goal/pin/` + `WebcastGoalUpdateMessage`；场景 3 从展馆详情页点 `Pin to LIVE` 走 `/webcast/gift/gallery_pin/` + 展馆中触 IM `GalleryMiddleTouchInfo`）时：
     - **走原业务通道的场景（场景 1 & 2）**：留在原业务包（`live-goal/src/pages/pin`），通过原接口字段（`SubGoal.gift.team_up_mode_gift`）做展示分支，**严禁触碰原业务底座类（如 `SimplePinCard.ts`）或篡改原业务埋点（`livesdk_live_goal_pin_card_*`）**，确保原有的 Gift / SuperFan / Flash / 普通 Gallery Goal 卡片 100% 不受影响；
     - **走新业务通道的场景（场景 3）**：即使视觉长相一样，也应独立放在新业务自己的主包中（如在 `gift-gallery-main` 的 `lynx.config.ts` 与 `spark.config.ts` 新增 `'pages/pin': 'gift_gallery_pin_card'` 入口，由 Spark AIO 自动注册 `spark_page`），实现物理隔离、独立发版、独立监听事件与独立上报埋点。

---

## 3. 技术方案文档评论审核机制 | Doc Comment Review Protocol

1. 使用 `lark-cli drive file.comments list --as user --params '{"file_token":"<doc_token>","file_type":"docx","is_solved":false,"need_relation":true}'` 读取全部未解决评论。
2. **未经疆疆审核不直接发回复**：
   - 将需要回复的评论按「划词位置 + 对方提问 + 代码核查结论 + **1~2 句极简拟回复草稿**」列给疆疆审核；
   - 回复跨端研发（服务端/客户端）时保持极简，只写结论、精确字段名及是否需要对方改动（如 `Keeping existing entrance + gift_id is fine, FE already supports it. No change needed for C3 — only C1 and C2 are needed.`）。

---

## 4. 与 PM / DS 最终确认清单及「先改方案文档、再改代码」铁律 | Final PM/DS Confirmation & Doc-Before-Code Order

`[疆疆 added 2026-11-10]`

1. **多场评审会口径不一时，结合真实代码生成给 PM / DS 的确认清单与可直接复制的飞书消息**：
   - 当产品详评、技术评审、埋点评审三场会的逐字稿对同一模块（如不同入口的 Pin 卡文案、跳转、埋点）说法不一致时，先把三场会的原话对照列清；
   - 结合前端代码里的真实分支（如：① 竖屏文案 vs 横屏受限短文案；② 点击按钮送礼数量与连击留卡表现；③ 点击卡片空白处跳转目标；④ Opt-out 观众点按钮是否弹窗；⑤ 埋点事件与来源区分参数；⑥ 多个 Banner 同时命中时的最高优先级），整理成结构化确认点 + **一段可直接复制发给 PM（并 `cc` DS）的极简编号飞书消息模板**。
2. **方案变更执行顺序铁律：先改完飞书技术方案与 `*-fe-plan.md`，再更新代码**：
   - 拿到 PM / DS / 服务端的最终确认回复并与疆疆敲定方案后，**第一步先更新飞书前端技术方案（中英文同步）与本地/飞书 `*-fe-plan.md`**；
   - 文档更新完成后，**第二步再动手修改各前端包代码**并跑全套单测、Lint、Typecheck、Build 与大屏检查。
