# Adding AI Code Reviewers to GitHub Projects

A comprehensive guide on integrating GitHub Copilot, Claude, and Gemini as code reviewers in your GitHub projects.

## Table of Contents

1. [GitHub Copilot Code Review](#github-copilot-code-review)
2. [Claude for Code Review](#claude-for-code-review)
3. [Gemini Code Assist](#gemini-code-assist)
4. [Third-Party AI Code Review Apps](#third-party-ai-code-review-apps)
5. [Comparison and Recommendations](#comparison-and-recommendations)

---

## GitHub Copilot Code Review

### Overview

GitHub Copilot Code Review is GitHub's native AI-powered code review solution that integrates directly into GitHub's pull request workflow.

### Prerequisites

- **Access to GitHub Copilot**: You need a Copilot subscription (Individual, Business, or Enterprise)
- **Supported Plans**: Available on GitHub Copilot Free, Pro, Team, and Enterprise
- **Compatible IDEs**:
  - Visual Studio Code
  - JetBrains IDEs (IntelliJ, PyCharm, WebStorm, etc.)
  - Visual Studio
  - Xcode
  - GitHub Web Interface
  - GitHub Mobile

### How to Set Up

#### 1. **Manual Code Review on Pull Requests**

1. Navigate to your pull request on GitHub.com
2. Open the **Reviewers** menu
3. Select **Copilot** from the reviewer list
4. Wait for Copilot to review your changes (typically <30 seconds)
5. Review Copilot's comments and suggested changes

#### 2. **Automatic Code Review**

You can configure Copilot to automatically review all pull requests:

```yaml
# .github/workflows/copilot-review.yml
name: Copilot Auto Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  copilot-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Request Copilot Review
        run: gh pr review ${{ github.event.pull_request.number }} --request copilot
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

See [Configure automatic code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/configure-automatic-review) for detailed setup.

#### 3. **IDE Integration**

**Visual Studio Code:**

1. Install the GitHub Copilot extension
2. Open Source Control view
3. Click "Copilot Code Review - Uncommitted Changes" button
4. Review inline comments in the Problems tab

**JetBrains IDEs:**

1. Install GitHub Copilot plugin
2. Open Commit tool window
3. Click "Copilot: Review Code Changes" (magnifying glass icon)
4. Navigate through comments using arrow buttons

### Customizing Copilot Reviews

Create custom instructions to tailor Copilot's reviews:

**Repository-wide instructions** (`.github/copilot-instructions.md`):

```markdown
When performing a code review, respond in Spanish.

When performing a code review, apply the checks in the `/security/security-checklist.md` file.

When performing a code review, focus on readability and avoid nested ternary operators.
```

**Path-specific instructions** (`.github/instructions/**/NAME.instructions.md`):

```markdown
For API routes, ensure:

- Proper authentication middleware
- Rate limiting implementation
- Input validation using Zod schemas
```

### Key Features

- **Inline Comments**: Copilot provides context-aware feedback directly on code lines
- **Suggested Changes**: One-click application of fixes
- **Non-blocking**: Reviews are "Comment" type, not "Request changes"
- **Re-review Support**: Request new reviews after pushing changes
- **Feedback System**: Thumbs up/down on comments to improve quality

### Limitations

- **No Approval Authority**: Copilot reviews don't count toward required approvals
- **Non-blocking**: Cannot prevent merges
- **May Repeat Comments**: Dismissed comments might reappear on re-review
- **Token Limits**: Large files may need line range specifications

### Pricing

Included with GitHub Copilot subscriptions:

- **Free**: Limited features
- **Individual ($10/month)**: Full features for personal use
- **Business ($19/user/month)**: Team features + admin controls
- **Enterprise ($39/user/month)**: Advanced security + compliance

---

## Claude for Code Review

### Overview

Claude (by Anthropic) is not available as a direct GitHub integration for code reviews, but can be used through:

1. Third-party GitHub Apps
2. Custom GitHub Actions
3. API integration with webhooks

### Available Integration Methods

#### 1. **Third-Party Apps Using Claude**

Several GitHub Marketplace apps use Claude's API:

- **Qodo (formerly CodiumAI)**: Enterprise AI code review using Claude
- **Sweep AI**: AI coding assistant with Claude integration
- **Fine AI**: Pull request companion powered by Claude
- **CodeRabbit**: Contextual code reviews (supports multiple AI models including Claude)

#### 2. **Custom GitHub Action with Claude API**

Create a custom workflow using Claude's API:

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get PR Diff
        id: diff
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > pr_diff.txt

      - name: Review with Claude
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          curl https://api.anthropic.com/v1/messages \
            -H "Content-Type: application/json" \
            -H "x-api-key: $ANTHROPIC_API_KEY" \
            -H "anthropic-version: 2023-06-01" \
            -d '{
              "model": "claude-3-5-sonnet-20241022",
              "max_tokens": 4096,
              "messages": [{
                "role": "user",
                "content": "Review this code diff and provide feedback:\n\n$(cat pr_diff.txt)"
              }]
            }' | jq -r '.content[0].text' > review.txt

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.txt', 'utf8');

            github.rest.pulls.createReview({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.payload.pull_request.number,
              body: review,
              event: 'COMMENT'
            });
```

#### 3. **Using Claude API Directly**

For custom implementations:

**Requirements:**

- Anthropic API account
- API key from [console.anthropic.com](https://console.anthropic.com/)
- Webhook or GitHub Action setup

**Pricing (as of Nov 2024):**

- **Claude 3.5 Sonnet**: $3/MTok input, $15/MTok output
- **Claude 3 Opus**: $15/MTok input, $75/MTok output
- **Claude 3 Haiku**: $1/MTok input, $5/MTok output

**API Features Useful for Code Review:**

- 200K token context window (Sonnet 3.5)
- Tool use for structured output
- Citations for verification
- Web search integration
- Prompt caching (reduces costs by 90% for repeated context)

### Setup Example: Claude via GitHub Action

```typescript
// scripts/claude-review.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function reviewCode(diff: string) {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: `You are an expert code reviewer. Analyze the provided code diff and:
    1. Identify bugs and security issues
    2. Suggest performance improvements
    3. Check code style and best practices
    4. Highlight potential edge cases
    
    Format your response as structured comments with line references.`,
    messages: [
      {
        role: 'user',
        content: `Review this pull request diff:\n\n${diff}`,
      },
    ],
  });

  return message.content[0].text;
}
```

### Advantages of Claude

- **Long Context Window**: Excellent for reviewing large PRs
- **High Quality**: Strong reasoning and code understanding
- **Customizable**: Full control via API
- **Cost Effective**: With prompt caching

### Limitations

- **No Native GitHub Integration**: Requires custom setup
- **API Costs**: Pay-per-token pricing model
- **Setup Complexity**: More technical than Copilot
- **No Built-in UI**: Need to build review interface

---

## Gemini Code Assist

### Overview

Gemini Code Assist is Google Cloud's AI-powered coding assistant, primarily designed for use within Google Cloud Platform and compatible IDEs.

### Current GitHub Integration Status

**Important**: As of November 2024, Gemini does NOT have a native GitHub code review integration like GitHub Copilot. However, you can:

1. Use Gemini Code Assist in your IDE for pre-commit reviews
2. Access Gemini through GitHub Marketplace apps
3. Create custom integrations using Vertex AI API

### Integration Options

#### 1. **Gemini Code Assist GitHub App**

Found in GitHub Marketplace:

- **Name**: "Gemini Code Assist"
- **Purpose**: Brings Gemini to pull request process
- **Status**: Limited availability, requires Google Cloud account
- **Setup**: Install from [GitHub Marketplace](https://github.com/marketplace/gemini-code-assist)

#### 2. **IDE Integration (Pre-commit Review)**

Use Gemini Code Assist in your IDE before creating PRs:

**Supported IDEs:**

- Visual Studio Code
- JetBrains IDEs (IntelliJ IDEA, PyCharm, etc.)
- Cloud Workstations

**Setup:**

1. Install Cloud Code extension/plugin
2. Authenticate with Google Cloud account
3. Enable Gemini Code Assist in IDE settings
4. Use inline suggestions and code explanation

#### 3. **Custom Integration via Vertex AI**

Build custom GitHub integration using Vertex AI API:

```yaml
# .github/workflows/gemini-review.yml
name: Gemini Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  gemini-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_CREDENTIALS }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Review with Gemini
        run: |
          # Get PR diff
          git diff origin/${{ github.base_ref }}...HEAD > diff.txt

          # Call Vertex AI API
          curl -X POST \
            -H "Authorization: Bearer $(gcloud auth print-access-token)" \
            -H "Content-Type: application/json" \
            https://us-central1-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/us-central1/publishers/google/models/gemini-pro:generateContent \
            -d '{
              "contents": [{
                "role": "user",
                "parts": [{
                  "text": "Review this code diff: $(cat diff.txt)"
                }]
              }]
            }'
```

### Gemini Models for Code Review

**Available Models (via Vertex AI):**

- **Gemini 2.0 Flash**: Fast, efficient for quick reviews
- **Gemini 1.5 Pro**: More thorough analysis, larger context
- **Gemini 1.5 Flash**: Balanced performance and cost

**Context Windows:**

- Gemini 1.5 Pro: Up to 2M tokens
- Gemini 2.0 Flash: Up to 1M tokens

### Pricing

**Vertex AI Pricing (as of Nov 2024):**

- **Input**: $0.00125 - $0.0075 per 1K characters
- **Output**: $0.005 - $0.03 per 1K characters
- Varies by model and request volume

**Gemini Code Assist Pricing:**

- Part of Google Cloud subscription
- Requires Google Cloud Platform account
- See [cloud.google.com/gemini/pricing](https://cloud.google.com/products/gemini/pricing)

### Advantages of Gemini

- **Massive Context**: Up to 2M tokens
- **Google Cloud Integration**: Works well with GCP infrastructure
- **Multimodal**: Can analyze images, diagrams in code
- **Cost-Effective**: Competitive pricing

### Limitations

- **No Native GitHub Integration**: Requires custom setup or marketplace apps
- **GCP Dependency**: Requires Google Cloud account
- **Limited Third-Party Apps**: Fewer GitHub integrations than Copilot
- **Setup Complexity**: More technical than Copilot

---

## Third-Party AI Code Review Apps

### Popular Options in GitHub Marketplace

#### 1. **CodeRabbit**

- **AI Models**: Supports multiple (Claude, GPT-4, etc.)
- **Features**: Context-aware reviews, learning from feedback
- **Best For**: Teams wanting customizable AI reviews

#### 2. **Codacy**

- **Features**: Code quality + security with AI
- **Best For**: Comprehensive code quality platform

#### 3. **Sourcery**

- **Features**: AI code reviews + security scanning
- **Best For**: Python-focused projects

#### 4. **Qodo (formerly CodiumAI)**

- **Features**: Enterprise AI code review, PR-Agent
- **Best For**: Enterprise teams needing detailed reviews

#### 5. **Bito's AI Code Review Agent**

- **Features**: Contextual feedback, 1-click suggestions
- **Best For**: Fast, actionable reviews

#### 6. **What The Diff**

- **Features**: AI-powered PR summaries
- **Best For**: Quick PR understanding

### Setup Pattern for Marketplace Apps

1. Visit [GitHub Marketplace](https://github.com/marketplace?type=apps&query=ai+code+review)
2. Select your preferred app
3. Click "Set up a plan" or "Install"
4. Grant necessary permissions
5. Configure app settings in repository
6. App automatically reviews new PRs

---

## Comparison and Recommendations

### Feature Comparison

| Feature                       | GitHub Copilot  | Claude (Custom) | Gemini Code Assist |
| ----------------------------- | --------------- | --------------- | ------------------ |
| **Native GitHub Integration** | ✅ Yes          | ❌ No           | ⚠️ Limited         |
| **Easy Setup**                | ✅ Easy         | ❌ Complex      | ⚠️ Moderate        |
| **IDE Support**               | ✅ Excellent    | ⚠️ Via Custom   | ✅ Good            |
| **Context Window**            | ~8K tokens      | 200K tokens     | Up to 2M tokens    |
| **Cost**                      | $10-39/user/mo  | Pay-per-use     | Variable           |
| **Customization**             | ✅ Instructions | ✅ Full API     | ⚠️ Limited         |
| **Auto Reviews**              | ✅ Yes          | ⚠️ Custom       | ⚠️ Custom          |
| **Line-specific Comments**    | ✅ Yes          | ⚠️ Custom       | ⚠️ Custom          |
| **Learning Curve**            | Low             | High            | Moderate           |

### When to Choose Each

#### **Choose GitHub Copilot if:**

- ✅ You want the easiest setup
- ✅ Your team already uses GitHub Copilot for coding
- ✅ You prefer native GitHub integration
- ✅ You want automatic, consistent reviews
- ✅ You're okay with standard pricing model

#### **Choose Claude (via API) if:**

- ✅ You need maximum context window for large PRs
- ✅ You want full customization control
- ✅ You're comfortable with API development
- ✅ You prefer pay-per-use pricing
- ✅ You need the highest quality AI reasoning

#### **Choose Gemini if:**

- ✅ You're already using Google Cloud Platform
- ✅ You need massive context windows (2M tokens)
- ✅ You work with multimodal content
- ✅ You want competitive pricing
- ✅ You can handle custom integration work

#### **Choose Third-Party Apps if:**

- ✅ You want specialized features (security scanning, etc.)
- ✅ You prefer managed solutions
- ✅ You need specific AI model choices
- ✅ You want minimal maintenance

### Recommended Approach

**For Most Teams:**

1. **Start with GitHub Copilot** - easiest to set up, native integration
2. **Add custom instructions** for project-specific requirements
3. **Supplement with third-party apps** for specialized needs (security, etc.)

**For Large/Complex Codebases:**

1. **Use Claude via API** - leverage large context window
2. **Implement prompt caching** to reduce costs
3. **Create custom GitHub Actions** for automated reviews

**For Google Cloud Users:**

1. **Use Gemini Code Assist** in IDEs during development
2. **Set up custom Vertex AI integration** for PR reviews
3. **Leverage existing GCP infrastructure**

**Hybrid Approach (Best of All Worlds):**

```yaml
# .github/workflows/multi-ai-review.yml
name: Multi-AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  copilot-review:
    runs-on: ubuntu-latest
    steps:
      - name: Request Copilot Review
        run: gh pr review ${{ github.event.pull_request.number }} --request copilot

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: trufflesecurity/trufflehog@main

  custom-claude-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.changed_files > 20
    steps:
      - name: Deep Review with Claude
        # Large PR = use Claude's big context window
        run: ./scripts/claude-review.sh
```

---

## Implementation Checklist

### Getting Started with AI Code Reviews

- [ ] Evaluate team's needs and current tooling
- [ ] Choose primary AI reviewer based on requirements
- [ ] Set up authentication (API keys, permissions)
- [ ] Install necessary GitHub Apps or Actions
- [ ] Create custom instructions for your project
- [ ] Test with sample PRs
- [ ] Train team on using AI reviews
- [ ] Set up feedback collection process
- [ ] Monitor costs and adjust as needed
- [ ] Iterate based on team feedback

### Security Considerations

- [ ] Use GitHub Secrets for API keys
- [ ] Review AI provider's data retention policies
- [ ] Ensure compliance with your organization's policies
- [ ] Limit AI access to non-sensitive repositories first
- [ ] Monitor what data is sent to AI services
- [ ] Implement rate limiting to control costs
- [ ] Regular audit of AI review accuracy
- [ ] Keep API keys rotated

---

## Additional Resources

### GitHub Copilot

- [Official Documentation](https://docs.github.com/en/copilot)
- [Code Review Guide](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review)
- [Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)

### Claude

- [Anthropic Documentation](https://docs.anthropic.com/)
- [API Reference](https://docs.anthropic.com/en/api/getting-started)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)

### Gemini

- [Gemini for Google Cloud](https://cloud.google.com/gemini/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Code Assist Guide](https://cloud.google.com/gemini/docs/codeassist/overview)

### GitHub Marketplace

- [AI Code Review Apps](https://github.com/marketplace?type=apps&query=ai+code+review)
- [Code Quality Actions](https://github.com/marketplace?type=actions&category=code-quality)

---

## Conclusion

Adding AI code reviewers to your GitHub project can significantly improve code quality, catch bugs early, and reduce review time. While GitHub Copilot offers the most seamless integration, Claude and Gemini provide powerful alternatives for teams with specific needs or existing cloud infrastructure.

**Quick Summary:**

- **Easiest**: GitHub Copilot (native integration)
- **Most Powerful**: Claude (large context, high quality)
- **Best for GCP Users**: Gemini Code Assist
- **Most Flexible**: Third-party apps or custom integrations

Choose based on your team's technical expertise, existing infrastructure, budget, and specific code review requirements.

---

**Last Updated**: November 12, 2024
**Version**: 1.0
