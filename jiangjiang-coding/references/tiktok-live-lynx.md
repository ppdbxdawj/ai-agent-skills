# TikTok LIVE ReactLynx | 直播间与营收 Lynx 容器规则

Read this when working on TikTok LIVE ReactLynx 2 / ReactLynx 3 packages under `live_revenue_monorepo` (such as `subspaces/tiktok_live_lynx/*`, `subspaces/tt_live_lynx_giftgallery_indicator/*`, `subspaces/live_goal/*`, `packages/apps/tiktok_live_lynx/*`, `subspaces/fan-club/*`, `subspaces/gtm/*`, `subspaces/vault/*`).

`[疆疆 added 2026-11-19]`

> Monorepo 通用工具链（`rushx`、`git refresh-branch`）见 [`live-revenue-monorepo.md`](live-revenue-monorepo.md)；跨项目 Protobuf3 零值与状态引用陷阱见 [`pitfalls.md`](pitfalls.md)。

---

## 1. 包与构建入口存活前置核验（防改死代码）

monorepo 中大量老包正在向 ReactLynx 3 / Spark AIO 拆包迁移，旧包源码常保留在原目录但已从构建入口移除（例如 `gift-gallery/src/pages/index` 已迁至 `gift-gallery-main`，`live-goal/src/pages/faq` 已迁至 `live-goal-minor`）。

**摸底或修改任何页面前必查两处**：
1. 打开该包 `lynx.config.ts` / `sab.config.js` 核对 `source.entry`（或 `pack.pages`），确认目标页面仍在活跃构建入口中；
2. 核对 `spark.config.ts` 的 `pageKey`（必要时用 `internal-cli spark-platform link get --link-key <spark_page>` 查线上生效 URL），确认线上实际加载的 Gecko Channel 指向当前包。

---

## 2. 直播间中触（Indicator）与共享宿主容器避坑

`[疆疆 added 2026-11-10, updated 2026-11-23]`

1. **展开态组件的 `onStateComplete` 严禁只挂在 `expanded === true` 分支下**：
   - 直播间中触基于 `IndicatorMultiStateComponent` 同时挂载 24px 收缩帧（`expanded={false}`）与 60px 展开帧（`expanded={true}`）。
   - 当客户端容器触发频控抑制展开时，只有 `expanded={false}` 实例被激活。若在 `componentDidUpdate` 中写 `if (!this.props.expanded) return;`，会导致 `onStateComplete` 永远不触发，中触整场直播卡死在过渡状态。必须无论 `expanded` 为何值均按 `message?.id !== previousState.message?.id` 启动完成定时器，并在收到新 `message.id` 时先 `clearTimeouts()`。
2. **收到非中触 UI 的旁路 IM（如 Pin / Unpin `timing = 11 / 12`）必须提前 `return`，且严禁在此之前判 `bool` 显隐开关**：
   - 若某条 `GalleryMiddleTouchInfo` 仅用于驱动外部组件（如唤起/关闭直播间 Pin 卡，本身不带完整的展馆点亮数），处理完旁路副作用后必须立即 `return`，严禁继续进主 `IndicatorReducer.onMessage` 覆盖底数；
   - 严禁在旁路提前 `return` 之前判 `msg.show_gallery_mid_touch === false`——Protobuf3 `emitDefaults` 会将局部旁路包里未赋值的 `bool` 序列化为 `false`，前置判断会误把正常显示的中触隐藏掉。
3. **共存同一 `MiddleTouch` 宿主容器时卸载严禁调 `app.unsubscribeEvent`**：
   - `giftgallery-indicator` 与 `live-goal-indicator` 作为动态子卡运行在同一个 `MiddleTouch` LynxView 容器内，`app.unsubscribeEvent` 按宿主 `containerID` 全局生效。子卡在 `componentWillUnmount` 中**只能调用 `GlobalEventEmitter.removeListener`**，严禁调用 `app.unsubscribeEvent` 把同房间其他业务卡监听的转屏/关窗原生事件一并退订。
