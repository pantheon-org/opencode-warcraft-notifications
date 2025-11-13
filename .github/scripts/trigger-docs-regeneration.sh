#!/usr/bin/env bash
#
# Quick script to manually trigger documentation regeneration workflow
#

set -euo pipefail

REPO="pantheon-org/opencode-warcraft-notifications"
WORKFLOW="chores-docs-regenerate.yml"

echo "🚀 Triggering Documentation Regeneration Workflow"
echo "=================================================="
echo ""
echo "Repository: $REPO"
echo "Workflow: $WORKFLOW"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "   Run: gh auth login"
    exit 1
fi

# Get provider choice
echo "Select AI Provider:"
echo "1) Anthropic Claude (Recommended)"
echo "2) OpenAI ChatGPT"
echo "3) Google Gemini"
echo "4) GitHub Copilot"
read -p "Choice [1]: " choice
choice=${choice:-1}

case "$choice" in
    1)
        PROVIDER="anthropic"
        echo "Selected: Anthropic Claude"
        ;;
    2)
        PROVIDER="openai"
        echo "Selected: OpenAI ChatGPT"
        ;;
    3)
        PROVIDER="google"
        echo "Selected: Google Gemini"
        ;;
    4)
        PROVIDER="github"
        echo "Selected: GitHub Copilot"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
read -p "Create PR with changes? [Y/n]: " create_pr
create_pr=${create_pr:-Y}

if [[ "$create_pr" =~ ^[Yy] ]]; then
    CREATE_PR="true"
    echo "Will create PR if changes detected"
else
    CREATE_PR="false"
    echo "Will NOT create PR (changes will be shown in logs only)"
fi

echo ""
echo "Triggering workflow..."

gh workflow run "$WORKFLOW" \
  --repo "$REPO" \
  --field ai_provider="$PROVIDER" \
  --field create_pr="$CREATE_PR"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Workflow triggered successfully!"
    echo ""
    echo "View status with:"
    echo "  gh run list --workflow=$WORKFLOW --repo=$REPO"
    echo ""
    echo "Watch logs with:"
    echo "  gh run watch --repo=$REPO"
else
    echo ""
    echo "❌ Failed to trigger workflow"
    exit 1
fi
