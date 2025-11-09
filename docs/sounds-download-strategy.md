# Sound Download Strategy

## Summary

Bundling the sound assets in the project is still the recommended approach. The repository currently includes pre-bundled WAV files in `data/` so consumers can play sounds without any runtime network dependency. When bundling is not possible (e.g. licensing or package-size concerns), the project implements a lazy on-demand download mechanism as a fallback.

- Original source for these audio files: https://www.thanatosrealms.com/war2/sounds/humans

Bundling avoids issues with remote availability, reduces complexity, and provides the best user experience.

---

## Current behavior (reference)

- The runtime uses the bundled `data/` assets by default and copies them into the effective data directory on first use. When no overrides are provided the code computes a platform-specific default data dir (see `src/plugin-config.ts`) and stores copied files there.
- The plugin prefers bundled assets. As a fallback, lazy on-demand downloads are available for missing files rather than downloading everything at init. When a sound is required the code will:
  - Resolve the local data directory (see "Data directory precedence" below).
  - Check for the file locally via `soundExists(...)`.
  - If missing, call `ensureSoundAvailable(...)` / `downloadSoundByFilename(...)` to download just that file.
- There is an exported helper `downloadAllSounds()` that will download every entry, but it is not invoked automatically at runtime (it exists for manual use and tests).
- If a download fails at play time the plugin falls back to a system sound and continues to run.

Files: `src/sound-data.ts`, `src/download.ts`, `src/notification.ts`

---

## Data directory precedence

When determining where to read or write sound files the code follows this precedence:

1. If the plugin is supplied a `directory` context (for example when running inside an opencode project), the code will use `${directory}/.opencode-sounds` as the per-project cache (see `src/notification.ts:24`).
2. Else if the `SOUNDS_DATA_DIR` environment variable is set, that absolute path is used (see `src/sound-data.ts`).
3. Otherwise the default is the machine-wide cache directory `~/.config/opencode/sounds` (or OS-specific config directory equivalent) computed in `src/sound-data.ts`.

This means that by default, all opencode instances on the same machine will share the same sound cache, reducing redundant downloads and storage usage.

---

## Environment variables and what is implemented

- `SOUNDS_DATA_DIR` — Supported. When set, it overrides the default machine-wide cache location.
- `SOUNDS_BASE_URL` — Present and used by download helpers as a base URL; network downloads are only performed if download helpers are called explicitly (the runtime does not fetch remote files by default).
- `SOUNDS_DOWNLOAD_ON_INIT` — Not implemented in runtime code. There is no automatic init-time bulk download; `downloadAllSounds()` must be invoked explicitly.
- `SOUNDS_DOWNLOAD_COOLDOWN_MS` — Not implemented. The current implementation does not persist or honor a cooldown after failed download attempts.

---

## Problems and considerations (as implemented today)

- Startup is fast: the lazy approach avoids long init-time downloads.
- The first play of a missing sound may be slower (because it downloads that single file on-demand).
- There is no built-in cooldown or backoff in the current code; repeated failures will cause repeated failed attempts if the caller repeatedly requests the same missing sound.
- The project includes the `downloadAllSounds()` helper if consumers want to prefetch everything explicitly (for packaging or CI).

---

## Recommended actions (small or optional changes)

- If you want an opt-in prefetch step, implement `SOUNDS_DOWNLOAD_ON_INIT` handling and call `downloadAllSounds()` only when that env var is `true`.
- If you want to avoid repeated failed downloads, implement a simple cooldown (in-memory or a small marker file in the data dir) and honor an env var like `SOUNDS_DOWNLOAD_COOLDOWN_MS`.
- For best reliability, consider pre-populating the cache directory with required assets or providing a separate artifact containing sound files.

---

## Operational notes

- `downloadAllSounds()` is available for explicit prefetching (useful in CI or packaging steps).
- The code already implements a deduplication guard so concurrent attempts to download the same file are merged (see `src/download.ts`).

---

## Proposed next steps

- Update documentation to reflect these defaults (done).
- Optionally: implement cooldown and/or opt-in init prefetch if you want to change runtime behavior.

If you want, I can implement the cooldown and/or `SOUNDS_DOWNLOAD_ON_INIT` support next.
