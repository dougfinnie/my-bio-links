# Project Structure

This document explains the structure of the My Bio Links project.

```
my-bio-links/
├── example/                     # Example configuration
│   └── config/                  # Example config folder
│       ├── config.json         # Example configuration
│       └── assets/             # Example assets
│           ├── images/         # Example profile images
│           ├── icons/          # Example custom icons
│           └── link-images/    # Example link images
│
├── dist/                        # Generated output (git-ignored)
│   ├── assets/                  # Copied assets
│   │   └── images/
│   ├── index.html               # Generated static page
│   └── qrcode.png              # Generated QR code
│
│
├── node_modules/                # npm dependencies (git-ignored)
│
├── build.js                     # Build script
├── template.html                # HTML template
├── package.json                 # npm configuration
├── netlify.toml                # Netlify deployment config
├── .gitignore                   # Git ignore rules
│
├── README.md                    # Main documentation
├── QUICKSTART.md                # Quick start guide
└── PROJECT_STRUCTURE.md         # This file

```

## Key Files

### Configuration Files

- **`example/config/config.json`**: Example site configuration
  - Profile information (name, bio, avatar)
  - Theme settings (colors, fonts)
  - Links array
  - Site URL
  - Copy this to create your own config

- **`netlify.toml`**: Netlify deployment settings
  - Build command
  - Publish directory
  - Redirects

### Source Files

- **`template.html`**: HTML template with placeholders
  - Uses `{{PLACEHOLDER}}` syntax
  - Contains all CSS inline
  - Includes JavaScript for share functionality

- **`build.js`**: Build script that:
  - Accepts config folder path as argument
  - Reads config.json from specified folder
  - Replaces placeholders in template
  - Copies assets to dist/
  - Generates QR code
  - Outputs to dist/

### Asset Files

- **`example/config/assets/images/`**: Example profile images
  - Copy these to your own config folder
  - Recommended: Square images, 150x150px or larger
  - Formats: JPG, PNG, SVG, WebP

- **`example/config/assets/icons/`**: Example custom icons
  - Currently uses Font Awesome CDN for icons
  - Can be extended for custom icon images

### Generated Files

- **`dist/`**: Build output directory
  - `index.html`: Generated HTML page
  - `qrcode.png`: Generated QR code
  - `assets/`: Copied asset files

## Build Process

```
config-folder/
├── config.json
└── assets/
              ↓
           build.js
              ↓
        dist/ directory
              ↓
    Deployed to Netlify
```

## Workflow

1. **Setup**:
   - Copy `example/config` to create your own config folder
   - Edit your config's `config.json`
   - Add images to your config's `assets/images/`

2. **Development**:
   - Run `node build.js your-config-folder`
   - Preview `dist/index.html`

3. **Deployment**:
   - Push to Git
   - Netlify runs `npm run build` (uses example by default)
   - Publishes `dist/` directory

## Adding New Files

### Profile Images

```bash
# Copy example config to create your own
cp -r example/config my-config

# Add your image
cp ~/my-photo.jpg my-config/assets/images/

# Update your config.json
"avatar": "assets/images/my-photo.jpg"

# Rebuild with your config
node build.js my-config
```

### Background Images (Future Enhancement)

Create `your-config/assets/backgrounds/` and update the template to use them.

### Custom Fonts (Future Enhancement)

Create `your-config/assets/fonts/` and update the template's CSS to reference them.

## Notes

- All paths in `config.json` are relative to the config folder
- Build output in `dist/` is git-ignored
- Assets are copied during build, not symlinked
- QR code is regenerated on every build
- Use `node build.js your-config-folder` to build with custom configs
