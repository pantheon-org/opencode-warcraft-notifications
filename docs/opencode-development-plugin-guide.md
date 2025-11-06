# Opencode plugin development guide

> Generated with LLM assistance on 2 Nov 2025 with _minimal_ human verification.

## Overview

Opencode plugins extend the functionality of the Opencode AI assistant by allowing you to add custom tools, authentication providers, event handlers, and hooks into the core system. This guide covers how to create, configure, and distribute plugins.

**Source files:**

- Plugin types and interfaces: `packages/plugin/src/index.ts`
- Tool definition utilities: `packages/plugin/src/tool.ts`
- Shell integration: `packages/plugin/src/shell.ts`
- Example plugin: `packages/plugin/src/example.ts`
- Plugin loading system: `packages/opencode/src/plugin/index.ts`

## Plugin structure

A plugin is a TypeScript module that exports a function conforming to the `Plugin` type:

```typescript
import { Plugin, tool } from '@opencode-ai/plugin'

export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      myTool: tool({
        description: 'Custom tool',
        args: { input: tool.schema.string() },
        execute: async (args) => `Result: ${args.input}`,
      }),
    },
    auth: {
      provider: 'myservice',
      methods: [{ type: 'api', label: 'API Key' }],
    },
    event: async ({ event }) => console.log(event.type),
    config: async (config) => (config.myPlugin = { enabled: true }),
    'chat.message': async ({}, { message }) => console.log(message.content),
    'chat.params': async (
      { model, provider, message },
      { temperature, topP, options },
    ) => {
      temperature = 0.7
      options.custom = 'value'
    },
    'permission.ask': async (perm, out) => (out.status = 'allow'),
    'tool.execute.before': async ({ tool }, { args }) => (args.modified = true),
    'tool.execute.after': async ({ tool }, { title, output, metadata }) => {
      console.log(`Tool ${tool} completed:`, output)
    },
  }
}
```

_Source: `packages/plugin/src/index.ts` - Plugin type definition and interfaces_

## Plugin Context (ctx) API

```typescript
// Plugin Context (ctx) API Overview
ctx.client // Opencode SDK client (localhost:4096)
ctx.project.id // Project identifier (git hash or "global")
ctx.project.worktree // Git worktree root directory
ctx.project.vcs // Version control system ("git" or undefined)
ctx.directory // Current working directory
ctx.worktree // Git worktree root (alias for ctx.project.worktree)
ctx.$`command` // Bun shell for executing commands
ctx.$`git status`.text() // Shell command with output methods
```

For client, see: https://opencode.ai/docs/sdk/#app

_Source: `packages/plugin/src/index.ts` - PluginInput type definition and `packages/opencode/src/plugin/index.ts` - Context initialization_

## Events

**Session Events:**

- `session.created` - New session created
- `session.updated` - Session updated
- `session.deleted` - Session deleted
- `session.error` - Session error occurred
- `session.idle` - Session became idle

**Message Events:**

- `message.updated` - Message updated
- `message.removed` - Message removed
- `message.part.updated` - Message part updated
- `message.part.removed` - Message part removed

**File Events:**

- `file.edited` - File was edited
- `file.watcher.updated` - File watcher detected changes (add/change/unlink)

**Permission Events:**

- `permission.updated` - Permission updated
- `permission.replied` - Permission response received

**Server Events:**

- `server.connected` - Server connected

**LSP Events:**

- `lsp.updated` - Language Server Protocol updated
- `lsp.diagnostics` - LSP diagnostics available

**Command Events:**

- `command.executed` - Command executed

**TUI Events:**

- `tui.prompt.append` - Text appended to TUI prompt
- `tui.command.execute` - Command executed in TUI
- `tui.toast.show` - Toast shown in TUI

**Other Events:**

- `installation.updated` - Installation updated
- `ide.installed` - IDE extension installed

Sources: `packages/sdk/go/event.go`

## Plugin Hooks

Plugins can implement various hooks to integrate with Opencode:

### Tool Definition

Add custom tools that the AI can use:

```typescript
import { tool } from '@opencode-ai/plugin'

export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: 'This is a custom tool',
        args: {
          foo: tool.schema.string().describe('foo parameter'),
          count: tool.schema.number().optional().describe('optional count'),
        },
        async execute(args, context) {
          // context includes: sessionID, messageID, agent, abort
          return `Hello ${args.foo}! Count: ${args.count || 1}`
        },
      }),
    },
  }
}
```

