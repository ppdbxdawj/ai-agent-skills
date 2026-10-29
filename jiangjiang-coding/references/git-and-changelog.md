# Git & Changelog | 疆疆 习惯

Read this when 疆疆 mentions commit / push / rebase / PR / changelog.

## 启动条件 | When to act

- 只在疆疆**明确说**了「提交 / commit / push / rebase」之后才执行 git 操作。
- 之前停在「改完 + 跑过 lint」的状态即可。
- **不擅自 rebase / 拉远端**：哪怕看到 `origin/master` 落后了，也别主动跑 `git fetch origin && git rebase`。疆疆经常说"后面我自己来 rebase"。`[疆疆 added 2026-05-25 (from history)]`

## Commit message

- conventional 前缀（`feat` / `fix` / `refactor` / `docs` / `chore` 等），scope 写实际范围（`taco_webapp`、`taco`、`taco_gift_agent`）。
- **新功能用 `feat`，不要用 `docs`** — 哪怕只是新加了个文档但本质是给新能力做交付，也归 `feat`；`docs` 留给纯文档改动。`[疆疆 added 2026-05-25 (from history)]`
- **body 单行 ≤ 100 字符**（commitlint 会卡，曾经因超长被 reject）。
- 多行 message 用 HEREDOC：

```bash
git commit -m "$(cat <<'EOF'
feat(taco_webapp): collapse TTSeedream settings and simplify AI workflows home

Make TTSeedream4.5 settings collapsible on Community Gift v2.
Remove unwired mock UI from the AI Workflows listing page.
EOF
)"
```

## 推送 message 总结写法 | "总结所有 commit" 模式

疆疆有时会要求："推送用的 message 是总结所有 commit 的，方便我 merge"。这种场景：

- 主动 `git log <base>..HEAD` 看本分支自分叉以来的所有 commit。
- 输出**功能维度的整体总结**，不是逐 commit 翻译。
- 重点：「这个分支整体在做什么 + 关键决策」。
- 如果最后补 changelog / 收尾 commit，commit subject 也要体现这一轮所有提交的一句话总结，方便后续 squash 时直接拿来当总 commit message；不要写成 `docs:` / `chore:` 这种只描述收尾文件类型的标题。`[疆疆 added 2026-06-02]`

## 双语 changelog

每改一个 app 的行为，都同时改：

- `subspaces/taco/apps/<app>/CHANGELOG.md` — 中文要点
- `subspaces/taco/apps/<app>/CHANGELOG-EN.md` — 英文要点

格式：

- 在文件**最上方**加日期 section（例如 `# 2026-05-21`），下面分模块写要点；写「为什么 / 用户感受到的变化」，不写 file list。
- **日期用「当天」**，不要把今天的改动追加到旧日期 section 下面 — 之前出过把新改动错放进 04-16 的事。`[疆疆 added 2026-05-25 (from history)]`
- **格式参考已有记录**：写之前看一眼对应 app 已有 changelog 的写法，保持 section 标题层级、bullet 风格、术语一致；不要另起新文档 / 新格式。`[疆疆 added 2026-05-25 (from history)]`
- **行为被改回 / 来回调整时保留 changelog 历史**：在最新日期追加新条目（"恢复成 X" / "再次改回 Y"），**不要删掉**之前那次变更的记录 — changelog 是变化轨迹，不是当前状态快照。代码里相关的注释、日志文案要清掉，但 changelog 留住。`[疆疆 added 2026-05-25 (from history)]`

## 完整发布流程 | End-to-end release flow

疆疆说「提交并推送」时，agent 默认走完整链：

1. `rushx _phase:lint` 确认 clean
2. `git status` / `git diff` / `git log -8` 并行自检，确认只有任务相关文件
3. 改了行为 → 同时更新双语 changelog（按上节）
4. （如有需要）`git refresh-branch` 或 `git fetch origin master && git rebase origin/master`
5. `git commit`（HEREDOC，body ≤ 100）
6. `git push`，重写过历史就用 `--force-with-lease`
7. 必要时建 MR（`<internal-gitlab-domain>` 走 GitLab UI）

`[疆疆 added 2026-05-25 (from history)]`

## Rebase 习惯

monorepo 已有全局 alias `git refresh-branch`（master → rebase origin → 删旧分支 → 同名 -b 重出）；要刷新分支直接用，不要手敲整串命令。详见 [`live-revenue-monorepo.md`](live-revenue-monorepo.md#git-refresh-branch-alias)。

**整理分支时只保留自己的 commits** — rebase / cherry-pick 整理历史时把别人的 commit 剔掉，只留疆疆这条线的；merge 别人代码进来不算自己的 commit。`[疆疆 added 2026-05-25 (from history)]`

手动版：

```bash
git fetch origin master
git rebase origin/master
# 解冲突
git push --force-with-lease    # 历史被重写就用 --force-with-lease，避免误盖远端
```

注意：

- **不用裸 `git push --force`**。
- 推送前 `git status` / `git diff` / `git log -8` **并行**发，不要串行。

## Hook 失败处理

如果 commit 被 hook（commitlint / pre-commit）reject：

- **不要 amend** — 改完之后建一个**新 commit**。
- amend 仅在以下都满足时考虑：疆疆主动说要 amend、HEAD 是当前会话刚提交的、还没 push 出去。

## 暂存范围

- 只 `git add` 与本次任务相关的文件。
- **commit 范围精确到文件**：疆疆经常会说"只提交 `X.ts`、`Y.md`"，要严格按列表 stage，不要"反正都改了一起带上"。`[疆疆 added 2026-05-25 (from history)]`
- 默认**不**带：
  - `*.docx`、临时分享 markdown、`.env`、未跟踪的本地 docs
  - **`.cursor/`、`*.code-workspace`、IDE / 工作区配置文件** — 这些是个人环境，不进版本控制。`[疆疆 added 2026-05-25 (from history)]`
- 提交前主动 `git status` 自检，发现无关文件不动它。

## 待补充 | To be filled

<!-- 疆疆 后续口述加在这里 -->
