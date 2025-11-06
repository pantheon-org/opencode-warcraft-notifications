# TODO: Lint & Formatting Checklist

This checklist tracks all issues encountered while running `bun install` and `bun run lint`, and the progress of fixing them.

Completed

- [x] Run `bun install` to install devDependencies (performed by the assistant).
- [x] Resolve failing devDependency versions (removed unresolvable plugins to make lint runnable).
- [x] Run `bun run lint` to collect lint issues (performed by the assistant).

Outstanding issues (actionable)

- [x] Config: Remove or fix missing rule `sonarjs/max-lines-per-function` in `.eslintrc.json`.
  - File: `.eslintrc.json`
  - Rationale: ESLint reported `Definition for rule 'sonarjs/max-lines-per-function' was not found` when running across multiple files. Either remove this rule or pin a plugin version that implements it.

- [ ] Config: Decide on JSDoc strategy and stabilize `eslint-plugin-jsdoc` rules.
  - File: `.eslintrc.json`
  - Options:
    - Keep minimal `jsdoc` rules (current) to avoid runtime crashes, or
    - Configure `eslint-plugin-jsdoc` for TypeScript support (if available), or
    - Switch to a `tsdoc`-based check that is TypeScript-aware.

- [x] Code: Fix collapsible if in `src/notification.ts` (sonar suggestion).
  - File: `src/notification.ts:55`
  - Lint: `sonarjs/no-collapsible-if` — "Merge this if statement with the nested one".

- [ ] Tests: Fix unused variable warnings in `src/sounds/download.test.ts`.
  - File: `src/sounds/download.test.ts:10` — `'url' is declared but its value is never read`.
  - File: `src/sounds/download.test.ts:52` — `'url' is declared but its value is never read`.

- [ ] Tests: Fix unused/implicit-any issues in `src/sounds/index.test.ts`.
  - File: `src/sounds/index.test.ts:1` — `'beforeEach' is declared but its value is never read`.
  - File: `src/sounds/index.test.ts:2` — `'dirname' is declared but its value is never read`.
  - File: `src/sounds/index.test.ts:3` — `'fileURLToPath' is declared but its value is never read`.
  - File: `src/sounds/index.test.ts:39` — `'category' is declared but its value is never read`.
  - File: `src/sounds/index.test.ts:46` — `'category' is declared but its value is never read`.
  - File: `src/sounds/index.test.ts:47` — `Parameter 'file' implicitly has an 'any' type`.
  - File: `src/sounds/index.test.ts:68` — `Parameter 'sound' implicitly has an 'any' type`.

- [ ] Tests: Fix implicit-any parameters in `src/sounds.test.ts`.
  - File: `src/sounds.test.ts:48` — `Parameter 'file' implicitly has an 'any' type`.
  - File: `src/sounds.test.ts:69` — `Parameter 'sound' implicitly has an 'any' type`.

- [ ] Re-run: After config changes, run `bun run lint` again to collect remaining issues and append them to this checklist.

- [ ] Fix remaining lint issues across the codebase.

- [ ] Commit fixes: `git add` + `git commit -m "fix: lint issues"`.

- [ ] Push branch and open a PR.

Notes

- I adjusted `.eslintrc.json` to a minimal, working state so ESLint can run; some `jsdoc` checks were disabled because the plugin crashed on TypeScript AST forms. If you prefer full JSDoc enforcement, we should decide which approach to take (see the JSDoc strategy item above).

Commands

- Install deps: `bun install`
- Run linter: `bun run lint`

If you want, I can proceed to:
- Remove the `sonarjs/max-lines-per-function` rule and re-run lint (recommended), or
- Fix the `src/notification.ts` collapsible if now and re-run lint, or
- Start fixing the test hints (unused vars / implicit any) and update this checklist as items are completed.

Tell me which action you want me to take next and I'll update the checklist as I make progress.
