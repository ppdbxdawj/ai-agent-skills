# Stage 6: 埋点评审对齐与埋点全量落地 | Tracking Review & Event Implementation

`[疆疆 added 2026-11-09]`

当疆疆给出埋点评审会逐字稿与飞书埋点文档链接（如 `sheets/...?sheet=pg4jYt`），要求查看埋点改动方案、补充客户端埋点协作项或全量落地埋点代码时，严格按本文件执行。  
Follow this file strictly when 疆疆 provides the event tracking review transcript and Feishu tracking spreadsheet to align and implement tracking events.

---

## 1. 拉全埋点表格并与评审逐字稿交叉对账 | Cross-Check Sheet vs. Transcript

1. **使用 `lark-cli sheets` 完整读取埋点表（严禁漏读右侧列）**：
   - 先调 `lark-cli sheets +workbook-info --as user --spreadsheet-token "<token>"` 获取子表 `sheet_id` 与行列范围；
   - 再调 `lark-cli sheets +csv-get --as user --spreadsheet-token "<token>" --sheet-id "<sheet_id>"` 读取数据；
   - **【防漏读铁律】**：检查返回 JSON 中的 `current_region`（例如 `A1:T131`）。若第一次只读了 `A1:P131`，**必须再读一次 `K1:T131` 覆盖全列**——因为最核心的 `param取值`（枚举值定义）、`备注`、`埋点触发时机` 都在 `Q~T` 列，漏读会导致枚举值靠猜出错！
2. **逐字稿与埋点表逐项交叉对账（识别表格残留与跨端边界）**：
   - **识别会上已拍板删掉但表格未同步删的字段/事件**：例如会上已决定不埋某参数（如中触 `with_gallery_goal`）或复用原有页面埋点不再新增事件（如 FAQ 规则页），但 DS 会后尚未从表格删掉。必须明确标出并提醒 DS 更新表格，防止埋点 QA 按旧表验收提假 Bug。
   - **严格区分上报端（`FE` vs `Client`）**：
     - 标为 `FE` 的事件/参数由前端在对应 Lynx 包中通过 `app.sendLogV3` 或 `IndicatorEventLogger.send` 实现；
     - 标为 `Client` 的事件/参数（如客户端送礼成功 `livesdk_send_gift`、礼物面板原生气泡 `livesdk_gift_panel_beacon_bubble`）归入客户端协作项。

---

## 2. 客户端协作项同步至飞书技术方案并 `@` 双端开发 | Sync Client Items & Mention Owners

1. **在飞书前端技术方案中补充 `Client` 协作表（中英文同步）**：
   - 在 `Event Log / 埋点方案` 章节用 `<cite type="doc" doc-id="<sheet_token>" file-type="sheets">` 挂载埋点文档链接，并写明前端与客户端各自负责的埋点序号；
   - 在 `TBD / 待确认点` 下新增 `<h2>Client</h2>` 表格（编号 `C1, C2...`），写清客户端负责的埋点事件名、新增参数名与枚举值、以及前端通过 JSB（如 `business.sendGiftV2`）透传给客户端的字段契约。
2. **反查真实客户端开发并 `@` 到文档**：
   - 通过 `bytedcli --json meego workitem get --url "<meego_url>" --fields '["_all"]'` 读取 `[iOS]` 与 `[Android]` 角色的真实负责人邮箱；
   - 用 `lark-cli contact +search-user --as user --query "<email>"` 查出 `open_id`；
   - 在 `Reference / 参考` 表的 `iOS` / `Android` 行、`Event Log / 埋点方案` 正文及 `Client` 表的 `Owner` 列中，使用 `<cite type="user" user-id="ou_xxx"></cite>` `@` 两位客户端开发。

---

## 3. 送礼新渠道 `gift_enter_from` 三方闭环检查 | `gift_enter_from` Tri-Party Loop

