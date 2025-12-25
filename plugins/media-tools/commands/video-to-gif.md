---
description: Convert video clips to optimized GIFs
allowed-tools: [Bash, Read]
argument-hint: <file_path> [options]
arguments:
  - name: Width
    default: "480"
    options: ["800", "640", "480", "320", "240"]
  - name: FPS
    default: "15"
    options: ["30", "24", "15", "12", "10"]
  - name: Duration
    default: "full"
    options: ["full", "10", "5", "3"]
  - name: Start
    default: "0"
    options: ["0", "5", "10", "30", "60"]
---

# Video to GIF Command

Convert video clips to optimized, high-quality GIFs.

## Arguments

$ARGUMENTS

## Task

1. **Parse input**:
   - Extract file path
   - Parse Width, FPS, Duration, and Start values

2. **Get video info**:
   ```bash
   ffprobe -v quiet -show_entries format=duration -of csv=p=0 "<input>"
   ```

3. **Build FFmpeg command** (2-pass for quality):

   **Pass 1 - Generate palette:**
   ```bash
   ffmpeg -ss <start> -t <duration> -i "<input>" \
     -vf "fps=<fps>,scale=<width>:-1:flags=lanczos,palettegen=stats_mode=diff" \
     -y palette.png
   ```

   **Pass 2 - Create GIF:**
   ```bash
   ffmpeg -ss <start> -t <duration> -i "<input>" -i palette.png \
     -lavfi "fps=<fps>,scale=<width>:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
     -y "<output>.gif"
   ```

4. **Cleanup and report**:
   - Remove temporary palette.png
   - Display output size and duration

## Quality Tips

| Setting | File Size Impact | Quality Impact |
|---------|------------------|----------------|
| Higher FPS | Larger | Smoother |
| Larger Width | Larger | Sharper |
| Longer Duration | Larger | More content |
| Lower FPS (10-12) | Smaller | Slightly choppy |

## Size Estimation

| Width | 5s @ 15fps | 10s @ 15fps |
|-------|------------|-------------|
| 800px | ~5-10 MB | ~10-20 MB |
| 480px | ~2-5 MB | ~4-10 MB |
| 320px | ~1-3 MB | ~2-6 MB |
| 240px | ~0.5-2 MB | ~1-4 MB |

## Examples

**Full video to GIF:**
```bash
ffmpeg -i "video.mp4" \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  "output.gif"
```

**First 5 seconds only:**
```bash
ffmpeg -t 5 -i "video.mp4" \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  "output.gif"
```

**Start at 30 seconds, 10 second clip:**
```bash
ffmpeg -ss 30 -t 10 -i "video.mp4" \
  -vf "fps=12,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  "output.gif"
```

## Requirements

- FFmpeg
- Install: `brew install ffmpeg`

## Output

- Creates GIF in same directory as source
- Original video is preserved
- Displays file size and frame count
