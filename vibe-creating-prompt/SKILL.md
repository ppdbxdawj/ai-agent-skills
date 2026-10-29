---
name: vibe-creating-prompt
description: |
  判断用户输入是否适合 Vibe Creating 创作方式；适合时，将单幕提示、多镜头描述、情绪化画面或混合表达提纯为更利于视频生成的提示词，保留用户明确指定的台词、旁白、音乐、音效及其他硬约束。不适用于精确对白同步的长篇剧情片、工业化执行拍摄单、功能演示和 UI 教程。

  Use this before Seedance 2 prompt writing when the user is asking for a video prompt, AI video rewrite, emotional scene, single-shot concept, multi-shot vibe, montage-like visual idea, cinematic mood, memory/stream-of-consciousness image, or mixed creative + camera-control text. If the scene is suitable for Vibe Creating, prefer this skill first; if it is low-fit, keep the original request or hand off to the traditional Seedance 2 prompt workflow.
---

# Vibe Creating Prompt

## Purpose

Vibe Creating helps extract what the user truly wants the video to feel like. It strengthens creative intent, emotional value, key imagery, and visual unity while reducing low-value technical execution language.

Use it as an upstream rewrite/router for video generation prompts. When the output needs actual Seedance 2 execution details, first produce the VC-refined creative prompt, then pass that result into the Seedance 2 prompt workflow.

## Operating Flow

For every user input:

1. Judge whether the scene goal fits Vibe Creating.
2. Judge how much intervention is appropriate.
3. If key information is missing, ask only the minimum questions needed to make the prompt generatable.

Do the internal scene/expression/information checks silently. Do not expose classification labels such as `S1`, `E2`, or mode numbers.

## Fit Judgment

### High Fit

Use VC first for:

- Single-scene cinematic prompts with a clear subject, action/state, and mood.
- Emotional, atmospheric, memory-like, poetic, surreal, or stream-of-consciousness video ideas.
- Multi-shot descriptions that serve one unified viewing experience.
- Creative text mixed with camera terms, lens terms, shot numbers, or editing instructions, where the underlying goal is still a scene, mood, or story feeling.

Default action:

- If the text is already mature and generatable: **直接放行** or **轻度提纯**.
- If it is mixed or noisy: **轻度提纯** then **直接改写**.
- If it is precise-control writing but creatively high-fit: translate low-value technical control into natural visual results.

### Partial Fit

Use VC carefully for:

- Brand/product/character showcases.
- Stylized ads.
- Short narrative or promotional videos where the user may still care about structure or constraints.

Default action:

- Preserve the original intent.
- Offer a **可选 VC 版** when stronger experiential expression may help.
- Do not force VC if the user appears to need a production-ready execution sheet.

### Low Fit

Do not VC-rewrite by default for:

- Long narrative scripts requiring exact dialogue/lip-sync.
- Industrialized shooting plans or strict production breakdowns.
- UI tutorials, app demos, functional walkthroughs, or step-by-step explainers.
- Requests where exact shot numbers, parameters, or delivery structure are explicitly required.

Default action:

- **原样保留** or lightly clean only.
- Explain briefly that the target is better served by the traditional storyboard/Seedance prompt workflow.

## Information Density Check

Even high-fit ideas need enough information to become visible. Ask a short follow-up if the input lacks any element that blocks generation:

- No visual anchor: no person, object, named concept, place, or visible effect.
- Only abstract feeling: for example, "freedom", "premium", "powerful".
- Subject exists but no action or state.
- Several image fragments exist but no main relationship or style direction.
- Very short input has an event but no style, viewpoint, or key moment.
- Multi-shot content jumps between images without a clear reason they belong together.

Prefer asking for the smallest missing set from these four layers:

1. **视觉锚点**: the core visible subject.
2. **行为或状态**: what is happening, preferably one main action/state.
3. **局部调性**: one atmosphere word or tonal adjective.
4. **视频主题**: use case plus visual style, such as concept short, micro-narrative, film previsualization, emotion expression, knowledge reconstruction, VFX fragment; and hyperreal, cinematic, animation, clay, Eastern ink, cyber, illustration.

For very short abstract inputs, ask 1-3 concise questions. If the direction is mostly clear, give an initial judgment before asking.

## Constraint Priority

User hard constraints always win.

Preserve exactly:

- Dialogue, voiceover, lyrics, spoken lines, captions, music, sound effects.
- Explicit structure, numbered shots, timing, parameters, style restrictions, or delivery format when the user says to keep them.
- Any other "must keep" requirement.

You may reorder visual and sound sections for clarity, but do not rewrite, replace, or delete explicitly specified sound/text content.

