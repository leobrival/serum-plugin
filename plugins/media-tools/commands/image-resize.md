---
description: Resize and convert images using ImageMagick
allowed-tools: [Bash, Read, Glob]
argument-hint: <file_path> [options]
arguments:
  - name: Resolution
    default: "1920"
    options: ["3840", "2560", "1920", "1280", "800", "640"]
  - name: Ratio
    default: "16:9"
    options: ["16:9", "9:16", "3:2", "1:1", "4:5", "4:3", "21:9"]
  - name: Format
    default: "webp"
    options: ["webp", "jpg", "png", "avif"]
  - name: Quality
    default: "85"
    options: ["95", "85", "75", "65", "55"]
---

# Image Resize Command

Resize, crop, and convert images using ImageMagick.

## Arguments

$ARGUMENTS

## Task

1. **Parse input**:
   - Extract file path from arguments or use current selection
   - Parse Resolution, Ratio, Format, and Quality values

2. **Calculate dimensions**:
   - Based on Resolution (width) and Ratio, calculate target height
   - Ratio mappings:
     - 16:9 → height = width × 9/16
     - 9:16 → height = width × 16/9
     - 3:2 → height = width × 2/3
     - 1:1 → height = width
     - 4:5 → height = width × 5/4
     - 4:3 → height = width × 3/4
     - 21:9 → height = width × 9/21

3. **Build ImageMagick command**:
   ```bash
   magick "<input>" -resize <width>x<height>^ -gravity center -extent <width>x<height> -quality <quality> "<output>.<format>"
   ```

4. **Execute and report**:
   - Run the command
   - Show before/after file sizes
   - Confirm output location

## Examples

**Resize to 1920x1080 WebP at 85% quality:**
```bash
magick "photo.jpg" -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 "photo.webp"
```

**Square crop at 1280px:**
```bash
magick "photo.jpg" -resize 1280x1280^ -gravity center -extent 1280x1280 -quality 85 "photo.webp"
```

**Portrait 9:16 for stories:**
```bash
magick "photo.jpg" -resize 1080x1920^ -gravity center -extent 1080x1920 -quality 85 "photo.webp"
```

## Dimension Reference

| Resolution | 16:9 | 9:16 | 1:1 | 4:3 | 3:2 | 4:5 | 21:9 |
|------------|------|------|-----|-----|-----|-----|------|
| 3840 | 3840×2160 | 2160×3840 | 3840×3840 | 3840×2880 | 3840×2560 | 3840×4800 | 3840×1646 |
| 2560 | 2560×1440 | 1440×2560 | 2560×2560 | 2560×1920 | 2560×1707 | 2560×3200 | 2560×1097 |
| 1920 | 1920×1080 | 1080×1920 | 1920×1920 | 1920×1440 | 1920×1280 | 1920×2400 | 1920×823 |
| 1280 | 1280×720 | 720×1280 | 1280×1280 | 1280×960 | 1280×853 | 1280×1600 | 1280×549 |
| 800 | 800×450 | 450×800 | 800×800 | 800×600 | 800×533 | 800×1000 | 800×343 |
| 640 | 640×360 | 360×640 | 640×640 | 640×480 | 640×427 | 640×800 | 640×274 |

## Requirements

- ImageMagick 7+ (`magick` command)
- Install: `brew install imagemagick`

## Output

- Creates new file with format extension in same directory
- Original file is preserved
- Reports compression ratio achieved
