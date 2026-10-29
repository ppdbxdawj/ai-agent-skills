---
name: three-key-doc-writing
description: Applies the Feishu Wiki "写好文档的三个关键（精华版）" for reader-oriented, structured, concise documentation. Use when writing, revising, or reviewing docs for reader fit, information gaps, structure, scanability, concise wording, plain language, or when the user mentions 用户思维, 信息差, 结构化写作, F 型阅读, 极简写作, 说清爽的话, 说大白话, or 文档不说人话.
---

# Three-Key Doc Writing

Source: Feishu Wiki `写好文档的三个关键（精华版）` (`wikcnBANr9LCanDMdoSMs6L3Mcg`).

Keep this skill faithful to that source. Do not add domain examples that are not in the source doc unless the user provides the current document context.

## Core Frame

The source doc says good documents depend on three connected pieces:

1. **了解你的读者**：用户思维 is the guiding principle throughout writing.
2. **写清文档结构**：structure is the skeleton.
3. **写好文档内容**：content is the flesh.

Use this skill as a pass for reader fit, structure, and wording. It pairs well with:

- `technical-doc-writing` for goals, viewpoints, and decision-driving structure.
- `rd-doc-writing` for engineering purpose, problem decomposition, solution derivation, diagrams, and data support.

## 1. 了解你的读者

### 关心读者所关心的

Check whether the draft is written from the author's feature list or from the reader's task.

The source doc contrasts a function-list style with task-oriented headings. Readers usually do not care what each button can do; they care how to complete tasks such as capturing an image, choosing a background, or drawing shapes.

When reviewing:

- Replace feature inventory with reader tasks when possible.
- Ask what the reader came to do.
- Keep labels close to the reader's language.

### 知道读者不知道的

Look for information gaps. The source doc compares this to building a bridge halfway and stopping.

Check whether the draft explains:

- Where the reader starts from.
- What state the reader should be in at each step.
- How the reader can confirm they are in that state.
- Where paths, tags, files, examples, variables, and constants come from.
- How to choose between two similar APIs, concepts, or options.

### 如何了解读者

Use the source doc's channels:

- Talk with users or user representatives.
- Create a document support group with customer support or customers.
- Sit with users and observe their daily work and language.
- Invite users to follow the document while the author observes silently.

Before writing, ask:

- **用户从哪里来**：background, current difficulty or task, starting state, available resources.
- **用户在哪儿**：current state, current directory or environment, how to verify that state.
- **用户到哪里去**：why the information matters, where it will be used, what the next step is.

### 常见信息差

Review for these gaps:

- **术语**：use one term for one meaning; use standard terms instead of team slang.
- **理论与步骤**：link concept docs and how-to docs so theory is not floating and steps are not contextless.
- **变量和常量**：say which values are examples and which must be prepared by the reader.
- **相似选项**：explain how to choose between similar things.
- **新出现的东西**：explain where new paths, files, IDs, or concepts come from.

## 2. 写清文档结构

Readers scan web pages non-linearly, in an F-shaped pattern. If a document has no structure, readers cannot quickly get the main information.

### 常见结构问题

Look for:

- No overall layout.
- Scattered information with weak logical relationships.
- Paragraph-heavy presentation where relationships between ideas are unclear.

### 文档内容结构化

Use structured thinking:

1. Determine the document's components.
2. Put those components in a logical order.

Apply the source doc's principles:

- **结论先行**：put the core view or central idea near the front.
- **以上统下**：upper-level conclusions summarize lower-level details.
- **归类分组**：group related information by a clear standard.
- **逻辑递进**：order information by logical progression.

### 文档呈现结构化

Choose the presentation form based on the relationship:

- **无序列表**：parallel items with no sequence.
- **有序列表**：ordered steps or sequence.
- **表格**：comparison, listing, or organizing multiple fields.

The source doc's point: structured presentation can reduce word count without losing information, and improve reading experience.

## 3. 写好文档内容

The source doc's content principle is **极简写作**: use as few words as possible without losing the original meaning.

This is different from the pyramid principle:

- Pyramid principle builds the structure.
- Minimal writing improves wording and sentence-level expression.

### 说清爽的话

When editing:

- Delete filler and口水话.
- Avoid subjective claims unless backed by concrete data.
- Use simpler expression.
- Use direct verbs instead of noun-heavy phrasing.

Watch for:

- Overused qualifiers such as 一点儿、恰好、大部分、大多数、非常、相当、稍微、多少.
- Redundant synonyms such as 怎样才能 / 怎样才可以, 失败和挫折, 缺点和不足.
- Unnecessary 的.
- Subjective claims such as 显著向好、最好的、最特别的、数一数二的、无可争辩的.
- Complex expressions that can be shorter, such as 由于...的原因 → 因为, 缺乏...的能力 → 不能.

### 说大白话

Prefer:

- Shorter sentences split by punctuation.
- Positive phrasing instead of negative phrasing.
- Active voice instead of passive voice.
- No double negatives.
- Plain words instead of abstract concepts.
- Concrete details instead of vague statements.

When a statement is vague, ask:

- How much did it change?
- Why did it change?
- What will be done next?

### 用图画

Use diagrams when text can state roles and responsibilities but struggles to show interaction, process, or step order.

But do not use diagrams just to decorate. The source doc warns that diagrams should not be big, many, and complete for their own sake. Text and diagrams should complement each other; diagrams show what text makes hard to understand, while details stay in text.

## Review Checklist

- [ ] Is the document about reader tasks, not only author-owned features?
- [ ] Does it explain where the reader starts, where they are, and where they go next?
- [ ] Are terms, variables, constants, paths, and new concepts explained?
- [ ] Can readers scan the document and get the main structure quickly?
- [ ] Does the structure use conclusion-first, grouping, hierarchy, and logical progression?
- [ ] Are lists, ordered lists, and tables used according to the relationship between items?
- [ ] Does wording remove filler without losing meaning?
- [ ] Are subjective claims replaced or supported with concrete data?
- [ ] Are sentences plain, direct, and specific?
- [ ] Are diagrams used to clarify process or relationships, not as decoration?
