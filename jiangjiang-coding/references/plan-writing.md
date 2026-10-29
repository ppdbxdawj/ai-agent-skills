# AI Coding Plan Writing | AI 编码计划书写规则

Read this when writing an AI coding plan, implementation plan, technical方案, Plan Mode output, or any plan document that will guide an agent to modify code.

写 AI coding plan / implementation plan / 技术方案 / Plan Mode 输出 / 给 agent 执行代码修改的计划文档时读这个。

`[疆疆 added 2026-06-22 (cross-project)]`

> 文档风格（标题不编号、少空行、反 AI 风）见 [`communication-and-docs.md`](communication-and-docs.md)。本文件只管 **plan 的结构、内容和验收闭环**。

## 核心原则 | Core principle

最好的 AI coding plan 不是长篇设计文档，而是 **探索 → 可审阅计划 → 小步实现 → 可运行验证 → 独立复审** 的闭环。

The best AI coding plan is not a long design essay. It is a loop: **Explore → reviewable plan → small implementation steps → runnable verification → independent review**.

- **先探索再计划**：不确定代码结构 / 影响范围时，先读代码和现有模式；不要凭感觉写方案。  
  Explore before planning when scope or architecture is uncertain.
- **先定 done definition**：plan 第一屏要说明什么叫完成，最好带可运行的 pass/fail 信号。  
  Define done up front with a runnable pass/fail signal whenever possible.
- **限制 scope**：明确 non-goals，防止 agent 顺手重构、升级依赖、改无关文件。  
  Bound scope explicitly; prevent drive-by refactors, dependency churn, and unrelated edits.
- **小步可验**：implementation steps 要能一组一组落地和验证，不要写成「重构整个模块」。  
  Steps should be small and independently checkable.
- **验证优先于口头完成**：没有测试 / build / screenshot / API 样例 / 日志证据，就不要说 done。  
  Evidence beats assertion: tests, builds, screenshots, API samples, or logs.
- **重要任务用 fresh review**：plan 复杂或影响大时，实现后用 subagent / code-review 从新上下文复审 diff against plan。  
  For important work, use a fresh-context reviewer to check the diff against the plan.
- **大型 plan 交付前必须审 plan 本身**：大型 / 高风险 / 跨模块 plan 在交给疆疆前，必须先调用 `ce-doc-review mode:headless <plan-path>` 或等价 fresh reviewer，对 plan 的一致性、可行性、scope、风险和验收方式做审查；根据 findings 修订后再交付。  
  For large / high-risk / cross-module plans, review the plan document itself before handing it over, using `ce-doc-review mode:headless <plan-path>` or an equivalent fresh reviewer, then revise before delivery.

## 何时写 plan，何时跳过 | When to plan vs skip

### 应该写 plan

- 新能力 / 新链路 / 新接口 / 新表 / 新 service。
- 跨 2-3 个以上文件或多个模块。
- 有多种技术路线可选。
- 涉及 UI、权限、安全、数据迁移、异步任务、外部系统、部署验证。
- 需求还不清楚，需要先对齐边界。
- 用户明确说「写 plan」「技术方案」「先别写代码」。

### 可以跳过 plan

- 单行 typo、明显小 bug、简单文案替换。
- 用户已经给了非常具体的改动点和验证方式。
- 能用一句话准确描述 diff，且没有外部副作用。

## Plan Mode 行为 | Plan Mode behavior

当用户要求 plan，或任务适合先 plan 时：

1. **只读不改**：先探索文件、调用链、现有测试和约定；不要修改代码。  
   Read-only exploration first; no code changes.
2. **必要时提问**：只问会改变方案的问题；常规默认值自己选并写进 plan。  
   Ask only decisions that change the plan; choose sensible defaults otherwise.
3. **输出可审阅计划**：包含目标、非目标、涉及文件、步骤、验证、风险。  
   Produce a reviewable plan with goal, non-goals, files, steps, verification, risks.
4. **大型 plan 先跑 plan review**：新能力 / 多分支 / 高风险 / 跨模块计划交付前，先用 `ce-doc-review mode:headless <plan-path>` 或等价 fresh reviewer 审 plan 文档本身，并把需要改的点补进 plan。`[疆疆 added 2026-06-22]`  
   Review large/high-risk/cross-module plan documents before delivery and fold required fixes back into the plan.
5. **等疆疆通过**：新能力 / 多分支 / 高风险计划，等 `[通过]` / `确认` 再切到实现。  
   For new/high-risk work, wait for approval before implementation.

## 标准模板 | Standard template