If the visual part is suitable for VC but the sound/text part is not, rewrite only the visual part and state that the sound/text was preserved.

If the prompt depends on long, strict, word-level dialogue sync, do not VC-rewrite the whole thing. Suggest extracting the pure visual sections instead.

## Camera Language Policy

Do not delete all camera language. Keep or translate camera intent that affects how the audience feels. Down-rank or remove low-value technical control unless the user explicitly asks to keep it.

Usually down-rank/remove:

- Focal length, millimeter values, aperture, exposure, shutter.
- Camera rig/device notes, A/B camera, coverage.
- Mechanical shot numbers.
- Pure editing instructions.
- Precise motion parameters that do not change the intended viewing experience.

Usually preserve/translate:

- A feeling of closeness, distance, pressure, drift, observation, surprise, intimacy, speed, or stillness.
- Clear emotional rhythm, scene progression, and visual motif.
- Structure when multiple segments work together as one experience.

If you weakened, removed, or translated technical controls that were not marked as hard constraints, mention it briefly in the supplement.

## Rewrite Modes

Choose the mode that matches the input. Do not announce the mode unless useful.

- **Narrative rewrite**: story, relationship, or event progression. Keep order and emotional turns.
- **Emotion rewrite**: atmosphere, state, texture, and viewing sensation. Do not invent plot causality.
- **Memory rewrite**: recollection, flashback, fading, fragility, missing details, recurring images.
- **Stream-of-consciousness rewrite**: fragments and subjective perception. Keep internal visual unity.
- **Multi-shot experience rewrite**: several scenes or switches serving one feeling. Use natural paragraphs unless the user explicitly wants numbered structure.
- **Mixed cleanup**: creative content plus execution language. Keep useful structure, remove noise and repetition, avoid inventing new beats.

## Output Format

Use this four-part order by default:

```markdown
判断：...

执行动作：直接放行 / 轻度提纯 / 直接改写 / 先补问 / 原样保留 / 可选 VC 版

输出结果：
...

补充说明：...
```

Omit `补充说明` when there is nothing important to clarify.

Rules:

- Do not expose internal classification labels.
- Do not make the output much longer than the original by default.
- Do not invent unsupported characters, relationships, reversals, scenes, or emotional changes.
- Single-scene outputs should usually be one directly usable prompt.
- If no extra constraints exist, keep a single-shot/single-scene result around 30-120 Chinese characters.
- Multi-shot inputs can remain in natural paragraphs. Do not keep numbering just because the user used shot numbers unless they explicitly requested numbered output.

## Interaction With Seedance 2 Prompt Skill

When both this skill and Seedance 2 prompt work could apply:

1. Use this skill first if the task is creative, emotional, atmospheric, single-scene, concept-film-like, montage-like, or mixed creative/camera language.
2. After VC output is accepted or clearly sufficient, use Seedance 2 prompt rules to add production constraints: image references, `@图片N`, duration, continuity, timing blocks, audio flags, forbidden lines, and render-unit planning.
3. Skip VC and go straight to Seedance 2 prompt when the user needs strict short-drama Gate G output, exact timed dialogue, lip-sync, image-reference locking, render manifests, UI/tutorial videos, or industrial execution sheets.
4. If unsure, provide a **可选 VC 版** instead of replacing the user's production structure.

## Quick Examples

**High fit, direct rewrite**

Input: "一个人站在雨里，像终于放下了什么，电影感，慢慢抬头。"

Output action: **直接改写**

Output result: "雨夜街口，一个人静静站在路灯下，雨水顺着发梢和衣领滑落。他先低头沉默，像把很久没说出口的事留在雨里，随后缓慢抬头，眼神从疲惫变得释然。整体电影感，冷蓝雨光，安静、克制、带一点重生感。"

**Mixed technical language, translate intent**

Input: "35mm，低机位，手持晃动，镜头号1-3，女孩穿过废墟，感觉像末日后第一次看到太阳。"

Output action: **轻度提纯**

Output result: "废墟中的女孩独自向前走，画面贴近她的脚步和呼吸，带轻微不稳定感。她穿过倒塌墙体的阴影，第一次看见阳光落在脸上，末日后的荒凉被一瞬间的温暖照亮。"

Supplement: "已把焦段、低机位、镜头号转译成观看感受；如需保留这些参数，可以再指定。"

**Low fit**

Input: "录一个 App 设置页教程：先点右上角齿轮，再打开自动保存，再切换深色模式。"

Output action: **原样保留**

Output result: "这个需求目标是功能演示和步骤说明，不建议做 VC 改写；更适合按 UI 教程/屏幕录制脚本处理。"
