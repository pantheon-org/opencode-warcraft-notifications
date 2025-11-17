# Documentation Source Files

This directory contains the original source documentation for the opencode-warcraft-notifications project in markdown format.

## Structure

```
docs/
├── index.md                    # Project overview and introduction
├── user-guide.md               # Installation, configuration, and usage
├── api.md                      # API reference
├── development.md              # Developer guide
├── architecture.md             # System architecture
├── deployment.md               # Deployment guide
├── pipeline.md                 # CI/CD pipeline documentation
├── troubleshooting.md          # Troubleshooting guide
├── onboarding.md               # New contributor onboarding
├── quick-reference.md          # Quick reference guide
├── validate-schema.md          # Schema validation documentation
├── github-workflows/           # GitHub Actions workflow documentation
│   ├── index.md
│   ├── overview.md
│   ├── setup-guide.md
│   └── ...
└── schemas/                    # JSON schemas and examples
    ├── plugin.json.schema
    └── plugin.json.example
```

## Workflow

1. **Edit** documentation in this directory (./docs/)
2. **Transform** with `bun run pages:transform` - copies to `./pages/src/content/docs/`
3. **Build** with `bun run pages:build` - generates static site in `./pages/dist/`
4. **Deploy** via GitHub Actions - pushes to `docs` branch for GitHub Pages

## Guidelines

- Use GitHub-flavored markdown
- Include code examples with proper syntax highlighting
- Keep line length reasonable for readability
- Update frontmatter appropriately (title, description, etc.)
- Validate links before committing

## See Also

- Build configuration: `../pages/`
- Transformation script: `../pages/transform-docs.js`
- GitHub Pages deployment: `.github/workflows/deploy-docs.yml`
