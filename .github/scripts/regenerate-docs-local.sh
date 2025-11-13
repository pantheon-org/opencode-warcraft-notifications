#!/usr/bin/env bash
#
# Regenerate documentation locally using OpenCode
# This script mimics what the GitHub workflow does but runs locally
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🤖 Local Documentation Regeneration"
echo "===================================="
echo ""

# Check if OpenCode is installed
if ! command -v opencode &> /dev/null; then
    echo "❌ OpenCode is not installed"
    echo "   Install it with: npm install -g @opencode-ai/cli"
    exit 1
fi

echo "✅ OpenCode found: $(which opencode)"
echo ""

# Check for AI provider credentials
PROVIDER_FOUND=false
PROVIDER_NAME=""

if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
    PROVIDER_FOUND=true
    PROVIDER_NAME="Anthropic Claude"
elif [ -n "${OPENAI_API_KEY:-}" ]; then
    PROVIDER_FOUND=true
    PROVIDER_NAME="OpenAI ChatGPT"
elif [ -n "${GOOGLE_API_KEY:-}" ]; then
    PROVIDER_FOUND=true
    PROVIDER_NAME="Google Gemini"
elif [ -n "${GITHUB_TOKEN:-}" ]; then
    PROVIDER_FOUND=true
    PROVIDER_NAME="GitHub Copilot"
fi

if [ "$PROVIDER_FOUND" = false ]; then
    echo "❌ No AI provider API key found"
    echo "   Set one of:"
    echo "   - ANTHROPIC_API_KEY (for Claude)"
    echo "   - OPENAI_API_KEY (for ChatGPT)"
    echo "   - GOOGLE_API_KEY (for Gemini)"
    echo "   - GITHUB_TOKEN (for GitHub Copilot)"
    exit 1
fi

echo "✅ AI provider configured: $PROVIDER_NAME"
echo ""

# Create the prompt
PROMPT_FILE="$SCRIPT_DIR/regenerate-docs-prompt.txt"
cat > "$PROMPT_FILE" << 'EOF'
Please regenerate the documentation under docs/src/content/docs/ by analyzing the current codebase.

Focus on these key documentation files:
1. docs/src/content/docs/index.md - Main landing page and overview
2. docs/src/content/docs/user-guide.md - User-facing documentation
3. docs/src/content/docs/api.md - Complete API reference
4. docs/src/content/docs/architecture.md - System architecture
5. docs/src/content/docs/development.md - Development guide
6. docs/src/content/docs/deployment.md - Deployment guide
7. docs/src/content/docs/pipeline.md - CI/CD pipeline documentation

Requirements:
- Analyze the source code to ensure documentation is accurate and up-to-date
- Maintain the existing documentation structure and formatting
- Update code examples to match current implementation
- Ensure all API references are correct
- Update version numbers and dependencies if needed
- Keep the tone professional and consistent with existing docs
- Preserve all frontmatter (YAML front matter) in markdown files

Do NOT:
- Change the overall structure of documentation
- Remove existing documentation files
- Add new top-level documentation sections without justification
- Modify workflow files or CI/CD configurations

Please review each documentation file and update it based on the current codebase.
EOF

echo "📝 Prompt created"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Run OpenCode
echo "🚀 Starting documentation regeneration..."
echo "   This may take several minutes..."
echo ""

if opencode --no-interactive < "$PROMPT_FILE"; then
    echo ""
    echo "✅ Documentation regeneration completed"
else
    echo ""
    echo "⚠️  OpenCode completed with warnings"
fi

# Check for changes
if git diff --quiet docs/src/content/docs/; then
    echo ""
    echo "ℹ️  No documentation changes detected"
    echo "   The documentation is already up-to-date"
else
    echo ""
    echo "📊 Documentation changes detected:"
    echo ""
    git diff --stat docs/src/content/docs/
    echo ""
    echo "🔍 Review changes with: git diff docs/src/content/docs/"
    echo "📦 Test build with: cd docs && bun run build"
    echo "✅ Commit changes with: git commit -am 'docs: regenerate documentation'"
fi

# Clean up prompt file
rm -f "$PROMPT_FILE"

echo ""
echo "🎉 Done!"
