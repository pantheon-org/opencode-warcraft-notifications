# Sounds: Download, Local Cache, and CI Guidance

This document explains how the plugin stores and downloads Warcraft II sound assets, the environment variables the code recognizes, recommended defaults for this repo, and tips for development and CI.

## Where sounds are stored (actual behavior)

- **Machine-wide cache (default)**: `~/.config/opencode/sounds` (or OS-specific config directory equivalent) when no overrides are provided (see `src/sound-data.ts`).
- **Plugin configuration override**: set the `soundsDir` property in your `plugin.json` file (see configuration section below).
- **Environment override**: set the `SOUNDS_DATA_DIR` environment variable to an absolute path to control where sounds are read from or cached.

Why this is configurable

- Avoids relying on a single implicit `data/` directory on developer machines.
- Lets CI and automated runners use isolated temporary directories to avoid test flakiness.
- Enables using a shared or OS-specific cache (e.g., CI cache, `$XDG_CACHE_HOME`, or a mounted volume) if desired.

## Environment variables (what the code actually supports)

- `SOUNDS_DATA_DIR` — Supported. Absolute path where sound files are read from and cached. When set it overrides the default bundled `data/` location.
- `SOUNDS_BASE_URL` — Supported. Base URL for downloading remote sound assets when downloads occur.
- `SOUNDS_DOWNLOAD_ON_INIT` — Not implemented by runtime code. There is no automatic init-time bulk download; `downloadAllSounds()` must be called explicitly to prefetch everything.
- `SOUNDS_DOWNLOAD_COOLDOWN_MS` — Not implemented. The current implementation does not persist or honor a cooldown after failed downloads.

## Recommended runtime behavior (implemented in this repo)

1. The runtime uses lazy, on-demand downloads by default — it does not download every sound at initialization.
2. When a sound is needed at playback time the code:
   - Checks `soundExists(filename)` in the resolved data directory.
   - If missing, calls `ensureSoundAvailable(...)` / `downloadSoundByFilename(...)` to download just that file.
   - If the download fails at play time, the plugin falls back to a system sound and continues execution.
3. If you want to prefetch all files, call the `downloadAllSounds()` helper explicitly (useful in CI or packaging steps).

This minimizes startup latency while still providing an explicit bulk-prefetch option.

## Development tips

- Local development: set `SOUNDS_DATA_DIR` to a per-test temporary directory to make tests hermetic.
  - Example (POSIX shells):

    ```bash
    export SOUNDS_DATA_DIR=$(mktemp -d)
    bun test
    ```

- If you prefer to keep sounds in the repository for offline use, the repo already includes `data/` WAV assets.

- To reproduce or debug downloads, set `SOUNDS_BASE_URL` to a test server or local fileserver that serves the same file layout.

## CI recommendations

- Configure CI to provide a deterministic `SOUNDS_DATA_DIR` (e.g., an ephemeral workspace path or CI cache path) so downloads don't interfere with other builds.
- Prefer to prefetch required assets in a CI step (for example using an `npm`/`bun` script) and store them in the build cache or artifacts, rather than letting many builds each download from the public host.
- If CI must exercise download logic, point `SOUNDS_BASE_URL` to a stable internal mirror.

## Plugin Configuration

The plugin looks for configuration in `plugin.json` files in the following order:

1. `CWD/.opencode/plugin.json` (project-specific configuration)
2. `~/.config/opencode/plugin.json` (global configuration)

### plugin.json format

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/custom/sounds/directory"
  }
}
```

See [schemas/plugin.json.example](./schemas/plugin.json.example) for a complete example and [schemas/plugin.json.schema](./schemas/plugin.json.schema) for the JSON schema.

## Example usages

- Use default machine-wide cache:

  No configuration required — sounds will be cached in `~/.config/opencode/sounds` (or OS-specific config directory equivalent) and shared across all opencode instances on the machine.

- Configure via plugin.json (project-specific):

  Create `.opencode/plugin.json` in your project root:

  ```json
  {
    "@pantheon-ai/opencode-warcraft-notifications": {
      "soundsDir": "/path/to/project/sounds"
    }
  }
  ```

- Configure via plugin.json (global):

  Create `~/.config/opencode/plugin.json`:

  ```json
  {
    "@pantheon-ai/opencode-warcraft-notifications": {
      "soundsDir": "/home/user/.cache/opencode-warcraft-sounds"
    }
  }
  ```

- Override to a shared cache via environment:

  ```bash
  export SOUNDS_DATA_DIR="$HOME/.cache/opencode-warcraft-sounds"
  export SOUNDS_BASE_URL="https://your.cdn.example/war2/sounds"
  ```

- Run tests with an isolated temp dir:

  ```bash
  export SOUNDS_DATA_DIR=$(mktemp -d)
  bun test
  ```

## Prefetch / packaging

- The helper `downloadAllSounds()` exists in `src/download.ts` for explicit bulk downloads. Call this in CI or packaging steps if you want to prepare a sound bundle.
- Consider adding a simple script (e.g., `scripts/download-sounds.sh` or an npm script) that calls `downloadAllSounds()` or fetches files to `SOUNDS_DATA_DIR` for offline builds.

## Notes and next steps

- The deeper design discussion is in `docs/sounds-download-strategy.md`.
- If you want runtime cooldowns or init-time prefetching controlled by env vars, I can implement those features in `src/download.ts` and update the docs accordingly.

---

This file documents how the plugin handles sound assets and how to configure behavior for development and CI (updated to reflect current code behavior).
