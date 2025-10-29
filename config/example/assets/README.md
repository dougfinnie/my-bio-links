# Assets Directory

This directory contains all local assets used by your site.

## Directory Structure

```
assets/
├── images/          # Profile avatar images
│   └── placeholder-avatar.svg
├── backgrounds/     # Background images for the page
├── link-images/     # Thumbnail images for links
└── icons/           # Custom icons (if needed)
```

## How to Add Your Profile Image

1. **Add your image** to `assets/images/` directory
   - Supported formats: JPG, PNG, SVG, WebP
   - Recommended size: 150x150px or larger (square)
   - Example: `assets/images/my-photo.jpg`

2. **Update config.json** to reference your image:

   ```json
   {
     "profile": {
       "avatar": "assets/images/my-photo.jpg"
     }
   }
   ```

3. **Rebuild** the site:
   ```bash
   npm run build
   ```

## Image Best Practices

- **Profile Avatar**: Use a square image, at least 150x150px
- **File Size**: Keep images under 500KB for fast loading
- **Format**:
  - Use JPG for photos
  - Use PNG for images with transparency
  - Use SVG for logos or simple graphics

## Background Images

Background images appear behind the entire page.

1. **Add your background** to `assets/backgrounds/`
   - Use high-resolution images (1920x1080 or larger)
   - Keep file size under 500KB
   - JPG format recommended for photos

2. **Update config.json**:

   ```json
   {
     "profile": {
       "background": {
         "type": "image",
         "value": "assets/backgrounds/my-background.jpg"
       }
     }
   }
   ```

3. **Rebuild**:
   ```bash
   npm run build
   ```

## Link Images

Link images appear as thumbnails next to link titles (instead of icons).

1. **Add your link images** to `assets/link-images/`
   - Recommended size: 48x48px to 200x200px (square)
   - Keep under 100KB each
   - JPG or PNG format

2. **Update config.json**:

   ```json
   {
     "links": [
       {
         "title": "My Link",
         "url": "https://example.com",
         "icon": "fas fa-link",
         "image": "assets/link-images/my-link.jpg"
       }
     ]
   }
   ```

3. **Fallback**: If `image` is empty (`""`), the Font Awesome `icon` will be used instead

## Custom Icons

Custom icons can be added to `assets/icons/` for future use.

## Examples

### Good Image Names

- `avatar.jpg`
- `profile-photo.png`
- `logo.svg`
- `headshot-2024.jpg`

### Bad Image Names

- `IMG_1234.jpg` (not descriptive)
- `my photo.jpg` (has spaces)
- `photo#1.png` (has special characters)

## Notes

- All files in this directory will be copied to `dist/assets/` during build
- Paths in config.json should be relative to the root (e.g., `assets/images/photo.jpg`)
- The placeholder avatar is provided as an example and can be replaced
