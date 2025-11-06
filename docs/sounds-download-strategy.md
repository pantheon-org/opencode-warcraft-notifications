# Sound Download Strategy

## Summary

Bundling the sound assets in the project is the recommended approach. Ship pre-encoded, cross-platform artifacts (see `docs/audio-formats.md`) alongside a WAV master for editing. This removes the runtime network dependency, ensures deterministic behaviour, and eliminates startup delays. If bundling is not possible (e.g. licensing or package-size concerns), prefer a lazy on-demand download with caching and a cooldown as a secondary option.

- See `docs/audio-formats.md` for format recommendations (Opus → MP3 → WAV fallback).
- Original source for these audio files: https://www.thanatosrealms.com/war2/sounds/humans


Bundling avoids issues with remote availability, reduces complexity, and provides the best user experience.

---

## Current behavior (reference)

- On plugin initialization the code checks for the presence of a single file (`human_selected1.wav`). If it is missing, `downloadAllSounds()` is called which tries to download every sound in the catalog.
- If downloads fail, the plugin falls back to a system sound and continues to run.
- The base URL used to download is configurable via `SOUNDS_BASE_URL`.

Files: `src/sounds/download.ts`, `src/sounds/index.ts`, `src/notification.ts`

---

## Problems and risks

- Slow startup: downloading many files on init can cause noticeable delay before the plugin becomes responsive.
- Fragility: if the remote `SOUNDS_BASE_URL` is down or the files are removed, the init download will fail (and may spam logs).
- Wasteful network usage: users who never hear most of the sounds still download them.
- Lack of retry/backoff/cooldown: repeated failures may immediately retry on every run.
- External dependency: relying on a site you don't control increases maintenance burden.

---

## Recommended options (ranked)

1. Bundle assets with the plugin (Highest reliability)
   - Include the `data/` sound files in the package or as a separate asset release / npm package.
   - Pros: no runtime network dependency, instant availability.
   - Cons: larger package size and increased repo size if checked into source.

2. Lazy (on-demand) download with caching + cooldown (Balanced)
   - Do not download anything at init. When the plugin needs to play a specific sound:
     - Check local cache (e.g. `data/<filename>`).
     - If missing, attempt to download just that single file.
     - If download fails, fallback to system sound and start a cooldown so the same failed download isn't retried for a configurable period.
   - Pros: fast init, minimal bandwidth, graceful handling of remote failures.
   - Cons: first play of a sound may be slower while that single file downloads.

3. Validate remote availability + mirrors
   - Use `HEAD` requests to validate file/host availability before starting large downloads.
   - Support a configurable list of mirrors and try alternates if the primary fails.
   - Add retry with exponential backoff for transient errors.

4. Provide an explicit offline update command
   - Add an `npm run update-sounds` or similar script to prefetch and pin files locally for offline users.

---

## Concrete code suggestions (minimal changes)

- Add `downloadSoundByFilename(filename)` to `src/sounds/download.ts` which finds the path for a single filename and downloads only that file (reusing existing download logic).

- Replace init-time `downloadAllSounds()` call with a lightweight `ensureSoundAvailable(filename)` that:
  - Returns `true` if `soundExists(filename)` is true.
  - If not, and a cooldown hasn't elapsed, attempts `downloadSoundByFilename(filename)`.
  - On failure, sets a cooldown timestamp (e.g. saved in `data/.last_download_attempt` or in-memory) and returns `false` so the caller plays a fallback sound.

- Example pseudocode:

```ts
// notification.ts (play-time)
const soundFilename = getRandomSound();
const ok = await ensureSoundAvailable(soundFilename);
if (ok) {
  const soundPath = getSoundPath(soundFilename);
  // play soundPath
} else {
  // fallback to system sound
}
```

- Environment variables to support behavior:
  - `SOUNDS_BASE_URL` — base URL for remote sounds (already present).
  - `SOUNDS_DOWNLOAD_ON_INIT` — if `true` keep existing behavior; default `false`.
  - `SOUNDS_DOWNLOAD_COOLDOWN_MS` — cooldown period after failed download attempts.
  - `SOUNDS_LOCAL_PATH` — override the local data directory (optional).

---

## Operational recommendations

- If you maintain the remote sound host, consider moving assets to a stable host (GitHub Releases, S3/CloudFront) to reduce risk.
- Add logging/metrics for remote unavailability so maintainers are aware when the upstream host stops serving assets.
- Document how to pre-bundle or prefetch sounds (e.g. `npm run update-sounds`) for offline or CI usage.

---

## Proposed next steps

- Implement the lazy-on-demand download + cooldown (small code changes to `src/sounds/download.ts` and `src/notification.ts`) — recommended.
- Alternatively, if preferred, add the sound assets to the repository or package and skip runtime downloads.

If you want, I can implement the lazy-download + cooldown changes now.
