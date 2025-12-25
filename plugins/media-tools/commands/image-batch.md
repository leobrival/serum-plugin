---
description: Batch process multiple images with consistent settings
allowed-tools: [Bash, Read, Glob]
argument-hint: <directory_or_pattern> [options]
arguments:
  - name: Resolution
    default: "1920"
    options: ["3840", "2560", "1920", "1280", "800", "640"]
  - name: Ratio
    default: "16:9"
    options: ["16:9", "9:16", "3:2", "1:1", "4:5", "4:3", "21:9", "original"]
  - name: Format
    default: "webp"
    options: ["webp", "jpg", "png", "avif"]
  - name: Quality
    default: "85"
    options: ["95", "85", "75", "65", "55"]
---

# Image Batch Command

Process multiple images at once with consistent settings.

## Arguments

$ARGUMENTS

## Task

1. **Find images**:
   - Parse directory path or glob pattern from arguments
   - Find all image files (jpg, jpeg, png, gif, webp, tiff)

2. **Create output directory**:
   ```bash
   mkdir -p "<input_dir>/processed"
   ```

3. **Process each image**:
   - Apply Resolution and Ratio (if not "original")
   - Convert to target Format
   - Apply Quality setting

4. **Report summary**:
   - Total images processed
   - Total size before/after
   - Average compression ratio

## Examples

**Process all images in folder:**
```bash
/image-batch ./photos --Resolution 1920 --Ratio 16:9 --Format webp --Quality 85
```

**Compress without resizing:**
```bash
/image-batch ./images --Ratio original --Format webp --Quality 75
```

**Prepare for Instagram (4:5):**
```bash
/image-batch ./uploads --Resolution 1280 --Ratio 4:5 --Format jpg --Quality 85
```

## Batch Script Template

```bash
#!/bin/bash
INPUT_DIR="$1"
OUTPUT_DIR="${INPUT_DIR}/processed"
WIDTH=1920
HEIGHT=1080
QUALITY=85
FORMAT=webp

mkdir -p "$OUTPUT_DIR"

for img in "$INPUT_DIR"/*.{jpg,jpeg,png,gif,webp,tiff}; do
  [ -f "$img" ] || continue
  filename=$(basename "$img")
  name="${filename%.*}"
  magick "$img" \
    -resize ${WIDTH}x${HEIGHT}^ \
    -gravity center \
    -extent ${WIDTH}x${HEIGHT} \
    -quality $QUALITY \
    -strip \
    "$OUTPUT_DIR/${name}.${FORMAT}"
  echo "Processed: $filename"
done

echo "Done! Output in: $OUTPUT_DIR"
```

## Requirements

- ImageMagick 7+ (`magick` command)
- Install: `brew install imagemagick`

## Output

- Creates "processed" subdirectory
- Original files are preserved
- Summary with compression statistics
