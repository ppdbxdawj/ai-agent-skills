# Stage 4: 切分支按 Plan 开发实现与验证 | Branch & Implement from Plan

`[疆疆 added 2026-10-30]`

当疆疆在完成前端技术方案与 `<feature>-fe-plan.md`（Stage 3）后，明确指示「从远端 master 最新的切一个分支出来开发，根据 plan」时，严格按本文件执行。  
Follow this file strictly when 疆疆 asks to cut a new branch from the latest `origin/master` and implement the code according to `<feature>-fe-plan.md`.

---

## 1. 前置动作：从最新 `origin/master` 切出独立分支 | Cut Feature Branch

1. 在仓库根目录执行：
   ```bash
   git fetch origin master && git checkout -b feat/<feature-slug> origin/master
   ```
   - 若方案/Plan 中已约定分支名（如 `Reference` 表中的 `Branch name`），优先使用该分支名；否则按 `feat/<feature-slug>` 命名。
   - 确认 `git status -sb` 指向新分支且跟踪 `origin/master`。

---

## 2. 严格按 `<feature>-fe-plan.md` 实施代码 | Implement Strictly per Plan

1. **遵守范围边界（Respect Non-goals）**：
   - 严格只修改 `*-fe-plan.md` 中「预期改动文件」表列出的文件。
   - 「不做的部分（Non-goals）」中声明不改的包、不手改的生成目录（如 `src/lang/`、`src/typings/idl/`）、不升级的 `package.json` / 锁文件，一律不碰。
2. **分步落地、IDL 工具拉取与未决项默认值处理（Step-by-Step + IDL Codegen + Safe Defaults）**：
   - 按照 `*-fe-plan.md` 的「第一步 ～ 第 N 步」顺序逐项实现。
   - **【IDL 变更必须用命令拉取生成，严禁手写类型文件】**：当服务端已在 `org/api_idl` 提了分支/MR（可通过 `git ls-remote --heads git@git.example.com:org/api_idl.git` 或 `internal-cli codebase mr list -R "org/api_idl"` 查到分支名）时，修改包内 `sab.config.js` 的 `tools.idl.repos[].branch` 指向该分支，执行 `rushx idl`（即 `sab-kit idl`）自动生成 `src/typings/idl/` 下的 TS 类型并对接真实字段（若 `rushx idl` 顺带更新了其他无关 proto 文件，只保留本次涉及的目标生成文件，还原无关文件与 `.idl/` 改动），**严禁手写或手改 `src/typings/idl/`**。`[疆疆 added 2026-11-04]`
   - **【核对客户端 JSB 一层转写】**：涉及客户端 JSB（如 `business.sendGiftV2`）向服务端接口（如 `/webcast/gift/send/`）透传字段（如 `gift_enter_from`）时，需同时核对前端传给 JSB 的顶层字段（如 `eventData.giftEnterSource`）与 `eventData.extra` 字段（如 `extra.gift_enter_from`），并提醒服务端确认客户端转写后服务端是否实际收到该字段。`[疆疆 added 2026-11-04]`
   - 对于技术方案中尚待 PM / UXW / Server 最终回复的项（如正式 Starling key、可选协议字段），先按 `*-fe-plan.md` 中约定的**默认行为或英文文案 fallback** 实现，保证主链路逻辑完整可运行，绝不因为等一个文案 key 而留空半截代码。
3. **代码质量自检与静态验证（Verification Gate）**：
   - 跑完 `*-fe-plan.md` 定义的验证命令：
     - 包级检查：`rushx doctor`、`rushx lint`、`rushx typecheck` / `rushx verify`
     - 大屏/折叠屏适配检查（Lynx 项目必跑）：`node scripts/large-screen/check.cjs --base origin/master`
   - 区分**本次改动引入的错误（New Errors — 必须 100% 清零）**与**仓库既有历史错误（Pre-existing Issues — 如实汇报，不顺手乱改无关文件）**。

---

## 3. 回写 `## 实施记录与待确认` 并同步飞书 | Update Implementation Log & Sync

1. 在本地 `<feature>-fe-plan.md` 的「风险与边界情况」之后、「自检清单」之前，新增或更新 **`## 实施记录与待确认（MM-DD）`** 章节：
   - 记录当前切出的分支名与基线 commit（如 `feat/<slug> @ <sha>`）；
   - 记录实际跑过的验证命令与结果（doctor / lint / typecheck / large-screen check）；
   - 用一张三列表格（`事项 | 等谁 | 结果回来后前端要做的`）把剩余待 PM / Server / Client 确认的点收口，写清**对方回复后前端具体改哪一行/哪个参数**。
2. 若 `lark-cli` user 登录态有效，同步用 `lark-cli docs +update --as user --doc <FE_PLAN_DOC_ID> --command overwrite --doc-format markdown` 将更新后的 `*-fe-plan.md` 同步到飞书上的 `FE Plan` 文档。
3. **Git 状态停留点**：
   - 除非疆疆明确要求 `commit` / `push` / 部署 PPE，否则停留在**「新分支已切好 + 代码已按 Plan 实现 + Lint/验证已通过 + Plan 实施记录已更新」**状态，向疆疆汇报改动文件清单与待确认收口表。
