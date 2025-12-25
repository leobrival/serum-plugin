---
description: Compress images without resizing using ImageMagick
allowed-tools: [Bash, Read, Glob]
argument-hint: <file_path> [options]
arguments:
  - name: Format
    default: "webp"
    options: ["webp", "jpg", "png", "avif"]
  - name: Quality
    default: "85"
    options: ["95", "85", "75", "65", "55", "45"]
---

# Image Compress Command

Compress images to reduce file size while maintaining dimensions.

## Arguments

$ARGUMENTS

## Task

1. **Parse input**:
   - Extract file path from arguments
   - Parse Format and Quality values

2. **Get original file info**:
   ```bash
   magick identify -format "%w x %h - %b" "<input>"
   ```

3. **Build compression command**:
   ```bash
   magick "<input>" -quality <quality> -strip "<output>.<format>"
   ```

4. **Execute and report**:
   - Run the command
   - Calculate and display compression ratio
   - Show before/after sizes

## Quality Guidelines

| Quality | Use Case | Typical Compression |
|---------|----------|---------------------|
| 95 | Archival, print-ready | 10-20% reduction |
| 85 | Web images, general use | 40-60% reduction |
| 75 | Thumbnails, previews | 60-75% reduction |
| 65 | Low bandwidth | 75-85% reduction |
| 55 | Minimum viable | 85-90% reduction |
| 45 | Extreme compression | 90%+ reduction |

## Format Comparison

| Format | Best For | Browser Support |
|--------|----------|-----------------|
| WebP | Web, best balance | Modern browsers |
| AVIF | Maximum compression | Chrome, Firefox |
| JPEG | Universal compatibility | All browsers |
| PNG | Transparency, lossless | All browsers |

## Examples

**Compress to WebP at 85%:**
```bash
magick "photo.jpg" -quality 85 -strip "photo.webp"
```

**Maximum compression with AVIF:**
```bash
magick "photo.jpg" -quality 55 -strip "photo.avif"
```

**Batch compress all JPGs:**
```bash
for f in *.jpg; do magick "$f" -quality 85 -strip "${f%.jpg}.webp"; done
```

## Requirements

- ImageMagick 7+ (`magick` command)
- For AVIF: ImageMagick compiled with libheif
- Install: `brew install imagemagick`

## Output

- Creates new file with format extension
- Original file is preserved
- Displays compression statistics
