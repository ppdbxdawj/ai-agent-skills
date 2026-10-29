# idea | 实验 / 调研 / prototyping 项目规则

Read this when working on `~/Desktop/tt/idea/`，SAM 抠图调研、ComfyUI workflow、Seedream 探索（"Seedream 帅哥"等）、community gift 批量脚本、视频分割 / 透明视频实验。

`[疆疆 added 2026-05-25 (cross-project archive)]`

## 性质

idea 是**实验 / 探索仓库**，结论稳定后**回写到正式项目**或抽成 skill。这里的"规则"多为**临时方案**，参考 SKILL.md §2"实验 / 测试代码与生产代码同步"。

## Seedance 提示词语言

- **prompt 主体用中文**（平台理解更好）
- **对白 / 字幕面向海外时用英文**（不是直译，按语义重写）

## 视频抠图（SAM 系列）

- 主体 + 手持物**一起抠**，不要拆开
- **少闪烁**优先于精度（短视频 / 短剧场景帧间稳定 > pixel-perfect）
- 椭圆 / 超椭圆 / blob 等方案需**实测对比**并**更新调研文档**（不要只口述）
- 调研文档放 `docs/research-*.md`（与 [`communication-and-docs.md` 大段调研走独立 doc](communication-and-docs.md#大文档协作节奏) 一致）

## ComfyUI

- **直接给可导入的 JSON workflow**；不要只口述节点名
- 改节点名 / 替换插件时要给完整 JSON，不只 diff

## 透明视频导出

- **mov + ProRes 4444 alpha** 输出
- 最终**不要音轨**（透明视频用作合成层）

## 批量脚本

- **PPE header**（PPE 环境的 cookie / token / X-PPE）
- **顺序请求**（不要并发；rate limit 严）
- **息屏继续跑**：`caffeinate` + `nohup`
- 失败设上限（参见 [`pitfalls.md` API 探测设上限](pitfalls.md#api-探测--联调设次数上限)）

## Seedream 出图（探索）

- **敏感词命中时拆 prompt 重试**（保留主体描述，去掉触发词）
- 默认走 **Ark API**（`.env.ark`），非即梦
- 单列 CSV `prompt` — 见 [`architecture-and-data.md`](architecture-and-data.md#资产输出--数据导出--asset-output-formats)

## 演讲 / 对外英文文档

- 走 **humanizer**（与 [`communication-and-docs.md` 风格 / Anti-AI](communication-and-docs.md#风格--anti-ai) 共用）

## 经验回流

实验稳定后：

1. 抽 skill → 放 `~/.cursor/skills/<topic>/`
2. 写进 reference 或更新 README
3. 通用偏好回写 jiangjiang-coding（按 §4.2 routing）

## 待补充

<!-- 疆疆 后续口述加在这里 -->
