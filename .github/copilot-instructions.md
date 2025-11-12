# GitHub Copilot Code Review Instructions

## Project Context

This is the **OpenCode Warcraft Notifications** package - a notification system that plays Warcraft-themed sound effects based on notification events.

## Review Focus Areas

### 1. Code Quality & Best Practices

- **TypeScript**: Ensure proper type safety, avoid `any`, use strict types
- **Testing**: All new features should have corresponding tests (unit, integration, edge cases)
- **Error Handling**: Check for proper error handling, especially in notification and sound playback logic
- **Performance**: Flag any unnecessary loops, memory leaks, or inefficient operations

### 2. Project-Specific Requirements

#### Sound System

- Verify sound file paths are correct and exist in `data/alliance/` or `data/horde/`
- Check that sound selection logic properly handles both factions
- Ensure notification categories are correctly mapped to sound effects
- Validate audio playback doesn't block the main thread

#### Configuration

- Configuration schema validation must use proper types
- User preferences should be properly validated and have sensible defaults
- Check for backward compatibility when changing config structure

#### Testing

- All test files should use `.test.ts` extension
- Coverage reports should be generated for new code
- Mock external dependencies (file system, audio APIs) properly
- Include edge cases: missing files, invalid configs, unsupported formats

### 3. Security & Safety

- **File System Access**: Validate all file paths, prevent directory traversal
- **User Input**: Sanitize and validate all user-provided configuration
- **Dependencies**: Flag use of deprecated packages or known vulnerabilities
- **Secrets**: Ensure no API keys, tokens, or secrets are committed

### 4. Documentation

- Public APIs must have JSDoc comments
- Complex logic should have inline comments explaining the "why"
- Update README.md if adding new features or changing APIs
- Include usage examples for new functionality

### 5. Warcraft Theme Consistency

- Sound file naming should follow existing conventions
- Faction-specific logic should be symmetric (alliance/horde)
- Character acknowledgments should feel authentic to Warcraft lore
- User-facing messages can reference Warcraft terms but stay accessible

## Review Guidelines

### What to Comment On

- ✅ **Security vulnerabilities** or potential exploits
- ✅ **Bugs** or logical errors
- ✅ **Performance issues** that could impact UX
- ✅ **Missing tests** for new functionality
- ✅ **Breaking changes** to public APIs
- ✅ **Type safety issues** or loose types
- ✅ **Accessibility concerns** in notification system

### What to Avoid

- ❌ Stylistic preferences already covered by linter/formatter
- ❌ Minor naming suggestions (unless truly confusing)
- ❌ Comments on code formatting (we use Prettier)
- ❌ Overly pedantic suggestions that don't improve quality

## Response Style

- Be **constructive and helpful**, not critical
- Provide **specific suggestions** with code examples when possible
- Explain **why** something is an issue, not just what
- Use Warcraft-themed emojis when appropriate (⚔️ 🛡️ 🏰)
- Priority levels:
  - 🔴 **Critical**: Security, data loss, crashes
  - 🟡 **Important**: Bugs, missing tests, bad patterns
  - 🟢 **Nice-to-have**: Optimizations, style improvements

## Example Review Comments

### Good Comment Example

```
🔴 **Potential Bug: Sound File Not Found**

In `src/sounds/index.ts:45`, if the sound file doesn't exist, the promise rejects but isn't caught, potentially crashing the application.

**Suggestion:**
\`\`\`typescript
try {
  await playSound(soundPath);
} catch (error) {
  console.error('Failed to play sound:', error);
  // Fallback to default notification
  await playDefaultSound();
}
\`\`\`

This ensures graceful degradation if sound files are missing.
```

### Less Helpful Comment Example

```
Consider renaming this variable.
```

## Commands for Specific Checks

When reviewing:

1. **Check test coverage** - Verify new code has tests
2. **Verify types** - Look for `any` types or missing type annotations
3. **Review error handling** - Ensure all async operations have error handling
4. **Check file paths** - Validate sound file paths exist and are secure
5. **Review breaking changes** - Flag any changes to public API signatures

## Integration with CI/CD

This project uses:

- **Bun** for package management and testing
- **Prettier** for code formatting
- **ESLint** for linting
- **TypeScript** for type checking

Your reviews should complement these tools, not duplicate them. Focus on logic, architecture, and project-specific concerns.

---

_For the Alliance! For the Horde! For clean code!_ ⚔️