_Source: `packages/plugin/src/tool.ts` - Tool definition utilities and `packages/plugin/src/example.ts` - Example tool implementation_

### Authentication Providers

Add custom authentication methods:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    auth: {
      provider: 'myservice',
      loader: async (auth, provider) => {
        // Load authentication configuration
        return { apiKey: 'loaded-key' }
      },
      methods: [
        {
          type: 'oauth',
          label: 'Connect MyService',
          async authorize() {
            return {
              url: 'https://myservice.com/oauth/authorize',
              instructions: 'Authorize Opencode to access MyService',
              method: 'code',
              async callback(code) {
                // Handle OAuth callback
                return {
                  type: 'success',
                  access: 'access-token',
                  refresh: 'refresh-token',
                  expires: Date.now() + 3600000,
                }
              },
            }
          },
        },
      ],
    },
  }
}
```

### Event Handlers

Respond to system events:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    event: async ({ event }) => {
      console.log('Event received:', event.type)
    },
  }
}
```

_Source: `packages/plugin/src/index.ts` - Hooks interface definition_

### Chat Message Hooks

Intercept and modify chat messages:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    'chat.message': async ({}, { message, parts }) => {
      // Modify message before sending to LLM
      console.log('Message:', message.content)
    },
  }
}
```

### Chat Parameter Modification

Modify LLM parameters:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    'chat.params': async (
      { model, provider, message },
      { temperature, topP, options },
    ) => {
      // Adjust parameters based on context
      temperature = 0.7
      options.customParam = 'value'
    },
  }
}
```

### Permission Control

Control permission requests:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    'permission.ask': async (permission, output) => {
      // Auto-allow certain permission types
      if (permission.type === 'read_file') {
        output.status = 'allow'
      }
    },
  }
}
```

### Tool Execution Hooks

Intercept tool execution:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    'tool.execute.before': async ({ tool, sessionID, callID }, { args }) => {
      // Modify arguments before execution
      if (tool === 'mytool') {
        args.modified = true
      }
    },
    'tool.execute.after': async (
      { tool, sessionID, callID },
      { title, output, metadata },
    ) => {
      // Process tool results
      console.log(`Tool ${tool} executed:`, output)
    },
  }
}
```

### Configuration Hook

Modify Opencode configuration:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    config: async (config) => {
      // Add configuration options
      config.myPlugin = { enabled: true }
    },
  }
}
```

_Source: `packages/opencode/src/permission/index.ts` - Permission system integration_

## Shell Integration

Plugins have access to a Bun shell for executing commands:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      gitStatus: tool({
        description: 'Get git status',
        args: {},
        async execute() {
          const result = await ctx.$`git status --porcelain`
          return result.text()
        },
      }),
    },
  }
}
```

_Source: `packages/plugin/src/shell.ts` - Bun shell interface definition_

## Project Setup

### 1. Create Plugin Package

```bash
mkdir my-opencode-plugin
cd my-opencode-plugin
bun init
```

### 2. Install Dependencies

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "latest",
    "@opencode-ai/sdk": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest"
  }
}
```

### 3. Configure TypeScript

```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "module": "preserve",
    "declaration": true,
    "moduleResolution": "bundler"
  },
  "include": ["src"]
}
```

_Source: `packages/plugin/tsconfig.json` - TypeScript configuration reference_

### 4. Create Plugin Source

```typescript
// src/index.ts
import { Plugin, tool } from '@opencode-ai/plugin'

export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      hello: tool({
        description: 'Say hello',
        args: {
          name: tool.schema.string().describe('Name to greet'),
        },
        async execute({ name }) {
          return `Hello, ${name}!`
        },
      }),
    },
  }
}
```

## Plugin Configuration

_Source: `opencode.json` - Configuration file reference and `packages/opencode/src/config/config.ts` - Configuration loading system_

### Local Development

Add your plugin to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///path/to/your/plugin/dist/index.js"]
}
```

### Published Plugins

For published npm packages:

```json
{
  "plugin": ["my-opencode-plugin@1.0.0"]
}
```

### Multiple Plugins

```json
{
  "plugin": [
    "plugin-one@latest",
    "plugin-two@2.0.0",
    "file:///path/to/local/plugin"
  ]
}
```

