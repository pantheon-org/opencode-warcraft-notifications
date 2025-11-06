# Sounds: Download, Local Cache, and CI Guidance

This document explains how the plugin stores and downloads Warcraft II sound assets, the environment variables you can use to control behavior, recommended defaults, and tips for development and CI.

## Where sounds are stored

- Default (developer-friendly): a hidden per-project folder `.opencode-sounds` inside the project directory when the plugin runs in a checked-out repo.
- Override: set the `SOUNDS_DATA_DIR` environment variable to an absolute path to control where sounds are stored.
- Example default path (project root): `./.opencode-sounds`

Why this is configurable

- Avoids relying on a single implicit `data/` directory that may be present only on some developer machines.
- Lets CI and automated runners use isolated temporary directories to avoid test flakiness.
- Enables using a shared or OS-specific cache (e.g., CI cache, `$XDG_CACHE_HOME`, or a mounted volume) if desired.

## Environment variables

- `SOUNDS_DATA_DIR` — Absolute path where sound files are read from and cached. When set, it overrides the plugin's project-local default.
- `SOUNDS_BASE_URL` — Base URL for downloading remote sound assets (the host that serves the WAV files).
- `SOUNDS_DOWNLOAD_ON_INIT` — (optional) If `true`, keep the legacy behavior of attempting to download all sounds at plugin initialization. Default is `false` to prefer lazy, on-demand downloads.
- `SOUNDS_DOWNLOAD_COOLDOWN_MS` — (optional) Milliseconds to wait before retrying a failed download. Useful to prevent repeated retries in CI or on flaky networks.

## Recommended runtime behavior

1. Do not download every sound at plugin initialization by default.
2. When a sound is needed at playback time:
   - Check `soundExists(filename)` in the configured `SOUNDS_DATA_DIR`.
   - If missing, call `downloadSoundByFilename(filename)` to fetch just that file.
   - If download fails, play a system fallback sound and record a cooldown to avoid repeated immediate retry.
3. Provide `SOUNDS_DOWNLOAD_ON_INIT=true` only for environments that intentionally prefetch (for example when bundling or when CI prepares assets).

This approach minimizes startup latency and network usage while keeping behavior robust when remote assets are unavailable.

## Development tips

- Local development: set `SOUNDS_DATA_DIR` to a per-test temporary directory to make tests hermetic.
  - Example (POSIX shells):

    ```bash
    export SOUNDS_DATA_DIR=$(mktemp -d)
    bun test
    ```

- If you prefer to keep sounds in the repository for offline use, add `data/` to version control or provide a separate release artifact containing `data/`.

- To reproduce or debug downloads, set `SOUNDS_BASE_URL` to a test server or local fileserver that serves the same file layout.

## CI recommendations

- Configure CI to provide a deterministic `SOUNDS_DATA_DIR` (e.g., an ephemeral workspace path or CI cache path) so downloads don't interfere with other builds.
- Prefer to prefetch required assets in a CI step (for example using an `npm`/`bun` script) and commit them to the build cache or artifact store, rather than letting many builds each download from the public host.
- If CI must exercise download logic, increase `SOUNDS_DOWNLOAD_COOLDOWN_MS` to avoid noisy retries and set `SOUNDS_BASE_URL` to a stable internal mirror.

## Example usages

- Use per-project cache (default behavior):

  No environment variables required — plugin will create and use `./.opencode-sounds`.

- Override to a shared cache:

  ```bash
  export SOUNDS_DATA_DIR="$HOME/.cache/opencode-warcraft-sounds"
  export SOUNDS_BASE_URL="https://your.cdn.example/war2/sounds"
  ```

- Run tests with an isolated temp dir:

  ```bash
  export SOUNDS_DATA_DIR=$(mktemp -d)
  bun test
  ```

## Prefetch script (suggested)

You can add a simple script to pre-download or bundle sounds for offline use. Example (not included in this repo by default):

```bash
# scripts/download-sounds.sh (example)
set -euo pipefail
OUT=${SOUNDS_DATA_DIR:-"$(pwd)/.opencode-sounds"}
mkdir -p "$OUT"
BASE=${SOUNDS_BASE_URL:-"https://www.thanatosrealms.com/war2/sounds"}
FILES=(
  human_selected1.wav
  human_acknowledge1.wav
  work_completed.wav
  # ...add the full manifest you want to prefetch
)
for f in "${FILES[@]}"; do
  curl -sfL "$BASE/$f" -o "$OUT/$f" || echo "warning: failed to fetch $f"
done
```

Run it with `SOUNDS_DATA_DIR=/path/to/dir bash scripts/download-sounds.sh`.

## Notes and next steps

- The project docs include a deeper design discussion in `docs/sounds-download-strategy.md` — review that for the rationale and further implementation suggestions.
- Consider adding an `npm`/`bun` script `update-sounds` or a small CLI helper to manage prefetching and mirroring.

---

## Style: Arrow Functions

- Project preference: use arrow functions for all new JavaScript/TypeScript function definitions and callbacks.
- Rationale: arrow functions provide consistent `this` binding, shorter syntax, and are easier to refactor safely.
- Examples:
  - Preferred: `const add = (a: number, b: number) => a + b`;
  - Avoid (named function declaration): `function add(a: number, b: number) { return a + b }`.

Guidance:

- Prefer `const` + arrow for top-level and exported functions.
- Use arrow callbacks for array methods and promise handlers (`.map`, `.then`, etc.).
- When converting existing `function` declarations, ensure the change does not rely on hoisting or `this` as a constructor.

---

This file was added to document how the plugin handles sound assets and how to configure behavior for development and CI.
