# Media Tools Plugin

Image and video manipulation tools using ImageMagick and FFmpeg.

## Features

- Resize and crop images with aspect ratio control
- Compress images to modern formats (WebP, AVIF)
- Batch process multiple images
- Compress and convert videos
- Create optimized GIFs from videos

## Commands

| Command | Description |
|---------|-------------|
| `/image-resize` | Resize, crop, and convert images |
| `/image-compress` | Compress images without resizing |
| `/image-batch` | Batch process multiple images |
| `/video-compress` | Compress and convert videos |
| `/video-to-gif` | Convert video clips to GIFs |

## Quick Start

```bash
# Add marketplace
/plugin marketplace add leobrival/serum-plugins-official

# Install media-tools
/plugin install media-tools@serum-plugins-official
```

## Usage Examples

### Resize image to 1920x1080 WebP

```bash
/image-resize photo.jpg --Resolution 1920 --Ratio 16:9 --Format webp --Quality 85
```

### Compress image to WebP

```bash
/image-compress photo.jpg --Format webp --Quality 75
```

### Batch process folder

```bash
/image-batch ./photos --Resolution 1280 --Ratio 1:1 --Format webp
```

### Compress video to 1080p

```bash
/video-compress video.mov --Resolution 1080p --Format mp4 --Quality medium
```

### Create GIF from video

```bash
/video-to-gif video.mp4 --Width 480 --FPS 15 --Duration 5
```

## Argument Options

### Image Commands

| Argument | Options | Default |
|----------|---------|---------|
| Resolution | 3840, 2560, 1920, 1280, 800, 640 | 1920 |
| Ratio | 16:9, 9:16, 3:2, 1:1, 4:5, 4:3, 21:9 | 16:9 |
| Format | webp, jpg, png, avif | webp |
| Quality | 95, 85, 75, 65, 55 | 85 |

### Video Commands

| Argument | Options | Default |
|----------|---------|---------|
| Resolution | 4K, 1440p, 1080p, 720p, 480p | 1080p |
| Format | mp4, webm, mov, gif | mp4 |
| Quality | high, medium, low, web | medium |
| FPS | original, 60, 30, 24, 15 | original |

## Requirements

- **ImageMagick 7+**: `brew install imagemagick`
- **FFmpeg**: `brew install ffmpeg`

## Format Recommendations

### Images

| Use Case | Format | Quality |
|----------|--------|---------|
| Web general | WebP | 85 |
| Maximum compression | AVIF | 75 |
| Universal compatibility | JPEG | 85 |
| Transparency needed | PNG | - |

### Videos

| Use Case | Format | Quality |
|----------|--------|---------|
| Web streaming | MP4 (H.264) | medium |
| Modern browsers | WebM (VP9) | medium |
| Social media | MP4 | web |
| Archival | MP4 | high |

## License

MIT
