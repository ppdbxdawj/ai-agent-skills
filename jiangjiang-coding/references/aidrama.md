# aidrama | TikTok 短剧 pipeline 项目规则

Read this when working on `~/Desktop/tt/aidrama/`，TikTok 海外短剧、Seedance reference image 模式、Gate A→H pipeline、ModelArk 调用。

`[疆疆 added 2026-05-25 (cross-project archive)]`

> 配套 skills（命中具体能力时先读）：
> - `~/.cursor/skills/seedance-video` — Seedance API 调用
> - `~/.cursor/skills/aigc-drama-pipeline` — 完整 Gate A→H 流程
> - `~/.cursor/skills/novel-to-storyboard` — 分镜 → prompt
>
> 本文件只列 jiangjiang-coding 视角的硬偏好。

## Seedance 默认 reference image 模式 ★★★

- **不用首尾帧模式**，全程用 reference image 模式
- **严禁改参考图角色外观**："any alteration to reference characters strictly prohibited"；每一段都用提供的参考图保持角色一致性
- 角色被改 → 立即 push back 重生

## 时长结构

- **1 min = 4×15s**
- **30 s = 2×15s**
- 段长**严格对齐 Seedance 上限**；不要凑成 3×10s 这种不规范分段

## 画幅 / 语言

- **9:16 竖版**（不是 1:1）
- TikTok 国际向：**字幕 + 配音必须英文**
- 会话级语言切换：疆疆说 "must use english" 时本会话单语英文（与 [`SKILL.md §1 会话语言 override`](../SKILL.md#1-沟通--communication) 一致）

## API endpoint / 模型

- **走 ModelArk**，endpoint `ark.ap-southeast.bytepluses.com`
- **不要打 Taco**
- 只传 Seedance 相关字段，不要带无关参数
- 模型 ID：`SEEDANCE_MODEL=dreamina-seedance-2.0-260128`
- 视频生成参数走 `.env.ark`（密钥处理见 [`pitfalls.md`](pitfalls.md#密钥处理--secrets--credentials)）

## TOS / CDN fallback

- 下载 Taco TOS：`<internal-cdn-domain>` 不通时**试 `<mirror-cdn-domain>` 镜像**
- 域名 fallback 链：`<primary-cdn-domain>` → `<mirror-cdn-domain>`

## Pipeline 完整性 ★★★

- **完整 Gate A→H**：创意 → 剧本 → Seedance prompt → 出片
- **不接受手写 prompt 抄近路**；疆疆会问"你有完整地走 pipeline 么？"
- 数据库当次实验**不保存**（验证 pipeline 用，落库另说）

## 范围克制

- **疆疆说"一条 30s / standalone"时，禁止自动扩成系列 Bible / 多集接口 / EP02–EP05 占位**
- 被纠正时立刻收范围（push back 信号极强："等一下？谁说我要做多集了？？我只做 30s 的"）

## 产物落地

- API 跑完后视频、末帧、CSV **自动 download 到 `output/`**（与 SKILL.md §2 通用规则一致）
- 声称已完成被追问"下载了吗"要能补做

## 1080p 拼接（如需）

最终拼接走 1080p；具体调参在专用 seedance-video skill。

## 待补充

<!-- 疆疆 后续口述加在这里 -->