4. **内部轮询合成消息保留业务激活态**：
   - 周末 24h 倒计时 `onPoll` 等前端自发构造消息调 `IndicatorReducer.onMessage` 时，必须从最新 Store 透传保留 `isTeamUpActive` 等当前周期状态字段，防止被 `Boolean(undefined)` 冲成 `false`。
5. **子卡需临时隐藏但保留房间后台监听时，必须发 `CARD_HIDE` 而非 `CARD_REMOVE`**：
   - 宿主 `MiddleTouch.doRemove`（`unify_base_module_remove_self`）会把子卡从 `renderList` 与 `backendRenderList` 彻底删除，导致房间内后续 `UNIFY_BASE_ACTION_REFRESH` 直接 `404` 丢弃，观众端 Pin 卡唤起、转屏重建与中触恢复全部失效；
   - 应改发 `CARD_HIDE`（`live_lynx_goal_indicator_event_destory_self`）触发 `MiddleTouch.doHide` 移入 `0x0` 的 `backendRenderList` 后台保活，事件监听不断；后续需恢复上屏时调 `publishShowSelf`（`live_lynx_goal_indicator_event_show_self`，参数须带 `currentKey: cardId`，`publishStart`/`publishStop` 同理）即可切回可见队列。`[疆疆 added 2026-11-23]`

---

## 3. 跨容器 Pin 卡协同与横竖屏旋转重建

`[疆疆 updated 2026-11-23]`

1. **跨容器通信与旋转恢复**：
   - 中触与直播间 Pin 卡运行在两个独立的 LynxView 容器中，跨容器通信统一走 `app.publishEvent` + `app.subscribeEvent` + `lynx.getJSModule('GlobalEventEmitter').addListener`（注意先同步 `addListener` 再 `await subscribeEvent`，避免异步订阅窗口漏掉早期事件）；
   - 客户端在横竖屏旋转（`goal_pin_card_orientation_changed`）时会销毁 Pin 卡容器，需在中触侧监听并在卡片未过期、未被手动关闭时重调 `business.showLynxPinCard`（用最新进度更新 `contentInfo` 快照）。
2. **顶替 Pin / 乱序 `UNPIN` 校验与 30s 时间窗过期重置**：
   - 主播在 30s 内用新礼物 B 顶替旧礼物 A 时，服务端异步下发的旧卡 `UNPIN` 往往晚于新卡 HTTP 响应到达。处理 `UNPIN` 前必须校验 `incomingUnpinId === lastShownPinId`，不匹配时直接忽略，防止清空新卡状态；
   - 判断是否为同一张活跃 Pin 卡（`isSameActivePin`）时，必须同时校验 `lastShownPinEndTime * 1000 > Date.now()`——确保 30s 内点 `×`（或送不可连击大礼成功自动 `app.close()` 时同步广播 `lynx_pin_card_manual_closed`）后转屏不重弹，而 30s 自然到期后再次 Pin 同一礼物时观众端能正常弹新卡。
3. **共享 Pin 卡槽位跨业务互顶时，严禁清空被顶替方的 `lastShownPinKey`**：
   - 多个业务共用同一客户端 Pin 卡槽位（如 `'live_goal_pin_card'`）时，当业务 B（如 Goal Pin）顶替业务 A（如展馆众筹 Pin），业务 A 只能关闭转屏重弹开关（`dismissReopen`），**必须保留 `lastShownPinKey` 与 `lastShownPinEndTime`**；
   - 若直接 `resetState()` 清空 `lastShownPinKey`，原 30s 窗口内任意一条携带 `pin_gift_info` 的礼物进度 IM 都会被误判为“新一次 Pin”，反把业务 B 的在显 Pin 卡劫持顶掉。`[疆疆 added 2026-11-23]`
