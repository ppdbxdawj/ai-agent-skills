# Stage 5: 技术方案评审复盘与服务端/客户端 IDL 对齐 | Tech Review & IDL Alignment

`[疆疆 added 2026-11-09]`

当疆疆在完成首版代码开发（Stage 4）后，给出服务端/前端技术评审会逐字稿、要求重新拉取服务端 IDL 检查是否够用、评估跨包组件是否能复用、或要求查看/回复技术方案文档评论时，严格按本文件执行。  
Follow this file strictly when 疆疆 provides tech review transcripts, asks to re-pull and evaluate Server IDL changes, evaluates component reuse across packages, or reviews tech design comments.

---

## 1. 服务端 IDL 多轮迭代拉取与精确评估 | Server IDL Pull & Completeness Check

1. **查看服务端 IDL MR 最新 Diff**：
   - 使用 `internal-cli codebase mr view -R "org/api_idl" <MR_IID>` 与 `internal-cli codebase mr diff -R "org/api_idl" <MR_IID>` 查看最新 Version 的 proto 改动。
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

## 2. 跨包组件/页面复用评估原则（不强行复用） | Component Reuse Evaluation

当评估某功能（如展馆众筹 Pin 卡）能否复用既有包页面（如 `live-goal/src/pages/pin`）时：

1. **先拆清「客户端 Native 容器层」与「前端 Lynx 页面层」**：
   - **容器层**：检查客户端 JSB（如 `business.showLynxPinCard`、`business.isHavePinCard`）是否只管槽位尺寸、倒计时关闭和同槽位互斥替换。若容器层通用，优先复用 Native 容器以省去客户端发版改动。
   - **页面层**：逐项核查既有 Lynx 页面的 5 个耦合维度：
     1. 点击按钮是否有强耦合的前置 HTTP 请求（如强依赖 `goal_id` 调 `/webcast/goal/pin_card/action`）？
     2. 实时进度与关闭监听的是哪个客户端事件通道（如 `live_stream_goal_indicator_message` vs `unify_base_module_update_message`）？
     3. 点击卡片空白处跳转到哪个页面（如跳 Live Goal 面板 vs 跳展馆对应礼物详情页）？
     4. 送礼归因 `gift_enter_from` 是否需要独立区分？
     5. 曝光/点击/关闭埋点是否会污染原有业务大盘？
2. **给出诚实方案，不强行硬塞**：
   - 若页面层冲突严重，明确列出上述冲突矩阵，对比「在中触层做协议桥接 + 页面轻量分支」与「拆独立轻量页面」的利弊，让疆疆拍板，不盲目硬塞。

---

## 3. 技术方案文档评论审核机制 | Doc Comment Review Protocol

1. 使用 `lark-cli drive file.comments list --as user --params '{"file_token":"<doc_token>","file_type":"docx","is_solved":false,"need_relation":true}'` 读取全部未解决评论。
2. **未经疆疆审核不直接发回复**：
   - 将需要回复的评论按「划词位置 + 对方提问 + 代码核查结论 + **1~2 句极简拟回复草稿**」列给疆疆审核；
   - 回复跨端研发（服务端/客户端）时保持极简，只写结论、精确字段名及是否需要对方改动（如 `Keeping existing entrance + gift_id is fine, FE already supports it. No change needed for C3 — only C1 and C2 are needed.`）。
