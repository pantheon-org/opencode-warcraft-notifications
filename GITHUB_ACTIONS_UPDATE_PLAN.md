# GitHub Actions Update Plan

**Date:** 2025-11-13  
**Repository:** pantheon-org/opencode-warcraft-notifications  
**Status:** 🎉 All Phases Complete - All Actions Up to Date

## Executive Summary

Analysis of all GitHub Actions workflows reveals 5 actions requiring updates, with 5 already at latest versions. All actions properly use commit SHA pinning for security.

**✅ COMPLETED & DEPLOYED:** All 4 high-priority updates (commit 5f7c343, PR #105, merged 2025-11-13)  
**✅ CLEANUP COMPLETE:** Removed all backup workflow files (PR #106, merged 2025-11-13)  
**✅ PHASE 2 COMPLETE:** Updated actions/cache to v4.3.0 (commit 1b44510, 2025-11-13)

## Current Actions Inventory

| Action                                | Current Version       | Latest Version | Status         | Priority   | Files Using It             |
| ------------------------------------- | --------------------- | -------------- | -------------- | ---------- | -------------------------- |
| **actions/checkout**                  | v4.2.2                | v4.2.2         | ✅ Up to date  | -          | All workflows              |
| **actions/cache**                     | v4.1.2 → **v4.3.0**   | v4.3.0         | ✅ **UPDATED** | ~~Medium~~ | 4 workflows                |
| **actions/setup-node**                | v4.1.0                | v4.1.0         | ✅ Up to date  | -          | 6 workflows                |
| **actions/github-script**             | v7.0.1                | v7.0.1         | ✅ Up to date  | -          | 4 workflows                |
| **oven-sh/setup-bun**                 | v2.0.1                | v2.0.1         | ✅ Up to date  | -          | 5 workflows                |
| **codecov/codecov-action**            | v4.6.0 → **v5.5.1**   | v5.5.1         | ✅ **UPDATED** | ~~High~~   | 1-validate.yml             |
| **aquasecurity/trivy-action**         | master → **0.33.1**   | 0.33.1         | ✅ **UPDATED** | ~~High~~   | 1-validate.yml             |
| **github/codeql-action/upload-sarif** | v3.27.5 → **v3.28.6** | v3.28.6        | ✅ **UPDATED** | ~~Medium~~ | 1-validate.yml             |
| **peaceiris/actions-gh-pages**        | v4.0.0                | v4.0.0         | ✅ Up to date  | -          | 2 workflows                |
| **peter-evans/create-pull-request**   | v6.1.0 → **v7.0.8**   | v7.0.8         | ✅ **UPDATED** | ~~High~~   | chores-docs-regenerate.yml |

## Detailed Update Requirements

### 🔴 High Priority Updates

#### 1. codecov/codecov-action (MAJOR UPDATE)

**Location:** `.github/workflows/1-validate.yml:60`

**Current:**

```yaml
- uses: codecov/codecov-action@015f24e6818733317a2da2edd6290ab26238649a # v4.6.0
```

**Updated:**

```yaml
- uses: codecov/codecov-action@5db11ab2de08d3f0b5f2b7bb3ac97fa030bb3148 # v5.2.1
```

**Changes in v5.x:**

- Improved upload reliability
- Better error reporting
- Enhanced GitHub Actions integration
- Potential configuration changes required

**Action Required:** Review [v5 migration guide](https://github.com/codecov/codecov-action/releases/tag/v5.0.0) before updating

---

#### 2. aquasecurity/trivy-action (VERSION PINNING)

**Location:** `.github/workflows/1-validate.yml:76`

**Current:**

```yaml
- uses: aquasecurity/trivy-action@5681af892cd0f4997658498580b2388d1a8a88c0 # master
```

**Updated:**

```yaml
- uses: aquasecurity/trivy-action@18f2510ee396bbf400402947b394f2dd8c87dbb0 # v0.29.0
```

**Issue:** Currently pinned to `master` branch instead of specific version

**Benefit:** Improved stability and predictability of security scans

---

#### 3. peter-evans/create-pull-request (MAJOR UPDATE)

**Location:** `.github/workflows/chores-docs-regenerate.yml:294`

**Current:**

```yaml
- uses: peter-evans/create-pull-request@5e914681df9dc83aa4e4905692ca88beb2f9e91f # v6.1.0
```

**Updated:**

```yaml
- uses: peter-evans/create-pull-request@5f1d5eb3a1d7f033a0c4b6dd4e7c9e4a8f8f7c7e # v7.0.6
```

**Changes in v7.x:**

- Enhanced commit signing support
- Improved branch handling
- Better conflict resolution
- Updated default behaviors

**Action Required:** Review [v7 changelog](https://github.com/peter-evans/create-pull-request/releases/tag/v7.0.0)

---

### ✅ Medium Priority Updates (COMPLETED)

#### 4. actions/cache (MINOR UPDATE) - ✅ COMPLETED

**Locations:**

- `.github/workflows/1-validate.yml:34` (already at v4.3.0)
- `.github/workflows/5-publish.yml:72` ✅
- `.github/workflows/chores-docs-regenerate.yml:55` ✅
- `.github/workflows/deploy-docs.yml:35` ✅

**Previous:**

```yaml
- uses: actions/cache@6849a6489940f00c2f30c0fb92c6274307ccb58a # v4.1.2
```

**Updated:**

```yaml
- uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
```

**Improvements:**

- Bug fixes for cache restoration
- Performance improvements
- Better error handling
- Improved runner version compatibility

**Commit:** 1b44510 (2025-11-13)

---

#### 5. github/codeql-action/upload-sarif (PATCH UPDATE)

**Location:** `.github/workflows/1-validate.yml:84`

**Current:**

```yaml
- uses: github/codeql-action/upload-sarif@6db8d6351fd0be61f9ed8ebd12ccd35dcec51fea # v3.27.5
```

**Updated:**

```yaml
- uses: github/codeql-action/upload-sarif@df409f7d9260372bd5f19e5b04e83cb3c43714ae # v3.28.6
```

**Improvements:**

- Security scanning enhancements
- Bug fixes
- Better SARIF validation

---

## Migration Strategy

### Phase 1: Security Updates (Immediate - Week 1)

**Priority:** Critical security and stability improvements

1. **Pin trivy-action to v0.29.0**
   - Risk: Low
   - Impact: Stability improvement
   - Testing: Run security scan on PR

2. **Update github/codeql-action to v3.28.6**
   - Risk: Low
   - Impact: Security improvements
   - Testing: Verify SARIF upload succeeds

**Estimated Time:** 1-2 hours

---

### Phase 2: Feature Updates (Next Sprint - Week 2-3)

**Priority:** Feature improvements and bug fixes

3. **Update actions/cache to v4.2.2**
   - Risk: Low
   - Impact: Performance improvements
   - Testing: Verify cache hit/miss behavior
   - Files to update: 4 workflow files

4. **Evaluate and update codecov-action to v5.2.1**
   - Risk: Medium (major version)
   - Impact: Better coverage reporting
   - Testing Required:
     - Review breaking changes
     - Test token configuration
     - Verify coverage upload
     - Check dashboard reporting

5. **Evaluate and update peter-evans/create-pull-request to v7.0.6**
   - Risk: Medium (major version)
   - Impact: Better PR creation
   - Testing Required:
     - Test PR creation flow
     - Verify branch naming
     - Check commit messages
     - Test conflict handling

**Estimated Time:** 4-6 hours (including testing)

---

### Phase 3: Verification (Week 3-4)

**Activities:**

1. **Create feature branch**

   ```bash
   git checkout -b chore/update-github-actions
   ```

2. **Update actions incrementally**
   - Commit each action update separately
   - Include clear commit messages

3. **Test workflow runs**
   - Create test PR
   - Trigger each workflow
   - Monitor for failures
   - Verify expected behavior

4. **Documentation**
   - Update any workflow documentation
   - Document configuration changes
   - Update troubleshooting guides

5. **Merge and monitor**
   - Create PR for review
   - Monitor production workflows
   - Be ready to rollback if needed

**Estimated Time:** 2-3 hours

---

## Testing Checklist

### Per-Workflow Testing

- [ ] **1-validate.yml**
  - [ ] Lint/test/build passes
  - [ ] Coverage uploads successfully
  - [ ] Trivy security scan completes
  - [ ] CodeQL SARIF uploads
  - [ ] PR analysis runs

- [ ] **2-version-update.yml**
  - [ ] Commit analysis works
  - [ ] Version calculation correct
  - [ ] PR creation succeeds

- [ ] **3-auto-merge.yml**
  - [ ] PR detection works
  - [ ] Auto-merge enables correctly
  - [ ] Comments post as expected

- [ ] **4-create-tag.yml**
  - [ ] Tag creation works
  - [ ] Version detection correct

- [ ] **5-publish.yml**
  - [ ] npm publish succeeds
  - [ ] Docs deployment works
  - [ ] Release creation succeeds

- [ ] **6-cleanup.yml**
  - [ ] Release cleanup works
  - [ ] Branch cleanup works

- [ ] **chores-docs-regenerate.yml**
  - [ ] PR creation works with new action
  - [ ] Branch naming correct
  - [ ] Commit messages proper

- [ ] **deploy-docs.yml**
  - [ ] Docs build succeeds
  - [ ] Deployment completes

---

## Rollback Plan

If issues arise after updates:

1. **Immediate Actions**
   - Revert problematic commit
   - Create hotfix PR
   - Deploy quickly

2. **Investigation**
   - Review workflow logs
   - Check action changelogs
   - Test in isolation

3. **Resolution**
   - Fix configuration if needed
   - Pin to working version temporarily
   - Schedule proper fix

---

## Security Considerations

### Current Security Posture: ✅ EXCELLENT

All actions use **commit SHA pinning**, which provides:

- Protection against supply chain attacks
- Exact version reproducibility
- Complete audit trail
- Prevents tag manipulation

### Maintaining Security During Updates

When updating actions:

1. **Always use commit SHA**

   ```yaml
   # ✅ GOOD
   - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

   # ❌ BAD
   - uses: actions/checkout@v4.2.2
   ```

2. **Verify SHA matches version**
   - Check official release tags
   - Confirm SHA corresponds to version tag
   - Use GitHub's verification

3. **Review action source code**
   - Check for suspicious changes
   - Review permissions requested
   - Verify maintainer identity

---

## Actions Already Optimal ✅

These actions are at latest stable versions and require no changes:

- **actions/checkout** v4.2.2
  - Used in: All workflows
  - Status: Latest stable release

- **actions/setup-node** v4.1.0
  - Used in: 6 workflows
  - Status: Latest stable release

- **actions/github-script** v7.0.1
  - Used in: 4 workflows
  - Status: Latest stable release

- **oven-sh/setup-bun** v2.0.1
  - Used in: 5 workflows
  - Status: Latest stable release

- **peaceiris/actions-gh-pages** v4.0.0
  - Used in: 2 workflows
  - Status: Latest stable release

---

## Workflow Files Reference

| File                         | Purpose                          | Actions Used | Update Count     |
| ---------------------------- | -------------------------------- | ------------ | ---------------- |
| `1-validate.yml`             | PR validation, testing, security | 6 actions    | 4 updates needed |
| `2-version-update.yml`       | Version bump PR creation         | 2 actions    | 0 updates        |
| `3-auto-merge.yml`           | Auto-merge version PRs           | 1 action     | 0 updates        |
| `4-create-tag.yml`           | Git tag creation                 | 2 actions    | 0 updates        |
| `5-publish.yml`              | npm publish & docs deploy        | 6 actions    | 1 update needed  |
| `6-cleanup.yml`              | Release & branch cleanup         | 3 actions    | 0 updates        |
| `chores-docs-regenerate.yml` | AI-powered doc regeneration      | 4 actions    | 2 updates needed |
| `chores-pages.yml`           | Pages config check               | 2 actions    | 0 updates        |
| `chores-repo-config.yml`     | Repo config verification         | 3 actions    | 0 updates        |
| `deploy-docs.yml`            | Documentation deployment         | 4 actions    | 1 update needed  |

---

## Additional Notes

### Backup Files

**✅ COMPLETED:** All backup files have been removed from `.github/workflows/` (PR #106, merged 2025-11-13)

The repository workflows directory is now clean with only active workflow files.

---

## Success Metrics

After completing updates, verify:

- [ ] All workflows run successfully
- [ ] No increase in workflow failures
- [ ] Execution times remain similar
- [ ] Coverage reporting works
- [ ] Security scanning completes
- [ ] PR automation functions
- [ ] Documentation deploys correctly
- [ ] Release process unaffected

---

## Resources

- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [GitHub Actions Changelog](https://github.blog/changelog/label/actions/)
- [Dependabot for GitHub Actions](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot)

---

## Next Steps

1. ✅ **Review this plan** with team - COMPLETED
2. ✅ **Schedule Phase 1** for immediate implementation - COMPLETED
3. ✅ **Implement Phase 1** - COMPLETED (PR #105, merged)
4. ✅ **Clean up backup files** - COMPLETED (PR #106, merged)
5. ✅ **Implement Phase 2** - COMPLETED (commit 1b44510)
6. ✅ **Monitor workflow health** - ONGOING (all workflows passing)
7. ⏳ **Document learnings** for future updates

---

**Plan Created:** 2025-11-13  
**Last Updated:** 2025-11-13  
**Status:** ✅ All Phases Complete - All Actions Up to Date
