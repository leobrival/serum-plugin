# Serum Plugins Official

Official Serum plugins for Claude Code - modular tools for crawling, security, and media processing.

## Installation

### Add the marketplace

```bash
/plugin marketplace add leobrival/serum-plugins-official
```

### Install plugins

```bash
# Install the crawler plugin
/plugin install crawler@serum-plugins-official

# Install hookify (24 security rules, Bun runtime)
/plugin install hookify@serum-plugins-official

# Install media-tools (image/video processing)
/plugin install media-tools@serum-plugins-official
```

### Verify installation

```bash
/plugin list
```

## Available Plugins

### crawler

High-performance web crawler for discovering and mapping website structure.

**Features:**

- Sitemap discovery and parsing
- Checkpoint/resume support
- Rate limiting
- HTML report generation

**Usage:**

```bash
/crawler https://example.com
```

### hookify

Enhanced hookify with **24 pre-configured security rules** - uses Bun runtime, no Python required.

**Features:**

- 20 Bash security rules (block/warn dangerous commands)
- 4 File editing rules (secrets detection, debug code, TODOs)
- Simple markdown format for custom rules
- Commands: `/hookify`, `/hookify:list`, `/hookify:configure`
- **Bun runtime** - Fast TypeScript execution, no dependencies

**Quick example:**

```bash
/hookify Block npm publish commands
```

### media-tools

Image and video manipulation tools using **ImageMagick** and **FFmpeg**.

**Features:**

- Resize and crop images with aspect ratio control
- Compress images to modern formats (WebP, AVIF)
- Batch process multiple images
- Compress and convert videos
- Create optimized GIFs from videos

**Commands:**

- `/image-resize` - Resize, crop, and convert images
- `/image-compress` - Compress images without resizing
- `/image-batch` - Batch process multiple images
- `/video-compress` - Compress and convert videos
- `/video-to-gif` - Convert video clips to GIFs

**Quick example:**

```bash
/image-resize photo.jpg --Resolution 1920 --Ratio 16:9 --Format webp --Quality 85
```

## File Structure

```
serum-plugins-official/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── crawler/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── crawler.md
│   │   ├── scripts/
│   │   └── README.md
│   ├── hookify/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── core/              # TypeScript rule engine
│   │   ├── hooks/             # Bun hooks
│   │   ├── commands/
│   │   ├── rules/             # 24 pre-configured security rules
│   │   └── README.md
│   └── media-tools/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   ├── image-resize.md
│       │   ├── image-compress.md
│       │   ├── image-batch.md
│       │   ├── video-compress.md
│       │   └── video-to-gif.md
│       └── README.md
└── README.md
```

## Development

### Adding New Plugins

Create a new directory under `plugins/` with the following structure:

```
plugins/my-new-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── agents/
├── hooks/
└── README.md
```

Then add the plugin entry to `.claude-plugin/marketplace.json`.

## License

MIT
