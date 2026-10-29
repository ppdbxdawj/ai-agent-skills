# Agent / 天机站 / 多 agent 工作流 | 项目规则

Read this when working on `~/Agent/`（含 **天机**、**八角(短视频)**、**aigc-video**、**top-drama** 多个并行子项目），多 agent 公司化工作流、`agent/memory.md` 协议、飞书桥接、玄学产品（天机）。

`[疆疆 added 2026-05-25 (cross-project archive)]`

## 工作区隔离 ★★★

- **天机 / 八角(短视频) / aigc-video / top-drama 文档、skill、团队不混**
- 每个子项目自己一套 doc / skill / agent；跨项目复用要显式 import / link，不要"反正都在 Agent repo 里就一起用"
- 引流账号 ≠ 产品站；账号矩阵分清楚

## 多角色团队工作流（"公司"模型） ★★★

疆疆把 agent 组织成"公司"：

- 多个角色（CEO / 产品 / 设计 / 研发 / 运营 / 秘书等）每个一个 agent
- **每版交付 → 全员大会 → 执行 → 再大会 → 循环**
- **秘书** 负责组织会议、保留纪要、推进任务，**少依赖主 agent 逐步唤起**
- 没开"全体大会"前不要直接执行 — push back 信号："等一下，你没开全体大会就执行了"

## `agent/memory.md` 协议

- 路径固定 **`agent/memory.md`**
- **只追加**，按**日期分区**（`# 2026-05-25`），中文优先
- **有价值的内容自动写入，不必每次确认**
- 阶段性总结也写进来作为自我学习材料

> 这套是 Agent 项目的 memory 协议，与 jiangjiang-coding 自身的 §4 自更新协议**互不替代**。jiangjiang-coding 是 agent 行为偏好；`agent/memory.md` 是项目内决策日志。

## 项目讨论文档 → Skill 化

- 讨论沉淀的内容（`@tianji/*.md` 等）按需安装为 agent skill
- 跨项目通用条目应该回写到 jiangjiang-coding（按 §4.2 routing），不要只留在项目 memory

## 玄学产品（天机）风格

- **神秘 + 东方美学**
- **去 AI 味文案**（参见 [`communication-and-docs.md` 风格 / Anti-AI](communication-and-docs.md#风格--anti-ai)）
- **responsive 双端**
- **反对灰蒙 + hover 才亮**：首页可读性优先，不要靠悬停才能看清主信息

## 产品交付清单

完成后要走完才汇报创始人：

1. **本地启动**
2. **自测全功能**（不只看页面，要点完核心路径）
3. **截图审核循环**（截图 → 自查 → 改 → 再截图）
4. 通过后才汇报

跳步骤 = 嘴炮（参见 SKILL.md §2 "声称完成的事必须有落点"）。

## 飞书桥接

- 用户在飞书发消息 → 长连接转给主 Agent 输入
- 主 Agent 处理完后**回给同一用户**（不要群发 / 不要回错人）
- 飞书 bot id / secret 走 `.env`（参见 [`pitfalls.md` 密钥处理](pitfalls.md#密钥处理--secrets--credentials)）

## 热点采集（aigc-video）

- **小红书 + 抖音双跑**
- 报告含**链接 + 分镜 / 创意分析 + 可下载 top N**
- 能力缺失（没采集器）→ 先装 / 写 skill 再交付（参见 [`pitfalls.md` 能力缺失：先补工具](pitfalls.md#能力缺失先补工具再交付)）

## TikTok MCP

- 技术栈 **TypeScript**
- 参考 **小红书 MCP** 内嵌 JSON 的方案

## top-drama 项目

- docs 三件套（**主线 / 主角 / 配角**）作为后续基准

## 面向非中用户思考

- 产品对外用户多为非中文 / 非中团队
- 文案、UI、案例不要默认中国语境

## 待补充

<!-- 疆疆 后续口述加在这里 -->
