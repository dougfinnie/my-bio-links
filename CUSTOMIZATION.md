# Customization Guide

This guide covers all the ways you can customize your My Bio Links page.

## Table of Contents

1. [Background Customization](#background-customization)
2. [Link Images](#link-images)
3. [Theme Colors](#theme-colors)
4. [Examples](#examples)

---

## Background Customization

You can customize the page background in three ways: solid color, gradient, or image.

### Background Types

#### 1. Solid Color (Default)

```json
{
  "profile": {
    "background": {
      "type": "color",
      "value": "#ffffff"
    }
  }
}
```

**Examples:**

- White: `"value": "#ffffff"`
- Black: `"value": "#000000"`
- Custom color: `"value": "#f0f0f0"`

#### 2. Gradient

```json
{
  "profile": {
    "background": {
      "type": "gradient",
      "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }
}
```

**Popular Gradients:**

Purple Dream:

```json
"value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

Sunset:

```json
"value": "linear-gradient(to right, #ff6b6b, #feca57)"
```

Ocean:

```json
"value": "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)"
```

Pink Flamingo:

```json
"value": "linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)"
```

Find more gradients at [uigradients.com](https://uigradients.com)

#### 3. Background Image

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

**Steps:**

1. Add your background image to `assets/backgrounds/`
2. Update config with the path
3. Rebuild the site

**Image Tips:**

- Use high-resolution images (1920x1080 or larger)
- Optimize file size (use JPG, keep under 500KB)
- Consider readability - adjust text colors if needed
- Fixed attachment creates a parallax effect

---

## Link Images

Each link can have a custom thumbnail image OR use a Font Awesome icon.

### How It Works

**With Image** (image takes priority):

```json
{
  "title": "My Shop",
  "url": "https://shop.example.com",
  "icon": "fas fa-store",
  "image": "assets/link-images/shop-thumbnail.jpg"
}
```

**Without Image** (falls back to icon):

```json
{
  "title": "Instagram",
  "url": "https://instagram.com/username",
  "icon": "fab fa-instagram",
  "image": ""
}
```

### Adding Link Images

1. **Add your image** to `assets/link-images/`

   ```bash
   cp ~/my-link-image.jpg assets/link-images/
   ```

2. **Update config.json**:

   ```json
   {
     "title": "My Link",
     "url": "https://example.com",
     "icon": "fas fa-link",
     "image": "assets/link-images/my-link-image.jpg"
   }
   ```

3. **Rebuild**:
   ```bash
   npm run build
   ```

### Image Requirements

- **Size**: 48x48px to 200x200px (square recommended)
- **Format**: JPG, PNG, or WebP
- **File Size**: Keep under 100KB each
- **Naming**: Use descriptive names (e.g., `etsy-shop.jpg`, `newsletter-icon.png`)

### Fallback Behavior

- If `image` field is empty (`""`), the Font Awesome `icon` will be displayed
- Always include an `icon` as a fallback
- This allows you to mix images and icons in the same link list

---

## Theme Colors

Customize the look and feel with theme colors:

```json
{
  "profile": {
    "theme": {
      "backgroundColor": "#ffffff",
      "buttonColor": "rgba(255, 255, 255, 0.1)",
      "buttonHoverColor": "rgba(255, 255, 255, 0.2)",
      "buttonBorder": "1px solid rgba(255, 255, 255, 0.4)",
      "textColor": "#0A0B0D",
      "fontFamily": "'Poppins', sans-serif"
    }
  }
}
```

### Color Properties

| Property           | Description            | Example                      |
| ------------------ | ---------------------- | ---------------------------- |
| `backgroundColor`  | Desktop frame color    | `"#ffffff"`                  |
| `buttonColor`      | Link button background | `"rgba(255, 255, 255, 0.1)"` |
| `buttonHoverColor` | Button hover state     | `"rgba(255, 255, 255, 0.2)"` |
| `buttonBorder`     | Button border style    | `"1px solid #ccc"`           |
| `textColor`        | All text color         | `"#0A0B0D"`                  |
| `fontFamily`       | Font for the page      | `"'Inter', sans-serif"`      |

### Using RGBA for Transparency

RGBA colors allow transparency - great for glass morphism effects:

```json
"buttonColor": "rgba(255, 255, 255, 0.1)"
```

- First three numbers: RGB values (0-255)
- Last number: Alpha/transparency (0-1)
  - `0` = fully transparent
  - `1` = fully opaque
  - `0.1` = 10% opaque

---

## Examples

### Example 1: Dark Mode with Gradient

```json
{
  "profile": {
    "name": "Dark Mode User",
    "bio": "Minimalist • Designer • Developer",
    "avatar": "assets/images/avatar.jpg",
    "background": {
      "type": "gradient",
      "value": "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)"
    },
    "theme": {
      "backgroundColor": "#1a1a2e",
      "buttonColor": "rgba(255, 255, 255, 0.05)",
      "buttonHoverColor": "rgba(255, 255, 255, 0.15)",
      "buttonBorder": "1px solid rgba(255, 255, 255, 0.1)",
      "textColor": "#ffffff",
      "fontFamily": "'Inter', sans-serif"
    }
  }
}
```

### Example 2: Colorful with Background Image

```json
{
  "profile": {
    "name": "Creative Studio",
    "bio": "We create amazing things ✨",
    "avatar": "assets/images/logo.png",
    "background": {
      "type": "image",
      "value": "assets/backgrounds/colorful-pattern.jpg"
    },
    "theme": {
      "backgroundColor": "#ffffff",
      "buttonColor": "rgba(255, 255, 255, 0.9)",
      "buttonHoverColor": "rgba(255, 255, 255, 1)",
      "buttonBorder": "2px solid #ff6b6b",
      "textColor": "#2d3436",
      "fontFamily": "'Poppins', sans-serif"
    }
  },
  "links": [
    {
      "title": "Portfolio",
      "url": "https://portfolio.example.com",
      "icon": "fas fa-briefcase",
      "image": "assets/link-images/portfolio-preview.jpg"
    },
    {
      "title": "Contact",
      "url": "mailto:hello@example.com",
      "icon": "fas fa-envelope",
      "image": ""
    }
  ]
}
```

### Example 3: Minimalist Clean

```json
{
  "profile": {
    "background": {
      "type": "color",
      "value": "#f5f5f5"
    },
    "theme": {
      "backgroundColor": "#ffffff",
      "buttonColor": "#ffffff",
      "buttonHoverColor": "#f8f9fa",
      "buttonBorder": "1px solid #e9ecef",
      "textColor": "#212529",
      "fontFamily": "'Inter', sans-serif"
    }
  }
}
```

---

## Tips & Best Practices

### Background Images

- **Readability**: Ensure text is readable against your background
- **Contrast**: Use dark text on light backgrounds, light text on dark backgrounds
- **Mobile**: Test on mobile - backgrounds look different on small screens
- **Performance**: Compress images to keep page load fast

### Link Images

- **Consistency**: Use same aspect ratio for all link images (square recommended)
- **Branding**: Use brand colors or logos for recognizable links
- **Mix & Match**: It's OK to use images for some links and icons for others
- **Fallbacks**: Always provide an icon in case image doesn't load

### Colors

- **Accessibility**: Ensure sufficient contrast (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
- **Consistency**: Stick to a color palette (2-3 main colors)
- **Testing**: Preview on multiple devices before deploying

### Fonts

Available Google Fonts:

- Poppins (default)
- Inter
- Roboto
- Open Sans
- Montserrat

To change fonts, update:

```json
"fontFamily": "'Inter', sans-serif"
```

---

## Troubleshooting

**Background image not showing?**

- Check the path is correct and starts with `assets/`
- Make sure image exists in `assets/backgrounds/`
- Rebuild after adding the image

**Link images not appearing?**

- Verify path starts with `assets/link-images/`
- Check image file exists
- Ensure image field is not empty (`""` means no image, use the path)

**Colors look wrong?**

- Check color format (hex: `#ffffff`, rgba: `rgba(255,255,255,0.5)`)
- Ensure quotes around color values
- Rebuild after changing colors

**Text hard to read?**

- Adjust `textColor` for better contrast
- Consider semi-transparent button backgrounds
- Test with different background types
