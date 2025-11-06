# Cross-platform Audio Format Recommendations

## Short answer

- Ship `MP3` for maximum out-of-the-box compatibility across Windows, macOS and Linux.
- Prefer `Opus` (in an Ogg or Opus container) when you want best quality-per-size and your runtime supports it.
- Keep a `WAV` (16-bit PCM) master for editing and for the lowest-latency, simplest playback of very short UI sounds.

---

## Why these formats

- MP3
  - Universally supported by native players, browsers, and system frameworks on Windows, macOS and most Linux distributions.
  - Good quality at modest bitrates; simple fallback choice when a runtime lacks Opus support.

- Opus (in `.opus` or `.ogg` container)
  - Best modern codec for low-bitrate, high-quality audio (speech and music).
  - Smaller files than MP3 for equivalent perceived quality.
  - Supported by modern browsers, many Linux distros, recent macOS and Windows builds (via libraries) and multimedia frameworks.

- AAC / M4A
  - Very good quality and widely supported on Apple platforms and many players.
  - Not as universally available on minimal Linux installs without codecs.

- WAV (PCM)
  - Uncompressed; trivial to decode and great for extremely low latency and maximum compatibility.
  - Large file sizes, so use mainly as a master source or for very short effects.

---

## Practical recommendation (what to ship)

- Keep a high-quality `WAV` master for editing (`44.1 kHz`, `16-bit` PCM).
- Produce at least one compressed artifact for distribution:
  - Primary: `sound.mp3` (e.g. `128k` bitrate) for the broadest compatibility.
  - Optional preferred: `sound.opus` (e.g. `48k` bitrate) for smaller size and better quality when supported.
- If you want to support Apple-first workflows, also provide `sound.m4a` (AAC) as an optional artifact.
- Provide a simple fallback order in your code: prefer Opus → then MP3 → then WAV.

---

## Per-platform notes

- Windows
  - MP3 and WAV are universally supported by native APIs (Media Foundation, direct playback tools).
  - Opus may require shipping a decoder or relying on the runtime (Electron, browsers generally support Opus).

- macOS
  - MP3, WAV and AAC/M4A are well supported via AVFoundation/QuickTime.
  - Opus support is available in recent environments but is less "native"; using Opus is fine when your runtime handles decoding.

- Linux
  - Support varies by distribution and installed codecs. MP3 and WAV are broadly available; Opus is common on modern distros.
  - If targeting minimal containers, prefer MP3 or WAV unless you bundle decoders.

---

## Recommended encoding settings

- Sample rate: `44100` Hz (or `48000` Hz if your app standardizes on it)
- Channels: mono for short UI/notification sounds, stereo for music
- WAV: `16-bit PCM` (sample format `s16`)
- MP3: `128k` CBR or `128k` VBR for good quality-to-size tradeoff
- Opus: `24k–64k` depending on target quality (voice can be very good at `32k–48k`)

---

## Useful ffmpeg conversion commands

- Make a normalized WAV master (44.1 kHz, mono, 16-bit):

```
ffmpeg -i input.wav -ar 44100 -ac 1 -sample_fmt s16 output_master.wav
```

- Create a good MP3 (128 kbps):

```
ffmpeg -i output_master.wav -c:a libmp3lame -b:a 128k output.mp3
```

- Create an Opus file (48 kbps):

```
ffmpeg -i output_master.wav -c:a libopus -b:a 48k output.opus
```

- Create an AAC/M4A file (128 kbps):

```
ffmpeg -i output_master.wav -c:a aac -b:a 128k output.m4a
```

- Normalize loudness (ITU-R BS.1770) and encode to MP3:

```
ffmpeg -i input.wav -af loudnorm -c:a libmp3lame -b:a 128k output_normalized.mp3
```

---

## Fallback strategy example (runtime logic)

1. If runtime supports Opus and `sound.opus` exists, play `sound.opus`.
2. Else if `sound.mp3` exists, play `sound.mp3`.
3. Else fall back to `sound.wav`.

This gives best filesize/quality while keeping compatibility.

---

## Notes about runtime support and latency

- For Electron, modern browsers, and most desktop frameworks, Opus and MP3 are both safe; prefer Opus for bandwidth-sensitive cases.
- For very short UI sounds where startup/decoding latency matters, WAV (preloaded in memory) is the simplest approach.
- If you control the runtime, consider decoding to PCM once at startup and reusing the decoded buffer to eliminate per-play decode cost.

---

## Quick checklist

- [ ] Keep `output_master.wav` (44.1 kHz, 16-bit) in source
- [ ] Produce `output.mp3` (128k) for distribution
- [ ] Optionally produce `output.opus` (48k) for best size/quality
- [ ] Implement fallback order: Opus → MP3 → WAV

---

If you want, I can add a small script in `scripts/` to automate conversions with `ffmpeg` and create the recommended artifacts. 