当埋点表为新场景定义了新的 `gift_enter_from` 值（例如展馆众筹 Pin 卡送礼定为 `'gallery_pin_card'`，以区分于 Gallery Goal Pin 卡的 `'gallery_goal_pin_card'`）时，必须同时检查三方闭环：
1. **前端（FE）**：在对应送礼调用点将 `eventData.giftEnterSource` / `giftEnterMethod` / `giftEnterPage` 及 `eventData.extra.gift_enter_from` 设为该新枚举值；
2. **服务端（Server）**：若服务端有「有效送礼计值渠道白名单」，必须提醒服务端将该新枚举值加入白名单，否则会出现「埋点报对了但服务端不累计业务进度」的严重断层；
3. **数仓（DW / DS）**：提醒 DS/数仓将该新枚举值纳入对应业务营收统计表。

---

## 4. 前端埋点代码落地、全量复查与表格单元格评论 | FE Tracking Implementation, Full Audit & Sheet Cell Comments

`[疆疆 updated 2026-11-10]`

1. **注意点位生命周期与去重**：
   - 页面级/组件级 `show` 埋点注意防止重复曝光；
   - **同一按钮切换状态时加状态守卫防误报**：例如详情页主播侧按钮在 `Pin to LIVE` 与 `Unpin` 之间切换时，`livesdk_gift_gallery_gift_pin_button` 的 `show` 与 `click` 必须加 `!pinState.isPinned` 判断，仅在按钮为 `Pin to LIVE` 时上报，切勿在点击 `Unpin` 时误报为 `Pin` 点击；
   - 弹窗 `leave` 埋点的 `duration` 注意核对单位（表格要求单位是**秒**还是**毫秒**）；
   - 从外部 Deep-link（如 `gift_panel_beacon_bubble` / `gift_tray`）直接打开详情半屏时，首次打开报外部来源，若用户在同会话内关掉详情半屏回到展馆主页再点开其他礼物，来源应切回 `'main_page'`。
2. **全量地毯式埋点复查（Event-by-Event Audit）**：
   - 当疆疆要求「埋点整体检查下是否有遗漏」时，重新拉取埋点表最新 revision 与表格上的全部评论（`lark-cli drive file.comments list --params '{"file_token":"<sheet_token>","file_type":"sheet"}'`），逐事件、逐字段核对：
     1. 每个必传参数在对应触发时机下是否真能从当前上下文或 IM 消息中拿到？
     2. 若单条增量 IM 消息可能省略公共字段（如 Pin IM 省略 `class_type`），是否已回退读取 Store 缓存（如 `IndicatorStore.getState().classType`）兜底？
     3. 当同一埋点事件被多个入口共用（如 `livesdk_gift_gallery_gift_pin_card` 同时覆盖 `entrance = 'gallery_goal'` 与 `'gift_gallery_detail'`）时，各入口下无法获取的跨端字段（如 Goal IM 无展馆段位 `class_type`）是否已向 DS 和服务端透明说明？
3. **把需要提醒 DS / 服务端的事项直接评论到埋点表格对应单元格**：
   - 使用 `lark-cli drive +add-comment --as user --doc "<sheet_url>" --block-id "<sheetId>!<Col><Row>"` 在具体参数所在单元格（如 `pg4jYt!K81`、`pg4jYt!Q103`）添加局部评论并 `@` 对应负责人；
   - **CLI 参数避坑**：`--content` 数组里的每个 `{"type":"text","text":"..."}` 元素严禁只传纯空格字符串（如 `" "`），否则会被 `lark-cli` 校验器以 `requires non-empty text` 拒绝；连续 `@` 多人时直接相邻放置 `mention_user` 元素即可。
4. **`sab-kit logger` 强校验包必须跑 `rushx logger`**：
   - 若目标包（如 `giftgallery-indicator`）使用 `sab-kit logger`（存在 `src/shared/logger/overwrite.ts` 与 `src/shared/logger/sdk/events.ts`），在修改 `overwrite.ts` 的枚举类型后，**必须执行 `rushx logger`** 重新生成 `sdk/types.ts` 和 `sdk/events.ts` 的 `_oneOf([...])` 校验器，否则运行时新增枚举值会被旧 validator 拦截。
5. **验证与文档同步**：
   - 运行涉及包的 `rushx lint`、`rushx typecheck`、单测及根目录 `node scripts/large-screen/check.cjs --base origin/master`；
   - 将埋点落地情况更新回本地 `<feature>-fe-plan.md` 并同步至飞书 `FE Plan`。