4. **Pin 卡送礼区分可连击小礼与大礼，关窗前必须校验送礼真实成功**：
   - 可连击小礼物（`giftType === 1`）传 `clientShowComboButton: true` + `comboOffsetX / comboOffsetY` 并**保持 Pin 卡常驻**，以便观众边连击边看卡片实时 `+1` 进度；
   - 非连击大礼物必须 `await business.sendGiftV2` 且确认 `res?.code === 1 && !res?.data?.errorCode` 后，再广播 `lynx_pin_card_manual_closed` 并调 `app.close()`，严禁在 0 币余额不足拉起充值面板时提前销毁 Pin 卡。`[疆疆 added 2026-11-23]`

---

## 4. 原生弹窗层（`x-overlay-ng`）层级与高度边界

`[疆疆 added 2026-11-19]`

1. **`<Sheet container="SparkPopupViewController">` 内严禁用 `position: fixed` 或在 `<scroll-view>` 内挂二级半屏**：
   - Lynx 中 `position: fixed` 相对于底层根 `LynxView` 定位；若父组件已在原生 `<x-overlay-ng>`（如详情半屏 `<Sheet>`）内，子组件写 `fixed` 会画在原生弹窗**背后**而完全不可见；写在 `<scroll-view scroll-y>` 内则会被滚动视口裁剪。
   - **正确做法**：二级半屏/规则弹窗移出 `<scroll-view>`，作为固定高度根容器的同级末尾子节点挂载，外层遮罩用 `position: absolute; top/left/right/bottom: 0; zIndex` 铺满半屏（或走带 `container="SparkPopupViewController"` + 更高 `overlayLevel` 的 `Dialog/Sheet`）。
2. **70% 半屏内的子抽屉禁用大像素 `minHeight`**：
   - 在高度本身只有 `0.7 * screenHeight` 的半屏内，若子面板设 `minHeight: '480px'`，在 `< 685pt` 屏幕或分屏模式下 `minHeight` 会撑破父容器把顶部返回按钮 `<` 顶出上边界裁掉。一律改用百分比 `height: '85%', maxHeight: '100%'`。
3. **`<Sheet forceMount>` 关闭时重置内部弹层状态**：
   - 保活不卸载的 `<Detail>` 在 `isVisible` 从 `true` 变 `false` 时，必须主动重置内部所有子弹窗 visible state，并在异步 `await` 读取缓存后复查 `this.props.isVisible`。

---

## 5. Lynx 双向 RTL 陷阱（`lynx-rtl` vs `x-overlay-ng`）

`[疆疆 added 2026-11-19]`

1. **开启 `direction: 'lynx-rtl'` 的容器内严禁再手写互换左右 `margin`**：
   - `direction: 'lynx-rtl'` 会自动镜像 `flex-row` 方向并自动互换 `marginLeft` 与 `marginRight`。若内部再写 `marginLeft: isRtl() ? '0px' : '8px', marginRight: isRtl() ? '8px' : '0px'`，会被引擎二次翻转导致元素间距变成 `0px` 贴死碰撞。保持固定正向间距即可。
2. **iOS `>= 34.8` 的 `x-overlay-ng` 内手写 `row-reverse` 必须显式锁 `direction: 'ltr'`**：
   - 当工程开启 `customCSSInheritanceList: ['direction']` 时，iOS `>= 34.8` 的 `<x-overlay-ng>` 会自动注入 `direction: rtl`。若内部组件使用手写 `flexDirection: rtl ? 'row-reverse' : 'row'`，组件根节点必须显式加 `direction: 'ltr'`，否则会在 RTL 下二次反回 LTR。

---

## 6. 客户端 Native 转发 IM 剥离新 Proto 字段防御

`[疆疆 added 2026-11-19]`

