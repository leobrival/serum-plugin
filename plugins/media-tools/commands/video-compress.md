---
description: Compress and convert videos using FFmpeg
allowed-tools: [Bash, Read, Glob]
argument-hint: <file_path> [options]
arguments:
  - name: Resolution
    default: "1080p"
    options: ["4K", "1440p", "1080p", "720p", "480p"]
  - name: Format
    default: "mp4"
    options: ["mp4", "webm", "mov", "gif"]
  - name: Quality
    default: "medium"
    options: ["high", "medium", "low", "web"]
  - name: FPS
    default: "original"
    options: ["original", "60", "30", "24", "15"]
---

# Video Compress Command

Compress and convert videos using FFmpeg.

## Arguments

$ARGUMENTS

## Task

1. **Parse input**:
   - Extract file path from arguments
   - Parse Resolution, Format, Quality, and FPS values

2. **Get original video info**:
   ```bash
   ffprobe -v quiet -print_format json -show_format -show_streams "<input>"
   ```

3. **Map resolution to dimensions**:
   - 4K → 3840:-2
   - 1440p → 2560:-2
   - 1080p → 1920:-2
   - 720p → 1280:-2
   - 480p → 854:-2

4. **Map quality to CRF/bitrate**:
   - high → CRF 18 (H.264) / CRF 24 (VP9)
   - medium → CRF 23 (H.264) / CRF 30 (VP9)
   - low → CRF 28 (H.264) / CRF 36 (VP9)
   - web → CRF 30 + 2-pass

5. **Build FFmpeg command**:

   **MP4 (H.264):**
   ```bash
   ffmpeg -i "<input>" -vf "scale=<width>:-2" -c:v libx264 -crf <crf> -preset medium -c:a aac -b:a 128k "<output>.mp4"
   ```

   **WebM (VP9):**
   ```bash
   ffmpeg -i "<input>" -vf "scale=<width>:-2" -c:v libvpx-vp9 -crf <crf> -b:v 0 -c:a libopus -b:a 128k "<output>.webm"
   ```

   **GIF:**
   ```bash
   ffmpeg -i "<input>" -vf "fps=<fps>,scale=<width>:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "<output>.gif"
   ```

6. **Execute and report**:
   - Show progress
   - Display before/after sizes
   - Report compression ratio

## Resolution Reference

| Preset | Width | Common Name |
|--------|-------|-------------|
| 4K | 3840 | UHD |
| 1440p | 2560 | QHD |
| 1080p | 1920 | Full HD |
| 720p | 1280 | HD |
| 480p | 854 | SD |

## Quality Reference (CRF Values)

| Quality | H.264 CRF | VP9 CRF | Use Case |
|---------|-----------|---------|----------|
| high | 18 | 24 | Archival, editing |
| medium | 23 | 30 | General use |
| low | 28 | 36 | File size priority |
| web | 30 | 38 | Streaming, web |

## Examples

**Compress to 1080p MP4:**
```bash
ffmpeg -i "video.mov" -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k "video.mp4"
```

**Convert to WebM for web:**
```bash
ffmpeg -i "video.mp4" -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k "video.webm"
```

**Create optimized GIF:**
```bash
ffmpeg -i "video.mp4" -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "video.gif"
```

**Extract clip (10 seconds from 00:30):**
```bash
ffmpeg -i "video.mp4" -ss 00:00:30 -t 10 -c:v libx264 -crf 23 "clip.mp4"
```

## Requirements

- FFmpeg with libx264, libvpx-vp9, libopus
- Install: `brew install ffmpeg`

## Output

- Creates new file with format extension
- Original file is preserved
- Displays compression statistics and duration
