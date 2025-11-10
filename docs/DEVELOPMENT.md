# Development Guide

## Overview

This guide provides comprehensive information for developers working on the Warcraft II Notifications Plugin. It covers setup, development workflows, testing strategies, and contribution guidelines.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [Release Process](#release-process)

---

## Getting Started

### Prerequisites

- **Bun**: v1.0.0 or higher
- **Node.js**: v18.0.0 or higher (for compatibility)
- **Git**: For version control
- **OpenCode**: For testing the plugin

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/pantheon-org/opencode-warcraft-notifications.git
   cd opencode-warcraft-notifications
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Verify installation**:
   ```bash
   bun run test
   ```

---

## Development Environment

### IDE Setup

#### Visual Studio Code

Recommended extensions:

- **ESLint**: For linting
- **Prettier**: For code formatting
- **TypeScript**: For type checking
- **Bun for Visual Studio Code**: For Bun support

**Settings** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Environment Variables

Create a `.env` file for local development:

```bash
# Debug mode
DEBUG_OPENCODE=1

# Custom data directory (optional)
SOUNDS_DATA_DIR=/path/to/custom/sounds

# Custom base URL (optional, legacy)
SOUNDS_BASE_URL=https://custom-cdn.com/sounds
```

---

## Project Structure

```
opencode-warcraft-notifications/
├── .github/                    # GitHub workflows and automation
│   ├── scripts/               # Workflow helper scripts
│   └── workflows/             # CI/CD workflows
├── data/                      # Bundled sound files
│   ├── alliance/             # Alliance faction sounds
│   └── horde/                # Horde faction sounds
├── docs/                      # Documentation
│   ├── github-workflows/     # Workflow documentation
│   └── schemas/              # JSON schemas
├── src/                       # Source code
│   ├── sound-data/           # Sound metadata
│   │   ├── alliance.ts       # Alliance sound entries
│   │   ├── horde.ts          # Horde sound entries
│   │   ├── index.ts          # Sound data exports
│   │   └── types.ts          # Type definitions
│   ├── bundled-sounds.ts     # Bundled sound management
│   ├── notification.ts       # Main plugin logic
│   ├── plugin-config.ts      # Configuration management
│   ├── sounds.ts             # Sound selection and paths
│   └── test-utils.ts         # Testing utilities
├── typings/                   # TypeScript type definitions
├── index.ts                   # Plugin entry point
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.test.json        # Test TypeScript configuration
├── eslint.config.cjs         # ESLint configuration
└── .prettierrc               # Prettier configuration
```

### Key Directories

#### `src/`

Contains all source code:

- **Core modules**: `notification.ts`, `plugin-config.ts`, `sounds.ts`, `bundled-sounds.ts`
- **Sound data**: `sound-data/` directory with faction-specific sound entries
- **Tests**: `*.test.ts` files for unit and integration tests
- **Utilities**: `test-utils.ts` for testing helpers

#### `data/`

Contains bundled WAV files:

- **alliance/**: 50+ Alliance unit sounds
- **horde/**: 50+ Horde unit sounds

#### `docs/`

Documentation files:

- **API documentation**: API reference
- **Architecture**: System design and component diagrams
- **Workflows**: CI/CD pipeline documentation
- **Schemas**: JSON schema definitions

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit source files in `src/` directory:

```typescript
// Example: Adding a new sound category
export const newUnitSounds = {
  newUnitSelected: ['new_unit_selected1.wav', 'new_unit_selected2.wav'],
  newUnitAcknowledge: ['new_unit_acknowledge1.wav'],
};
```

### 3. Run Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run verbose tests
bun run test:verbose
```

### 4. Type Check

```bash
bun run type-check
```

### 5. Lint Code

```bash
# Check for linting errors
bun run lint

# Auto-fix linting errors
bun run lint --fix
```

### 6. Format Code

```bash
# Format all files
bun run format

# Check formatting without changes
bun run format:check
```

### 7. Commit Changes

Use conventional commit messages:

```bash
git add .
git commit -m "feat: add new unit sound category"
```

**Commit Message Format**:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 8. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Testing

### Test Structure

```mermaid
graph TB
    subgraph "Test Types"
        UT[Unit Tests<br/>*.unit.test.ts]
        IT[Integration Tests<br/>*.test.ts]
        ET[Edge Case Tests<br/>*.edge.test.ts]
        FT[Failure Tests<br/>*.failures.test.ts]
    end

    subgraph "Test Utilities"
        TU[test-utils.ts]
    end

    UT --> TU
    IT --> TU
    ET --> TU
    FT --> TU

    style UT fill:#4caf50
    style IT fill:#2196f3
    style ET fill:#ff9800
    style FT fill:#f44336
```

### Writing Tests

#### Unit Tests

Test individual functions in isolation:

```typescript
import { describe, test, expect } from 'bun:test';
import { determineSoundFaction } from './sounds';

describe('determineSoundFaction', () => {
  test('should identify Alliance sounds', () => {
    expect(determineSoundFaction('human_selected1.wav')).toBe('alliance');
    expect(determineSoundFaction('knight_acknowledge1.wav')).toBe('alliance');
  });

  test('should identify Horde sounds', () => {
    expect(determineSoundFaction('orc_selected1.wav')).toBe('horde');
    expect(determineSoundFaction('death_knight_acknowledge1.wav')).toBe('horde');
  });
});
```

#### Integration Tests

Test component interactions:

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { loadPluginConfig } from './plugin-config';
import { createTempDir, cleanupTempDir } from './test-utils';

describe('Plugin Configuration Integration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  test('should load project-specific configuration', async () => {
    // Create test config
    const configPath = join(tempDir, '.opencode', 'plugin.json');
    await mkdir(dirname(configPath), { recursive: true });
    await writeFile(
      configPath,
      JSON.stringify({
        '@pantheon-ai/opencode-warcraft-notifications': {
          faction: 'horde',
        },
      }),
    );

    // Load config
    const config = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
    expect(config.faction).toBe('horde');
  });
});
```

#### Edge Case Tests

Test boundary conditions:

```typescript
describe('Edge Cases', () => {
  test('should handle empty sound directory', async () => {
    const sounds = await getSoundsByFaction('alliance');
    expect(sounds).toBeArray();
    expect(sounds.length).toBeGreaterThan(0);
  });

  test('should handle missing configuration file', async () => {
    const config = await loadPluginConfig('nonexistent-plugin');
    expect(config).toEqual({});
  });
});
```

#### Failure Tests

Test error handling:

```typescript
describe('Error Handling', () => {
  test('should handle invalid faction', () => {
    expect(() => {
      // @ts-expect-error Testing invalid input
      getSoundsByFaction('invalid');
    }).toThrow();
  });

  test('should handle missing sound file gracefully', async () => {
    const exists = await soundExists('nonexistent.wav', 'alliance');
    expect(exists).toBe(false);
  });
});
```

### Test Utilities

Use `test-utils.ts` for common testing patterns:

```typescript
import { createMockContext, createTempDir, cleanupTempDir } from './test-utils';

// Create mock OpenCode context
const ctx = createMockContext();

// Create temporary directory for tests
const tempDir = await createTempDir();

// Cleanup after tests
await cleanupTempDir(tempDir);
```

### Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test src/sounds.test.ts

# Run tests matching pattern
bun test --test-name-pattern "faction"

# Run tests with coverage
bun test --coverage

# Run tests in watch mode
bun test --watch
```

### Coverage Goals

- **Overall coverage**: > 80%
- **Critical paths**: > 95%
- **Edge cases**: > 70%

---

## Code Quality

### Linting

The project uses ESLint with TypeScript support:

```bash
# Check for linting errors
bun run lint

# Auto-fix linting errors
bun run lint --fix
```

**ESLint Configuration** (`eslint.config.cjs`):

- TypeScript rules
- Import/export rules
- JSDoc rules
- Code quality rules (SonarJS)
- Prettier integration

### Formatting

The project uses Prettier for code formatting:

```bash
# Format all files
bun run format

# Check formatting
bun run format:check
```

**Prettier Configuration** (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Type Checking

TypeScript is used for type safety:

```bash
# Type check without emitting files
bun run type-check

# Build TypeScript
bun run build

# Watch mode
bun run dev
```

**TypeScript Configuration** (`tsconfig.json`):

- Strict mode enabled
- ES2022 target
- Module resolution: bundler
- Path aliases supported

---

## Debugging

### Debug Mode

Enable debug logging:

```bash
DEBUG_OPENCODE=1 bun test
```

**Debug Output**:

- Configuration loading attempts
- Sound installation progress
- File operation results
- Error details

### Debugging Tests

Use Bun's built-in debugger:

```bash
# Run tests with debugger
bun --inspect test

# Run specific test with debugger
bun --inspect test src/sounds.test.ts
```

### Debugging Plugin in OpenCode

1. **Enable debug mode**:

   ```bash
   DEBUG_OPENCODE=1 opencode
   ```

2. **Check logs**:
   - Configuration loading
   - Sound installation
   - Event handling
   - Sound playback

3. **Verify sound files**:

   ```bash
   # Check default data directory
   ls -la ~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/

   # Check alliance sounds
   ls -la ~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/alliance/

   # Check horde sounds
   ls -la ~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/horde/
   ```

### Common Issues

#### Sound Not Playing

```mermaid
flowchart TD
    A[Sound Not Playing] --> B{File exists?}
    B -->|No| C[Run installBundledSoundsIfMissing]
    B -->|Yes| D{Correct permissions?}
    D -->|No| E[Fix permissions: chmod 644]
    D -->|Yes| F{Platform command works?}
    F -->|No| G[Check afplay/canberra-gtk-play]
    F -->|Yes| H[Check sound file format]

    style C fill:#ff9800
    style E fill:#ff9800
    style G fill:#f44336
    style H fill:#2196f3
```

#### Configuration Not Loading

```bash
# Check project config
cat .opencode/plugin.json

# Check global config
cat ~/.config/opencode/plugin.json

# Verify JSON syntax
bun run validate:schema
```

---

## Contributing

### Contribution Workflow

```mermaid
sequenceDiagram
    participant D as Developer
    participant GH as GitHub
    participant CI as CI/CD
    participant R as Reviewer

    D->>GH: Fork repository
    D->>D: Create feature branch
    D->>D: Make changes
    D->>D: Write tests
    D->>D: Run local checks
    D->>GH: Push branch
    D->>GH: Create Pull Request
    GH->>CI: Trigger PR validation
    CI->>CI: Run tests
    CI->>CI: Run linting
    CI->>CI: Run type checking
    CI-->>GH: Report results
    GH->>R: Request review
    R->>R: Review code
    R->>GH: Approve/Request changes
    alt Approved
        GH->>GH: Merge PR
        GH->>CI: Trigger release workflow
    else Changes requested
        D->>D: Make changes
        D->>GH: Push updates
    end
```

### Code Review Checklist

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] Types are properly defined
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No console.log statements (use DEBUG_OPENCODE)
- [ ] Error handling is appropriate
- [ ] Performance impact is minimal

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new warnings
```

---

## Release Process

### Automated Release Workflow

```mermaid
graph TB
    A[Push to main] --> B[Smart Version Bump]
    B --> C{Analyze commits}
    C -->|AI + Conventional| D[Determine version type]
    D --> E[Update package.json]
    E --> F[Create git tag]
    F --> G[Push tag]
    G --> H[Release & Publish]
    H --> I[Build package]
    I --> J[Publish to npm]
    J --> K[Create GitHub release]

    style B fill:#4caf50
    style H fill:#2196f3
    style J fill:#ff9800
```

### Version Bump Types

The workflow automatically determines version bumps:

- **MAJOR**: Breaking changes, API changes
- **MINOR**: New features, backwards-compatible additions
- **PATCH**: Bug fixes, documentation, small improvements

### Manual Release

If needed, trigger a manual release:

```bash
# Trigger workflow with specific version type
gh workflow run smart-version-bump.yml -f version_type=minor
```

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is up-to-date
- [ ] CHANGELOG is updated (automated)
- [ ] Version bump is appropriate
- [ ] No breaking changes (unless MAJOR)

---

## Best Practices

### 1. Code Organization

- Keep functions small and focused
- Use descriptive variable names
- Group related functionality
- Avoid deep nesting

### 2. Error Handling

```typescript
// Good: Graceful error handling
try {
  await installBundledSoundsIfMissing(dataDir);
} catch (err) {
  if (process.env.DEBUG_OPENCODE) {
    console.warn('Installation failed:', err);
  }
  // Continue with existing sounds
}

// Bad: Unhandled errors
await installBundledSoundsIfMissing(dataDir); // May throw
```

### 3. Type Safety

```typescript
// Good: Explicit types
const getSoundPath = (
  filename: string,
  faction: 'alliance' | 'horde',
  dataDir?: string,
): string => {
  // ...
};

// Bad: Implicit any
const getSoundPath = (filename, faction, dataDir) => {
  // ...
};
```

### 4. Testing

```typescript
// Good: Descriptive test names
test('should return alliance for human unit sounds', () => {
  expect(determineSoundFaction('human_selected1.wav')).toBe('alliance');
});

// Bad: Vague test names
test('faction test', () => {
  expect(determineSoundFaction('human_selected1.wav')).toBe('alliance');
});
```

### 5. Documentation

````typescript
/**
 * Get the full path to a sound file in the faction-specific subdirectory.
 *
 * @param filename - Sound filename (e.g., 'human_selected1.wav')
 * @param faction - Faction the sound belongs to
 * @param dataDir - Optional override data directory
 * @returns Absolute path to the sound file
 *
 * @example
 * ```typescript
 * const path = getSoundPath('human_selected1.wav', 'alliance');
 * // Returns: '/home/user/.local/share/.../alliance/human_selected1.wav'
 * ```
 */
export const getSoundPath = (
  filename: string,
  faction: 'alliance' | 'horde',
  dataDir?: string,
): string => {
  // ...
};
````

---

## Resources

### Documentation

- [OpenCode Plugin Documentation](https://opencode.ai/docs/plugins/)
- [Bun Documentation](https://bun.sh/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Tools

- [Bun](https://bun.sh/) - JavaScript runtime and toolkit
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [TypeScript](https://www.typescriptlang.org/) - Type checking

### Community

- [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)

---

**Document Version**: 1.0  
**Last Updated**: November 10, 2025  
**Maintained By**: Pantheon AI Team