## Building and Publishing

Use the prefix `opencode-` for plugin names:

- `opencode-my-service`
- `opencode-custom-tools`

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      riskyTool: tool({
        description: 'Tool that might fail',
        args: {},
        async execute() {
          try {
            const result = await ctx.$`some-command`
            return result.text()
          } catch (error) {
            return `Error: ${error.message}`
          }
        },
      }),
    },
  }
}
```

### 2. Async Operations

All plugin hooks are async - use proper async/await:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  return {
    event: async ({ event }) => {
      await processEvent(event)
    },
  }
}
```

### 3. Type Safety

Leverage TypeScript for type safety:

```typescript
import { z } from 'zod'

export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      typedTool: tool({
        description: 'Tool with typed arguments',
        args: {
          url: tool.schema.string().url().describe('Valid URL'),
          count: tool.schema.number().min(1).max(100).describe('Count 1-100'),
        },
        async execute(args) {
          // args are fully typed
          return `Processing ${args.url} ${args.count} times`
        },
      }),
    },
  }
}
```

### 4. Resource Management

Clean up resources when needed:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  const cleanup = setupResource()

  return {
    event: async ({ event }) => {
      if (event.type === 'shutdown') {
        await cleanup()
      }
    },
  }
}
```

## Testing Plugins

_Source: `packages/plugin/package.json` - Build and test scripts reference_

### Unit Testing

```typescript
// src/index.test.ts
import { describe, it, expect } from 'bun:test'
import { MyPlugin } from './index'

describe('MyPlugin', () => {
  it('should register tools', async () => {
    const mockCtx = createMockContext()
    const hooks = await MyPlugin(mockCtx)

    expect(hooks.tool).toBeDefined()
    expect(hooks.tool.hello).toBeDefined()
  })
})
```

### Integration Testing

Test with actual Opencode instance:

```bash
# Link local plugin for testing
bun link
cd /path/to/opencode/project
bun link my-opencode-plugin

# Add to opencode.json and test
```

## Debugging

### Logging

Use console.log for debugging:

```typescript
export const MyPlugin: Plugin = async (ctx) => {
  console.log('Plugin loading with context:', ctx.project.name)

  return {
    tool: {
      debugTool: tool({
        description: 'Debug tool',
        args: {},
        async execute() {
          console.log('Debug tool executed')
          return 'Debug complete'
        },
      }),
    },
  }
}
```

### Plugin Loading Issues

Check plugin loading with:

```bash
opencode --verbose
```

## Examples

### File System Plugin

```typescript
export const FileSystemPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      listFiles: tool({
        description: 'List files in directory',
        args: {
          path: tool.schema.string().describe('Directory path'),
        },
        async execute({ path }) {
          const result = await ctx.$`ls -la ${path}`
          return result.text()
        },
      }),
      readFile: tool({
        description: 'Read file contents',
        args: {
          path: tool.schema.string().describe('File path'),
        },
        async execute({ path }) {
          const file = Bun.file(path)
          return await file.text()
        },
      }),
    },
  }
}
```

### API Integration Plugin

```typescript
export const APIPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      fetchAPI: tool({
        description: 'Fetch data from API',
        args: {
          url: tool.schema.string().url().describe('API URL'),
          method: tool.schema.enum(['GET', 'POST']).default('GET'),
        },
        async execute({ url, method }) {
          const response = await fetch(url, { method })
          return await response.text()
        },
      }),
    },
  }
}
```

## Recipe: sending session prompt

```typescript
// https://github.com/malhashemi/opencode-skills/blob/main/index.ts
tool({
  async execute(args, toolCtx) {
    ctx.client.session.prompt({
      path: { id: toolCtx.sessionID },
      body: {
        noReply: true,
        parts: [{ type: 'text', text }],
      },
    })
  },
})
```

## Distribution

## Source files

- Plugin loading and initialization: `packages/opencode/src/plugin/index.ts`
- Tool registry integration: `packages/opencode/src/tool/registry.ts`
- Authentication provider integration: `packages/opencode/src/provider/provider.ts`
- Permission system hooks: `packages/opencode/src/permission/index.ts`
- Session prompt hooks: `packages/opencode/src/session/prompt.ts`

## Source

Gist: <https://gist.github.com/rstacruz/946d02757525c9a0f49b25e316fbe715>