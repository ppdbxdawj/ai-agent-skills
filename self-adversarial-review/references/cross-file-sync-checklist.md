# Cross-File Sync Checklist | 重大方向变更同步清单

When the user initiates a major direction change — e.g., "改成 50 万字" (length pivot),
"换个主角性格" (persona shift), "去掉后宫线" (subplot removal), "改成轻喜剧调性" (tone pivot) —
a single file edit is almost never enough. Multiple downstream files reference the original
direction and will silently fall out of sync, creating contradiction bugs that surface later.

This checklist defines what to update, in what order, and how to verify.

## When this checklist applies

Apply this when **any** of the following is true:

- Total length / chapter count changes (e.g., 100w → 50w)
- Volume / chapter structure changes (merge / split / reorder volumes)
- Main character core trait changes (e.g., 软化 → 不软化, 复仇 → 救赎)
- Antagonist identity changes
- Genre / tone pivots
- Target audience pivot (e.g., 番茄 → 晋江, 男频 → 女频)
- Romance / harem cadence changes
- Tech anchor type changes (e.g., AI → 仙侠)
- Project status pivot (drafting → on-hold, novel-first → drama-first)

## Pre-flight check

Before touching any file, do these three things:

1. **Read the change request precisely.** "50 万字" might mean "exact 50w" or "around 50w".
   Confirm the exact target with the user before propagating.
2. **List the affected files.** Use `grep` / `Glob` on the original number / structure /
   character name to find every reference. Do not rely on memory.
3. **Snapshot the largest doc as `-archive`.** If the change is irreversible-looking (e.g.,
   complete outline rewrite), archive the previous version per
   `version-snapshot-protocol.md`.

## Sync order (top-down)

Update files in this order. Each file should reference the upstream change so future readers
understand the lineage.

### Tier 1: Source of truth (update first)

The single file that defines the new direction. Examples:

- `outline-v2.md` (story outline) — rewrite or up-version
- `IDENTITY.md` (agent / persona definition)
- `PROJECT.md` if it owns the canonical decision

The Tier 1 file should explicitly state: "**2026-MM-DD direction change**: from X to Y. See
changelog at the bottom."

### Tier 2: Project / scope metadata (update second)

Files that describe project shape and constraints:

- `PROJECT.md` — update `target_length`, `target_words`, `genre`, `target_audience`, `status`,
  `hard_rules` that reference the changed number / structure
- Project-level `memory.md` — add "Locked decision: ..."
- Any `*-config.yaml` / `*-config.json`

### Tier 3: Sub-document plans (update third)

Files that describe execution under the new direction:

- Chapter-level beats (`ch01-ch03-beats.md`) — update chapter ranges
- Character files that reference chapter numbers / volume names
- Skill enablement lists if any skills become irrelevant

### Tier 4: Per-chapter / per-scene drafts (update last)

Already-written content:

- Existing chapter drafts — usually preserved, but their `next_pass` field should mention
  the new direction
- Continuity log — add a "direction change" entry

### Tier 5: Shared memory (always update)

- Workspace-level `memory/YYYY-MM-DD.md` — add a timestamped decision entry
- Long-term `MEMORY.md` index if the decision is durable
- Run the memory indexer if applicable (e.g., `openclaw memory index --agent <id>`)

## Verification pass

After sync, verify by running a cross-reference search:

```bash
# Find any lingering reference to the OLD value
rg "old-target-length-value|old-volume-count" <project-root>

# Find any place where the changelog mentions the NEW value but the body doesn't
rg "from .* to <new-value>" <project-root>
```

Expected outcome: every match is either intentional (in archives, changelogs, comparison
tables) or in a file you've already updated.

## Example: 100w → 50w length pivot

For 《AI 判我不可加冕》's 2026-05-28 length change, the actual sync was:

| Tier | File | What changed |
|---|---|---|
| 1 | `outline/outline-v2.md` | Rewrote as v3 (130 章 / 7 卷). Archived old as `outline-v2-100w-archive.md`. |
| 2 | `PROJECT.md` | `target_length` 250 → 130; `target_words` added 500000; `genre` 超长篇 → 中长篇; `hard_rules` 每卷章数 / 单男主戏份 / 前六代日志 三条改写; 完更承诺整段重写 |
| 2 | `series/.../memory.md` | Added locked decision; updated changelog |
| 3 | `outline/ch01-ch03-beats.md` | 序卷 Ch001-015 → Ch001-010; 章末梗点候选范围收缩 |
| 3 | `_world/characters/wang-fu-stub.md` | 七夫入场章号全改; 单男主戏份 5-10 → 2-4 章; 外围男配 5-8 → 3-5 位 |
| 4 | `chapters/ch001-v0.2.1.md` | 不变（章节序号未变，内容未变）|
| 5 | `workspace/memory/2026-05-28.md` | Added timestamped entry |
| 5 | `openclaw memory index --agent main` | Run (failed with fetch error, retry later) |

Total files touched: 7. Each cited the upstream change in its own changelog block.

## Anti-patterns

1. **Updating only the outline** — leaves PROJECT.md and character files inconsistent.
   Future reads will pull contradictory numbers depending on which file is opened.
2. **No archive of the old version** — for irreversible changes, the previous version is lost.
3. **No timestamped memory entry** — six weeks later, no one will remember why the project
   shape changed.
4. **Skipping verification** — old number references will leak into new prose, creating
   "internal contradictions" that confuse readers / future agents.
5. **Synchronous edits without user confirmation on tier 1** — getting the source of truth
   wrong forces redoing all 5 tiers. Confirm the target before propagating.
