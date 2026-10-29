# Version Snapshot Protocol | 分版本快照协议

For any creative or design iteration, never overwrite the previous version. This file defines
the naming and archival rules so the user can compare and roll back.

## Why this matters

In creative work, the previous version is part of the artifact. The agent's job is to make
the next version, not to delete the last one. Overwriting kills the user's ability to:

- Compare prose / structure between versions
- Roll back if iteration goes wrong
- Diff what the new version actually changed
- Train on or learn from the failure modes of earlier drafts
- Audit which model / which session produced which version

## Naming convention

### Within a single piece (chapter, scene, section)

Use semantic version suffixes:

- `<slug>-v0.1.md` — first draft (rough, structure-only)
- `<slug>-v0.2.md` — major rewrite (节奏 / 镜头 / 信息量重做)
- `<slug>-v0.2.1.md` — minor patch on v0.2 (single targeted edit, e.g., 章末加钩子)
- `<slug>-v0.3.md` — another major rewrite
- `<slug>-v1.0.md` — locked, ready to ship / publish

Examples seen in production:

```
chapters/
├── ch001-v0.1.md           # GPT first draft
├── ch001-v0.2.md           # Claude polish — rewrote pacing
└── ch001-v0.2.1.md         # Claude minor patch — added chapter-end hook
```

### Across a major direction change (outline rewrite, scope pivot, length change)

When the change is so large that the new version doesn't share the structure of the old one,
**archive the old version** with a descriptive suffix:

```
outline/
├── outline-v2.md                       # Current — 50w / 130 章 v3 inside
├── outline-v2-100w-archive.md          # Archived — 100-200w / 300 章 (老版本，仅供对照)
└── outline.md                          # Legacy v1 (35 章 first sketch, kept)
```

The `-archive` suffix signals: this is no longer canon, but it's preserved for reference.

### File frontmatter

Every versioned file should have a frontmatter block that includes:

```yaml
---
id: <project>-<slug>-v<version>
chapter: <number, if applicable>
status: v0.2.1
drafted_by: <model name or "human">
based_on: <previous-version-filename, if applicable>
last_updated: YYYY-MM-DD
pass_focus: <what this version specifically improves>
---
```

The `based_on` field is what lets future readers reconstruct the lineage even if a file is
moved or copied.

## When to bump major vs minor

| Change | Bump |
|---|---|
| Targeted single-issue patch (e.g., add chapter-end hook only) | v0.2 → v0.2.1 |
| Pacing / rhythm rewrite while preserving plot | v0.2 → v0.3 |
| Plot structure change (insert / remove scene, change ending) | v0.x → v0.(x+1) major |
| Locked, ready to publish / ship | v0.x → v1.0 |
| Direction change (length, audience, genre) | new file + archive old as `-archive` |

## When NOT to create a new version

Sometimes you really do want to modify in place — for example, fixing a typo or correcting
factual error. Heuristic:

- **No version bump** if the change is < 5 words and clearly a fix (typo, fact error).
- **Bump to v0.x.(y+1)** for anything larger.
- When in doubt, bump. Disk is cheap; version loss is not.

## Self-check block in the file

Every versioned file must end with a self-check block. Template:

```markdown
## v0.2.1 self-check | 自检

- **Based on**: <previous-version>
- **Pass focus**: <what this version targeted>
- **Word count**: <number, vs hard rule range>
- **Hard-rule conformance**: <list each rule and ✅ / ⚠️>
- **Toxicity check**: <scanned for project-specific red lines>
- **Next-pass owner**: <who / what model should do the next iteration>
- **Open items for next pass**: <bulleted>
```

The self-check is the **single most useful artifact** for the next iteration. Without it, the
next reviewer has to re-derive what's already known.

## Anti-patterns

1. **Editing `ch001.md` directly without a version suffix** — loses the previous version forever.
2. **Renaming the new version on top of the old filename** — same problem, harder to notice.
3. **No `based_on` field in frontmatter** — lineage becomes unrecoverable after a rename.
4. **No self-check block at file end** — forces next reviewer to re-discover known issues.
5. **Snapshot proliferation** — saving every 10-word edit as a new version. Bump only on
   meaningful change (see "When NOT to" above).
6. **Archive without marker** — renaming old version to `outline-old.md` instead of
   `outline-...-archive.md`. The `-archive` suffix is a contract; "old" is ambiguous.

## Recovering a lost version

If a version was overwritten:

1. Check git log if the repo is version-controlled.
2. Check the user's editor history.
3. Apologize, snapshot the current state immediately as a placeholder version, and continue.
   Do not pretend nothing happened.
