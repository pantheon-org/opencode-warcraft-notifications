# Future improvements

This file captures suggested test improvements and follow-ups identified during a test-suite review. Grouped by priority so they can be triaged and implemented incrementally.

High-priority

- Add helper `withPlatform(platform, fn)` in `src/test-utils.ts` to safely set and restore `process.platform` during tests.
  - Stores original platform, sets requested platform, runs `fn` (supports async), and restores platform in a `finally` block.

- Centralize global-state mutation helpers in `src/test-utils.ts` (already contains `setGlobalFetch` and `silenceConsole`). Add:
  - `withEnv(vars, fn)` — temporarily set environment variables and restore them afterwards.
  - `withCwd(dir, fn)` — temporarily change the working directory and restore on completion.
  - Benefits: reduces duplicated try/finally code and prevents accidental state leakage between tests.

- Make randomness deterministic where needed
  - Avoid brittle assertions that rely on random outcomes (e.g., "returns different sounds across multiple calls").
  - Options: stub `Math.random` in specific tests or change assertions to only validate that returned values are members of the expected set.

- Ensure every test that mutates global state (platform, cwd, env, global fetch, console) restores it on all code paths; prefer the centralized helpers above to enforce this.

Medium-priority

- Add a short unit test verifying the default behavior of `soundExists` when no `existsFn` is injected (i.e., it uses real `fs/promises.exists`).

- Export or document a typed `ExistsFn = (p: string) => Promise<boolean>` to make signatures explicit and reduce misuse.

- Consider switching to async temp-dir creation/cleanup (use `fs.promises.mkdtemp` / `fs.promises.rm`) if tests are made parallel or become IO intensive.

- Consolidate temp-dir naming/prefixes: pick a consistent prefix scheme for easier debugging (e.g., `opencode-test-<purpose>-<random>`).

Low-priority / niceties

- Add a short README snippet or a docblock inside `src/test-utils.ts` describing available helpers and how to use them in tests.

- Consider adding a small test that ensures `setGlobalFetch` restore function reliably restores previous `globalThis.fetch` value when it was `undefined` or already set.

- Keep Bun-specific API usage (like `Bun.file().json()`) limited to tests that are intentionally Bun-only — add a note in docs explaining runtime expectations.

Suggested quick changes (I can implement)

1. Implement helpers in `src/test-utils.ts`:
   - `withPlatform(platform, fn)` — temporarily set `process.platform`.
   - `withEnv(vars, fn)` — temporarily set environment variables.
   - `withCwd(tempDir, fn)` — wrapper to `process.chdir` that restores original cwd.

2. Add a unit test for `sounds.soundExists` default behavior (create file in a temp dir, call `soundExists` without injection and assert `true`, then remove file and assert `false`).

3. Tame brittle randomness tests by stubbing `Math.random` where deterministic behavior is required, or loosen the uniqueness assertion.

Notes

- These improvements aim to reduce test flakiness, centralize test utilities, and make intent explicit in tests.
- If you want I can implement the quick changes and run the test suite, open a PR, or break the work into smaller commits. Just tell me which option you prefer.