```md
# Plan: <任务名>

## Goal / Done Definition
- 要解决什么问题。
- 用户可观察的最终效果是什么。
- Done 标准：测试 / build / 截图 / API 返回 / 日志 / 监控等。

## Non-goals / Scope Boundaries
- 本次不做什么。
- 不顺手重构什么。
- 不升级 / 降级哪些依赖。
- 哪些历史问题只记录，不在本次修。

## Current State / Code Map
- 关键文件 / 模块。
- 当前数据流 / 调用链。
- 可复用的现有组件 / hook / util / service。
- 需要遵守的项目约定。

## Proposed Approach
- 技术方案摘要。
- 为什么选这个方案。
- 备选方案及放弃原因（短写；长篇调研另开 research doc 再链接）。
- 对接口、状态、数据结构、UI、权限、部署的影响。

## Implementation Steps
- Step 1: 修改 A，目的是什么，如何局部验证。
- Step 2: 修改 B，目的是什么，如何局部验证。
- Step 3: 补测试 / 类型 / 文档 / 配置。
- Step 4: 跑最终验证。

## Files Expected to Change
| File | Change | Reason |
|---|---|---|
| `path/to/file.ts` | ... | ... |

## Verification Plan
- Unit / integration tests: `...`
- Type / lint / build: `...`
- UI verification if applicable: dev server → browser path → screenshot → console errors → cleanup
- API / manual verification if applicable: request sample + expected response
- Regression cases: 旧功能不应变化的点

## Risks / Edge Cases
- 兼容性风险。
- 并发 / 异步 / 状态恢复风险。
- 权限 / 安全 / 数据边界。
- 外部系统或环境风险。
- 回滚方案。

## Review Checklist
- 是否只改 scope 内的东西。
- 是否复用现有模式。
- 是否匹配代码风格。
- 是否有可运行验证证据。
- 大型 / 高风险 / 跨模块 plan 是否已经先跑 `ce-doc-review mode:headless <plan-path>` 或等价 fresh review。
- 是否需要 fresh subagent / code review。
```

## 轻量版本 | Lightweight version

小到不值得写完整文档，但仍需要 plan 对齐时，用四段式：

```md
## Goal
...

## Approach
...

## Steps
1. ...
2. ...
3. ...

## Verification
- `...`
```

## 探索提示词 | Exploration prompt pattern

需要先探索时，可以按这个结构让 agent 工作：

```txt
先不要改代码。阅读相关文件，找出实现这个需求需要理解的模块、数据流、已有模式和风险。
输出 code map、可复用点、可能方案和验证方式。
```

## 计划提示词 | Plan prompt pattern

```txt
基于刚才的探索，写一个 implementation plan。
必须包含：目标、非目标、涉及文件、实现步骤、验证方式、风险。
不要开始修改代码。
```

## 实现提示词 | Implementation prompt pattern

```txt
按 plan 实现。保持改动最小，遵守现有风格。
每完成一组相关改动就运行最小必要验证。
如果发现 plan 不准确，停下来说明差异并更新 plan，不要硬做。
```

## Plan 文档复审提示词 | Plan document review prompt pattern

大型 / 高风险 / 跨模块 plan 交付前必须先跑：

```txt
调用 ce-doc-review mode:headless <plan-path> 审查这份 plan。
重点看一致性、可行性、scope 是否越界、风险是否遗漏、验收方式是否可执行。
把必须修的问题补回 plan，再交付给疆疆。
```

## 验证与复审提示词 | Verification and review prompt pattern

```txt
运行 plan 里的验证命令，给出证据。
然后用 fresh subagent review 当前 diff 是否满足 plan，只报告影响正确性或需求覆盖的 gap，不报风格偏好。
```

## UI plan 补充 | UI-specific additions

涉及 UI 时，plan 的 Verification 必须写清：

- 本地启动方式。
- 要打开的页面 / 路由。
- 核心交互路径。
- 截图点。
- console error 检查。
- 清理要求：关闭浏览器、停止自己启动的 dev server、删除临时截图 / snapshot。

在 `taco_webapp` 中还要遵守项目 CLAUDE.md：先读 `docs/design.md`，完成后用 Playwright MCP 验证。

## Plan 自检 | Plan self-check

交付 plan 前快速自检：

- 这份 plan 是否能让另一个 agent 不看聊天历史也能执行？
- 是否明确哪些文件可能被改？
- 是否有 non-goals 防止越界？
- 是否有可运行验证，而不是「人工看看」？
- 是否把长篇 research 从 plan 里拆出去，只在 plan 里链接？
- 是否符合疆疆文档风格：标题不编号、不过度空泛、不堆 buzzword？

## Eval prompts | 触发测试

这些话应该触发本 reference：

- 「先写个 plan，不要改代码」
- 「给我 implementation plan」
- 「这个新功能怎么做，先出技术方案」
- 「Plan Mode 里先分析一下」
- 「把 AI coding plan 写规范点」

这些话不应该触发完整 plan，只需要直接做或轻量说明：

- 「修一下这个 typo」
- 「把这个文案改成 X」
- 「这个 import 排序一下」

## Sources | 来源

本规则基于 2026-06-22 查询与总结的 Claude Code 官方实践：

- Claude Code Best Practices: Explore first, then plan, then code; verification signals; context management.
- Claude Code Common Workflows: Plan before editing; delegate research to subagents; worktrees / testing recipes.
- Claude Code Skills: reusable workflow instructions as skills.
- Claude Code Subagents: use fresh context for research and review.
