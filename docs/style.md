# Style: Arrow Functions

- Project preference: use arrow functions for all new JavaScript/TypeScript function definitions and callbacks.
- Rationale: arrow functions provide consistent `this` binding, shorter syntax, and are easier to refactor safely.
- Examples:
  - Preferred: `const add = (a: number, b: number) => a + b`;
  - Avoid (named function declaration): `function add(a: number, b: number) { return a + b }`.

Guidance:

- Prefer `const` + arrow for top-level and exported functions.
- Use arrow callbacks for array methods and promise handlers (`.map`, `.then`, etc.).
- When converting existing `function` declarations, ensure the change does not rely on hoisting or `this` as a constructor.
