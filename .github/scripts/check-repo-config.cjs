#!/usr/bin/env node

/**
 * Repository Configuration Checker
 * Verifies and helps configure repository settings for proper squash merge enforcement
 */

const { execSync } = require('child_process');

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

async function checkRepositorySettings() {
  console.log('🔍 Checking repository merge settings...\n');

  try {
    // Get current repository settings
    const repoData = exec(
      'gh api repos/pantheon-org/opencode-warcraft-notifications --jq "{allow_squash_merge, allow_merge_commit, allow_rebase_merge, delete_branch_on_merge}"',
    );

    if (!repoData) {
      console.error(
        '❌ Failed to fetch repository settings. Make sure GitHub CLI is authenticated.',
      );
      process.exit(1);
    }

    const settings = JSON.parse(repoData);

    console.log('📊 Current Repository Settings:');
    console.log(`   Allow Squash Merge: ${settings.allow_squash_merge ? '✅' : '❌'}`);
    console.log(
      `   Allow Merge Commit: ${settings.allow_merge_commit ? '⚠️ ENABLED' : '✅ DISABLED'}`,
    );
    console.log(
      `   Allow Rebase Merge: ${settings.allow_rebase_merge ? '⚠️ ENABLED' : '✅ DISABLED'}`,
    );
    console.log(
      `   Delete Branch on Merge: ${settings.delete_branch_on_merge ? '✅' : '⚠️ DISABLED'}\n`,
    );

    // Check if configuration is optimal for single-release-per-PR
    const isOptimal =
      settings.allow_squash_merge === true &&
      settings.allow_merge_commit === false &&
      settings.allow_rebase_merge === false &&
      settings.delete_branch_on_merge === true;

    if (isOptimal) {
      console.log('🎉 Repository is optimally configured for single release per merge request!');
      return true;
    } else {
      console.log('⚠️ Repository configuration needs adjustment for optimal release management.\n');

      console.log('🔧 Required Changes:');
      if (!settings.allow_squash_merge) {
        console.log('   • Enable "Allow squash merging"');
      }
      if (settings.allow_merge_commit) {
        console.log('   • Disable "Allow merge commits" (prevents multiple commits per merge)');
      }
      if (settings.allow_rebase_merge) {
        console.log('   • Disable "Allow rebase merging" (ensures consistent squash behavior)');
      }
      if (!settings.delete_branch_on_merge) {
        console.log('   • Enable "Automatically delete head branches" (cleanup)');
      }

      console.log('\n📖 Manual Configuration Required:');
      console.log(
        '   Go to: https://github.com/pantheon-org/opencode-warcraft-notifications/settings',
      );
      console.log('   Navigate to: General → Pull Requests');
      console.log('   Apply the changes listed above');

      return false;
    }
  } catch (error) {
    console.error('❌ Error checking repository settings:', error.message);
    return false;
  }
}

async function checkBranchProtection() {
  console.log('\n🛡️ Checking branch protection for main branch...\n');

  try {
    const protectionData = exec(
      'gh api repos/pantheon-org/opencode-warcraft-notifications/branches/main/protection 2>/dev/null',
    );

    if (!protectionData) {
      console.log('⚠️ No branch protection rules found for main branch');
      console.log(
        '📖 Recommended: Set up branch protection to require PR reviews and status checks',
      );
      return false;
    }

    const protection = JSON.parse(protectionData);

    console.log('🛡️ Branch Protection Status:');
    console.log(`   Require PR Reviews: ${protection.required_pull_request_reviews ? '✅' : '❌'}`);
    console.log(`   Require Status Checks: ${protection.required_status_checks ? '✅' : '❌'}`);
    console.log(
      `   Up to Date Branches: ${protection.required_status_checks?.strict ? '✅' : '❌'}`,
    );

    return true;
  } catch (error) {
    console.log('⚠️ Unable to check branch protection (may not be configured)');
    return false;
  }
}

async function main() {
  console.log('🚀 Repository Configuration Checker for Single Release Per Merge\n');
  console.log('This tool verifies that your repository is configured to prevent');
  console.log('excessive releases by enforcing squash merge strategy.\n');

  const settingsOk = await checkRepositorySettings();
  const protectionOk = await checkBranchProtection();

  console.log('\n📋 Summary:');

  if (settingsOk && protectionOk) {
    console.log('✅ Repository is properly configured for single release per merge request!');
    console.log('🎯 Benefits:');
    console.log('   • Each PR merge creates exactly one commit on main');
    console.log('   • Each commit triggers at most one version bump');
    console.log('   • Each version bump creates at most one release');
    console.log('   • Clean, linear git history');
  } else {
    console.log('⚠️ Repository configuration needs attention to prevent multiple releases per PR');
    console.log('\n🔗 Next Steps:');
    console.log('   1. Apply the configuration changes noted above');
    console.log('   2. Re-run this script to verify changes');
    console.log('   3. Test with a sample PR to confirm behavior');
    console.log('\n📚 Documentation: docs/squash-merge-configuration.md');
  }

  console.log(`\n🏁 Configuration check complete!`);
}

main().catch((error) => {
  console.error('❌ Configuration check failed:', error);
  process.exit(1);
});
