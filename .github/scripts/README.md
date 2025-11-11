# GitHub Workflow Scripts

This directory contains reusable scripts used by GitHub Actions workflows.

## Scripts

### Version Management

#### `analyze-commits.sh`

Analyzes commit messages using conventional commit patterns to determine semantic version bump type.

**Usage:**

```bash
./analyze-commits.sh [commits_file]
```

**Input:** File containing commit messages (one per line)  
**Output:** Version bump type (major, minor, patch, or none)

**Logic:**

- `BREAKING CHANGE` or `!:` → **major**
- `feat:` or `feature:` → **minor**
- `fix:`, `bugfix:`, `patch:` → **patch**
- `docs:`, `chore:`, `ci:`, etc. → **patch**
- No pattern → **patch** (default)

**Used by:** `2-version-update.yml`

---

#### `calculate-version.sh`

Calculates new semantic version based on current version and bump type.

**Usage:**

```bash
./calculate-version.sh <current_version> <bump_type>
```

**Example:**

```bash
./calculate-version.sh 1.2.3 minor
# Output: 1.3.0
```

**Logic:**

- **major**: Increments major, resets minor and patch to 0
- **minor**: Increments minor, resets patch to 0
- **patch**: Increments patch

**Used by:** `2-version-update.yml`

---

#### `create-version-pr.sh`

Creates a version bump pull request with updated package.json.

**Usage:**

```bash
./create-version-pr.sh <new_version> <current_version> <version_type> <branch_name>
```

**Example:**

```bash
./create-version-pr.sh 1.3.0 1.2.3 minor version-bump/v1.3.0
```

**Actions:**

1. Creates git branch
2. Updates package.json version
3. Commits changes with `[skip ci]`
4. Pushes branch
5. Creates pull request with changelog

**Used by:** `2-version-update.yml`

---

### Repository Configuration

#### `check-repo-config.cjs`

Verifies repository settings enforce squash merge strategy.

**Usage:**

```bash
node check-repo-config.cjs
```

**Requirements:**

- GitHub CLI (`gh`) authenticated
- Repository access permissions

**Checks:**

- ✅ Squash merging enabled
- ❌ Merge commits disabled
- ❌ Rebase merging disabled
- ✅ Auto-delete branches enabled

**Used by:** `repo-config-check.yml`

---

## Development

### Adding New Scripts

1. Create script in this directory
2. Make executable: `chmod +x script-name.sh`
3. Add shebang: `#!/usr/bin/env bash` or `#!/usr/bin/env node`
4. Add documentation to this README
5. Reference from workflow file

### Testing Scripts Locally

```bash
# Test analyze-commits.sh
echo "feat: add new feature" > test-commits.txt
./.github/scripts/analyze-commits.sh test-commits.txt
# Expected output: minor

# Test calculate-version.sh
./.github/scripts/calculate-version.sh 1.2.3 minor
# Expected output: 1.3.0

# Test check-repo-config.cjs
node ./.github/scripts/check-repo-config.cjs
# Expected output: Configuration check results
```

### Script Standards

- **Error handling**: Use `set -e` in bash scripts
- **Input validation**: Check required arguments
- **Output format**: Use stdout for data, stderr for logs
- **Exit codes**: 0 for success, non-zero for errors
- **Documentation**: Add header comments explaining purpose

---

## Troubleshooting

### Script Not Found

If workflow fails with "script not found":

```bash
# Verify script exists
ls -la .github/scripts/

# Verify executable
chmod +x .github/scripts/*.sh
```

### Permission Denied

If workflow fails with "permission denied":

```bash
# Make scripts executable
chmod +x .github/scripts/*.sh

# Commit the permission change
git add .github/scripts/
git commit -m "fix: make scripts executable"
```

### Script Output Not Working

If script output isn't captured:

```bash
# Debug script locally
bash -x .github/scripts/script-name.sh args

# Check stdout vs stderr usage
# GitHub Actions captures stdout for outputs
```

---

## Related Documentation

- [Workflow Documentation](../.github/WORKFLOWS.md)
- [Migration Guide](../.github/MIGRATION.md)
- [Contributing Guide](../../CONTRIBUTING.md)

---

**Last Updated:** 2025-11-11  
**Maintained By:** Pantheon AI Team
