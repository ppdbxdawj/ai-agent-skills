# taco_webapp | 前端规则

Read this when touching `subspaces/taco/apps/taco_webapp/`.

## 栈

React + Ant Design (v4 + v5 混用) + Vite。表单常用 `@formily/antd-v5`。

## 国际化 / i18n

用户可见文案统一用 `tr('中文', 'English')`，不要裸字符串。新增组件、按钮、列名、tooltip、message 都要套。

## 路由速查

| 页面 | 路径 | 入口 |
|---|---|---|
| 社群礼物 · 主播信息 | `/data/community-anchors` | `src/pages/lab/studio/anchor-ip/index.tsx` |
| AI Workflows 首页 | `/ai/workflows` | `src/pages/ai/workflows/index.tsx` |
| Community Gift Generation v2 | `/ai/workflows/community-gift-generation-v2` | 同名目录 |

## UI 偏好（疆疆已确认）

- **Collapse 折叠不常改的设置**：例如 TTSeedream4.5 参数面板默认收起；Save / Reload 放在面板 `extra`，按钮 onClick 里加 `e.stopPropagation()` 避免误触发面板展开。
- **Space.Compact 分组行内动作**：行内多按钮按业务子域分组（例如「下载 / 预览」一组、「重试 / 重生成 / 重试同步」一组），不要平铺一长排。
- **按业务域聚合操作区**：与 Records 相关的操作（auto-refresh、批量下载、批量重试、queue 设置）放在 Records Card 内部，不要混进顶部 `Generation Configuration`。
- **不要 quick jumper**：后端 list 接口 `total` 是分页**下界**而非精确 COUNT(*)，加 `showQuickJumper` 会让用户跳到不存在的页。保留 page size 切换 + 上下页即可。详情见 [`pitfalls.md`](pitfalls.md#列表-total-是分页下界)。
- **渐进式展示长任务结果**：重计算 / 批量任务（pipeline、批量重试、统计）能算多少先展示多少，剩下的下次请求时补上 — 不要让用户对着 loading 干等几十秒一次性出全。`[疆疆 added 2026-05-25 (from history)]`
- **旧入口废弃用 `@deprecated` 标注**：旧页面 / 旧路由 / 旧组件被新链路替代时，加 `@deprecated` 注释（含跳转新路径），不要直接删 — 让别人代码里 import 时能看到提示。`[疆疆 added 2026-05-25 (from history)]`
- **批量 / 队列控件布局稳定**：批量操作 bar、queue 设置、auto-refresh toggle 这类一行多控件的区域用**固定宽度 + Collapse 收拢**，避免数据加载时控件换行 / 跳动。`[疆疆 added 2026-05-25 (from history)]`
- **执行中队列不要省略关键对象**：正在执行 / active / current record IDs 这类运维判断信息不要用 `...` / `…` 截断；宁可换行、wrap、tooltip，也要默认完整可见。`[疆疆 added 2026-06-02]`
- **后端语义变了，前端文案同步改**：开关、tooltip、description 必须精确描述当前后端行为；例如 Filter bypass 只跳过 Filter 时，不能继续写 recommend/eval 也 skip。`[疆疆 added 2026-06-02]`

> Lint 与双语 changelog 是通用流程，见 SKILL.md §2 与 [`git-and-changelog.md`](git-and-changelog.md)。

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
