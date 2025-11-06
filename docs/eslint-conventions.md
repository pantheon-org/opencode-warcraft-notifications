ESLint Conventions for opencode-warcraft-notifications

This document describes the project-specific ESLint conventions enforced in `.eslintrc.json`.

1) TSDoc / JSDoc comments
- Every exported function, class, and public API must have TSDoc/JSDoc comments.
- The linter enforces `jsdoc/require-jsdoc` and `tsdoc/syntax` for the codebase.
- Tests (`*.test.ts`) are exempt from requiring JSDoc.

2) Prefer small modules
- Modules should be small and focused. Aim for 1-2 functions per module.
- The linter enforces `max-lines` and `max-statements` to encourage smaller files and functions.
- If a file grows beyond the limits, break it into smaller modules and export a higher-level facade if needed.

3) Collocate unit tests
- Unit tests are required to live adjacent to the code under test.
- Tests should be named `*.test.ts` and placed in the same directory as their corresponding module.
- This repository's test runner is configured to discover `src/**/*.test.ts` files.

Rationale and notes
- Requiring TSDoc improves editor tooltips and makes exported APIs easier to understand for plugin authors.
- Small modules improve readability and make testing/collocation straightforward.
- Collocating tests speeds up development and makes it easier to refactor code with confidence.

Exceptions
- Some modules are primarily configuration or index re-exports. These are allowed to be small or lack detailed TSDoc when their purpose is self-evident.

Enforcement
- Run `npm run lint` (or `bun run lint`) to check the rules locally.
- CI should run the linter as part of the pipeline to ensure new PRs comply with conventions.
