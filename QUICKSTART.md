# Quick Start Guide

Get your link-in-bio page up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Your Configuration

Copy the example configuration to create your own:

```bash
# Copy the example config to create your own
cp -r example/config my-config
```

## 3. Add Your Profile Image

Add your photo to your config's `assets/images/` directory:

```bash
# Example: Copy your photo
cp ~/my-photo.jpg my-config/assets/images/
```

## 4. Customize Your Profile

Edit `my-config/config.json`:

```json
{
  "profile": {
    "name": "Your Name",                    // Your name/brand
    "bio": "Your bio text here...",         // Your bio
    "avatar": "assets/images/my-photo.jpg",  // Your LOCAL profile picture
  },
  "siteUrl": "https://your-site.example.com
    {
      "title": "Instagram",                  // Button text
      "url": "https://instagram.com/...",    // Where it links to
      "icon": "fab fa-instagram"             // Font Awesome icon
    }
    // Add more links...
  ]
}
```

## 5. Build & Preview

Build the site with your config:

```bash
# Build with your custom config
node build.js my-config

# Or build with the example (for testing)
npm run build
```

Preview locally (optional):

```bash
npm run serve
```

Open http://localhost:3000 in your browser to see your site. Press `Ctrl+C` to stop the server.

## 6. Deploy to Netlify

### Quick Deploy (Drag & Drop)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `dist/` folder to the upload area
3. Done! Copy your new URL

### Continuous Deployment (Recommended)

1. Push to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repo
   - Click "Deploy site"

## 7. Update Site URL

After deployment:

1. Copy your Netlify URL (e.g., `https://mystuff.netlify.example`)
2. Update your config's `config.json`:
   ```json
   {
     "siteUrl": "https://mystuff.netlify.example"
   }
   ```
3. Rebuild and redeploy:
   ```bash
   node build.js my-config
   git add .
   git commit -m "Update site URL"
   git push
   ```
   (Or drag & drop `dist/` again if using manual deploy)

## 8. Customize (Optional)

### Change Colors

Edit the theme in your config's `config.json`:

```json
"theme": {
  "backgroundColor": "#ffffff",
  "buttonColor": "rgba(100, 200, 255, 0.2)",
  "buttonHoverColor": "rgba(100, 200, 255, 0.3)",
  "textColor": "#000000"
}
```

### Add More Links

Just add to the `links` array in your config's `config.json`:

```json
{
  "title": "TikTok",
  "url": "https://tiktok.com/@yourusername",
  "icon": "fab fa-tiktok"
}
```

### Change Icons

Browse icons at [Font Awesome](https://fontawesome.com/icons) and use the class name:

- `fab fa-instagram` - Instagram
- `fab fa-tiktok` - TikTok
- `fas fa-shopping-bag` - Shop
- `fas fa-globe` - Website

## Troubleshooting

**Build fails?**

- Make sure you ran `npm install` first
- Check that your config's `config.json` is valid JSON
- Make sure you're pointing to the correct config folder

**QR code not working?**

- Make sure you updated `siteUrl` in your config's `config.json` with your actual Netlify URL
- Rebuild after changing the URL

**Icons not showing?**

- Check the icon class name is correct (from Font Awesome)
- Make sure it's a Font Awesome 6 icon

## Need Help?

Check the full [README.md](README.md) for more details!