- 直播间不少实时消息（如 `live_stream_goal_indicator_message` 的 `GoalUpdateMessage`）由客户端 Native 解码 Webcast IM Protobuf 后再转给 Lynx。
- 当服务端在 `.proto` 新增字段（如 `GiftSubGoal.team_up_mode_gift = 5`）而用户客户端内置 proto 尚未升级时，Native 转发出的 IM 对象会把未知字段剥离为 `undefined`。
- **防御铁律**：前端在合并同目标增量 IM 更新或转屏重绘卡片时，若旧状态对应项已从 HTTP 接口拿到 `true` 而新 IM 对象中该字段为 `undefined`，必须自动继承保留 `true`，防止首条进度 IM 到达后 UI 瞬间退化回旧模式。

---

## 7. Starling 多语言扫描、插值与半成品 ICU 复数兜底

`[疆疆 added 2026-11-19]`

1. **静态扫描字面量约束与降噪**：
   - 所有 `I18n('...')` / `I18n.t('...')` 必须直接传**字符串字面量**（条件分支写在外部：`cond ? I18n('a') : I18n('b')`），严禁传变量 `I18n(keyVar)`；跑完 `sab-kit i18n` 后检查 `git status`，还原未改动页面的无关 `src/lang/*` / `TUXSheet` 噪音。
2. **带参数插值严禁误调单参 `createI18nLegacy`**：
   - 在 `live-goal` 等同时挂载 `I18n('key')`（`createI18nLegacy` 单参查表）与 `I18n.t('key', params)`（`i18next` 插值）的包中，凡是带 `{s_xxx}` 占位符的词条**必须调 `I18n.t(key, params)`**，误调 `I18n(key, params)` 会忽略第二参数直接把字面量 `{s_xxx}` 渲染上屏。
3. **Starling 半成品期缺 `other` 分支的 ICU 复数兜底**：
   - 多语种翻译进行中时，阿语（`ar`）、英式英语（`en-GB`）等语种常先导出只有 `zero {...}` 或 `one {...}`、缺少 `other {...}` 的复数串。调用复数工具必须用 `handlePlural(text, { num: n, s_num: n })`（不能用不传 `num` 的 `getText`），且 `handlePlural` 在 `pluralWord` 与 `'other'` 均未命中时必须按 `['one', 'many', 'few', 'two', 'zero']` 兜底取首个非空分支，严禁把原始 `{num, plural, ...}` 源码暴露给用户。

---

## 8. ReactLynx 3 布局与 `@tiktok-arch/tux-react-lynx/tailwind-preset` 样式避坑

`[疆疆 added 2026-11-20]`

1. **`@tiktok-arch/tux-react-lynx/tailwind-preset` 声明了 `presets: []`，禁用 `.flex-1` / `.flex-shrink-0` / `.shrink-0` / `.gap-*`**：
   - 在引入该 preset 的包（如 `gift-gallery-main`）中，Tailwind 默认 preset 被切断，编译产物 `template.js` 的 CSS 表中**完全不存在** `.flex-1`、`.flex-shrink-0`、`.shrink-0`、`.gap-*`。
   - **修复铁律**：需要自适应伸缩时，严禁依赖 `className="flex-1"` 或内联简写 `style={{ flex: 1 }}`（ReactLynx 3 会把内联 `flex: 1` 错编为 `flex-basis: 0px; flex-grow: 0` 导致宽度/高度塌陷为 `0px`）；统一写显式长属性 `style={{ minWidth: 0, flexShrink: 1, flexGrow: 1 }}`（纵向用 `minHeight: 0`）或在 `.scss` 中声明 `flex-grow: 1; flex-shrink: 1; flex-basis: 0px;`。
2. **Lynx `<view>` 默认是 `display: linear`（纵向线性布局），不是 Web 的 `block`**：
   - 任何横向排列容器必须显式带 `flex flex-row`（或 `display: 'flex', flexDirection: 'row'`）；
   - 带 `overflow-ellipsis` / `text-maxline` 的 `<text>` 严禁套在无 `flex`、无宽度的空 `<view>` 包装层内（否则在 `display: linear` 自动宽度盒子里会塌陷为 `0px` 不可见）；多行居中/对齐 `<text>` 显式加 `w-full`（`width: '100%'`）。
