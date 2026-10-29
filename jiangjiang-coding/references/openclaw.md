# openclaw / AIGC Drama | 项目规则

Read this when working on `~/openclaw/` (AIGC short drama production), 八角笼 publish flow, Seedance prompts for drama, IP 调研, 数字人 IP design, or top-drama writing.

`[疆疆 added 2026-05-25 (cross-project archive)]`

> 配套 skills（命中具体能力时优先读）：
> - `~/.cursor/skills/screenwriting-master` — 剧本结构 / 节拍
> - `~/.cursor/skills/novel-to-storyboard` — 小说 → 分镜 → Seedance prompt
> - `~/.cursor/skills/seedance-video` — Seedance API 调用
> - `~/.cursor/skills/seedream-image` — Seedream 出图
>
> 本文件只列 jiangjiang-coding 视角下需要 agent 长期记住的硬偏好。

## 八角笼 publish 流程（每集必走）

每集出片后必须真实跑过"八角笼 QA"再发布，**不能口头说通过**。流程含：

- **3s 抓人**：开头 3 秒钩子真测过
- **完播率检查**：节奏不拖
- **TikTok 发布说明**：caption / hashtag / 首评 / 跨集回复 / 主页导流（差异化、激情、突出名场面）
- **首评 + 置顶**：跨集置顶回复要差异化 + 激情 + 突出名场面，含"去上一集评论回复"，**不要模板化**
- **连载语境**：剧集逐步放出，文案不能假设全集已在主页

被疆疆问"走八角笼了吗"时必须能回答每一项做过 / 没做。

## Seedance prompt 规则

`[ ★★★ 全部反复 push back 过 ]`

- **禁止用"或"**：有备选就**新增独立版本**，不在同段写分支
- **连续 Seg 同 prompt、多角色一起生成**：禁止"独立片段生成 → 后期拼接"
- **`@图片n` 全剧 / 全系列编号统一**：先全部角色再物象；同一人始终同一序号；每 seg 从 1 起算只是局部引用，全局编号不变
- **不能跳中间层**：原始分镜 → CD-storyboard → Seedance prompt 的链路不能跳过 storyboard / CD-storyboard 直生 prompt
- **prompt 正文禁人名**（语音台词除外）；禁止项合并到末尾"禁止块"
- **台词默认"说出来"**：内心独白仅 storyboard 明确标注；禁 `(VO)` / `内心:` 这种标签写法
- **音乐段落 Seedance 不生成 BGM，只保留 SFX**；音乐后期配
- **Seedance 禁词**："高潮"等易触发审核的词
- **第一帧人脸只要求每集 Seg1**：用于整集开头 3 秒留存；Seg2+ 不再写"第一帧必须有人脸 / 首帧有人脸"，只要求 3 秒内有清晰主体动作、核心物象或情绪承接。`[疆疆 added 2026-06-01]`

## 服装 / 角色一致性

- **服装锁定**：有变化要详细描述；总述写"全片段禁止换装"
- **动物 / 吉祥物角色永远用 base 图**；人类可按场景换装但**体型不变**
- **拟人 / CG 角色**用"角色 / 材质高光 / 外观造型一致"；禁真人皮肤、生理细节、不适用的真人禁忌项
- **图生视频条件 character 注入**：仅当画面识别到目标 IP 才注入 character 块；未识别则**禁止**套用 `#character_*`

## 视频生成 / 拼接

- **视频 API 用 Ark**（"千万别请求 taco"）
- **批量提交 + 40s 轮询**；相关 seg 可并行
- **连续 seg 末帧续接**：上一 seg 末帧作下一 seg 参考图
- **末帧自动落盘**（参见 SKILL.md §2 "产物自动落盘"）

## 字幕 preset

- **仅对白**；不同说话人不同帧
- **句末去 `.`**（`...` 保留）
- 字号用 **`h*0.042` 比例**而非固定 px（适配多分辨率）
- preset 固化复用（Inter Medium、字号比例、阴影），不要每集重新调
- 封面段不上字幕

## 水印 / 封面

- 水印 **`DCode AI Studio`** + `h*0.042` 比例字号；并入 video pipeline 最后一步
- 封面 `EPISODE X` 拼接：每集前置 0.6s

## 短视频（短剧 / cooper / 程序员等竖屏单条）

- **不油腻**：行为不为露腹肌而露；动作 / 文案贴合场景；与场景物象互动；禁定点摆 pose / 不合理动作（如水下说话）
- **主角台词一律英文**
- **10s 成片**，转场在 4.5–5.5s
- **封面优先有腹肌 / 强视觉帧**（如 4–5s）
- **评论钩子**：引导评论下一场景、逛主页看系列；publish-pack 里也要有

## publish-pack / setting 模板对齐

新内容必须对齐既有金标模板（例如"消防员转休息室"结构）：3s 抓人、转场方案、台词表、Seedance §14、合规禁止项；首评、跨集预告。

## IP 调研

- **6 维度结构** + 配图 + **≥800 字** + 飞书 / docx 排版
- 调研要挖**变现 / 互动 / 火因 / 难点**，不要只做表面 IP 介绍
- humanizer 通读时**保留固定 6 维度框架**，不要为了"更自然"拆掉框架（与 [`communication-and-docs.md` 反 AI 风](communication-and-docs.md#风格--anti-ai) 共用）

## 数字人 IP 设计

- **本人垫图保 IP 归属**
- 参考图 **15–25% 家族基因**
- **神颜 + 拒绝网红脸**
- 单账号**兄妹共用**（不开多账号矩阵）

## BL 剧 / 合规

- 允许 kiss / 欲感名场面
- 合规底线内**不写突破线**

## 内容方向 / 腻梗隔离

- **新剧禁"霸总 / 顶流"同位设定**（已被反复 push back，避免内容同质化）
- 长剧方向 + 数字人项目联动（疆疆口述方向，未硬规则）

## 资产输出

CSV 单列 `prompt`、负向写正文 — 见 [`architecture-and-data.md` 资产输出](architecture-and-data.md#资产输出--数据导出--asset-output-formats)。

## 待补充

<!-- 疆疆 后续口述加在这里 -->
