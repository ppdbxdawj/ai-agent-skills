# AIPet / AIEvoPet | 项目规则

Read this when working on `~/Desktop/tt/AIPet/`（也叫 AgentPet / AIEvoPet 桌宠项目），lifecycle / stats / walk、记忆日记系统、像素风资产、商店、AI 图素材、开源运营。

`[疆疆 added 2026-05-25 (cross-project archive)]`

## 三原则（产品北极星）

| 原则 | 含义 | 不做 |
|---|---|---|
| **免费** | 全功能免费 | 无内购 / 无订阅 / 无 Pro 包 |
| **专属每个人** | 首启个性化、记忆可见 | 不全局通用化 |
| **情感成长** | 陪伴 / 共鸣 | 非 RPG 等级、不堆数值 |

## 定位

- 全民 **AI 陪伴桌宠**，目标高 star 开源
- **Skill 只蹭 SEO**，核心是宠物本身
- 体验底线：**极简启动**（30s 有宠物、零账号、少弹窗）；像 **QQ 宠物**

## 差异化

- **可视化 agent / 大模型交流器**：宠物自写日记、自改 memory
- 启动可绑 **Qwen**（疆疆方向）

## 记忆 / 日记 系统

- **跨天对比式记忆**（"昨天体重 1.2kg → 今天 1.3kg"这种）
- **主动召回进 MVP**，召回由 LLM 决定，**不加阈值**
- **当天对话全量留存，日终总结后再销毁**
- 不接受"只记高价值 event 导致日记空"的退化

## 资产策略

- **本地 / 批量 AI 生图**，**尽量少图**
- **像素风**统一画风
- 疆疆的工作流：**Seedream 批量出图 + 本地文件夹导入**
- 资产 CSV：单列 `prompt`（与 [`architecture-and-data.md`](architecture-and-data.md#资产输出--数据导出--asset-output-formats) 通用规则一致）；小物件**与 IP 解耦**、全物种通用；摆位先居中再按 slot；一 prompt 多图随机
- 提醒 / 招呼可用**表情包 / 贴纸**，不必全靠 rig 动画

## 商店

- **非固定货架**：LLM 按心情 / 价格在池子里选
- **实物图由疆疆提供**

## MVP 裁剪（v0.1）

包含：lifecycle + stats + walk + 基础照料 + Wardrobe v1
**不**包含：打工 / 商店 / 配对 / 小游戏（后续版本）

## 系统级行为

- **窗口主屏最上层**
- **全屏 app** 需 `FullScreenAuxiliary`（objc ffi）
- **多屏要收到强提醒**：Cute **teleport 到当前屏**，不 Dock 常跳
- **拖拽喂养 B**，面板**瘦身**，对话**不放面板**

## 动画

- 后期参考 Codex：**混合路线 B**（过程式 idle + sprite 高光）

## 开源运营

- 项目名 **AIEvoPet**
- **零字节系字眼**（不暴露内部信息）
- AI 图诚实披露 + **CC BY 4.0**
- README 中英双语，突出差异 + 配图 + 引导 star / issue / MR / 共建语气
- `docs/` 可 ignore lint（详见 [`live-revenue-monorepo.md`](live-revenue-monorepo.md#已生效规则) 对应通用规则）

## 待补充

<!-- 疆疆 后续口述加在这里 -->
