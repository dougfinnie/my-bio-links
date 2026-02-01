# My Bio Links

A static, configurable link-in-bio page builder. Built as a static site for easy deployment to Netlify.

## Features

- Fully configurable links with **icons or custom images**
- **Background customization** - solid colors, gradients, or images
- **Link thumbnails** - add custom images to links (with icon fallback)
- **Mastodon verification** - automatic `rel="me"` attribute for Mastodon profile links
- Share button with multiple sharing options
- QR code generation for easy mobile access
- Responsive design with modern aesthetic
- Static HTML output for fast loading
- Built with vanilla HTML/CSS/JS - no frameworks needed
- **All assets are local** - no external dependencies for images

## Getting Started

### Option 1: Fork This Repository (Recommended)

1. **Fork this repository** on GitHub by clicking the "Fork" button
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/my-bio-links.git
   cd my-bio-links
   ```
3. **Follow the setup steps below** to customize it for your needs

### Option 2: Clone and Customize

1. **Clone this repository**:
   ```bash
   git clone https://github.com/dougfinnie/my-bio-links.git
   cd my-bio-links
   ```
2. **Remove the original remote** and add your own:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   ```
3. **Follow the setup steps below** to customize it for your needs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create or choose a config directory:
   - Configs are organized in the `config/` directory
   - Each config has its own subdirectory (e.g., `config/my-profile/`)
   - You can copy the `config/example/` directory as a starting point
   - Or use an existing config like `config/example/`, `config/its-doug/`, etc.

3. Add your profile image:
   - Place your profile photo in your config's `assets/images/` directory (e.g., `config/my-profile/assets/images/my-photo.jpg`)
   - See `config/example/assets/README.md` for image guidelines

4. Edit your config's `config.json` to customize your profile:
   - Update `profile.name` with your name/brand
   - Update `profile.bio` with your bio
   - Update `profile.avatar` with your image path (e.g., `assets/images/my-photo.jpg`)
   - Update `siteUrl` with the URL where your site will be hosted (e.g., your Netlify, Vercel, or GitHub Pages URL - typically set after deployment)
   - Add/edit links in the `links` array

5. Build the site:

```bash
npm run build
```

This builds the `example` config by default. To build a different config:

```bash
node build.js <config-name>
```

For example: `node build.js its-doug` or `node build.js my-profile`

This will generate the static site in the `dist/` folder.

6. Preview locally (optional):

```bash
npm run serve
```

This will start a local HTTP server at http://localhost:3000 to preview your site.

## Configuration

Each config directory in `config/` contains its own `config.json` file and `assets/` folder. The `config.json` file controls all aspects of your page:

```json
{
  "profile": {
    "name": "Your Name",
    "bio": "Your bio text",
    "avatar": "assets/images/my-photo.jpg",
    "theme": {
      "backgroundColor": "#ffffff",
      "buttonColor": "rgba(255, 255, 255, 0.1)",
      "buttonHoverColor": "rgba(255, 255, 255, 0.2)",
      "buttonBorder": "1px solid rgba(255, 255, 255, 0.4)",
      "textColor": "#0A0B0D",
      "fontFamily": "'Poppins', sans-serif"
    }
  },
  "siteUrl": "https://your-site.netlify.app",
  "links": [
    {
      "title": "Link Title",
      "url": "https://example.com",
      "icon": "fab fa-instagram"
    }
  ]
}
```

**Note:** The `siteUrl` field should be set to the URL where your built site will be hosted (e.g., your Netlify, Vercel, or GitHub Pages URL). This URL is used for generating the QR code and is important for proper sharing functionality. You'll typically set this after your initial deployment.

### Mastodon Verification

This project automatically adds `rel="me"` to Mastodon profile links, which enables [identity verification](https://joinmastodon.org/verification). When you link to your Mastodon profile from your site, Mastodon can verify that you own this site by checking for the `rel="me"` attribute.

The build script automatically detects Mastodon links by checking:

- If the link title contains "Mastodon" (case-insensitive)
- If the icon class contains "Mastodon" (case-insensitive)
- If the URL matches the Mastodon profile pattern (contains `/@`)

When a Mastodon link is detected, the link will include `rel="me noopener noreferrer"` instead of just `rel="noopener noreferrer"`.

**Example Mastodon link configuration:**

```json
{
  "title": "Mastodon",
  "url": "https://union.place/@yourusername",
  "icon": "fab fa-mastodon"
}
```

After deploying your site, you can verify your identity on Mastodon:

1. Add your site URL to your Mastodon profile's "Profile metadata" or "Featured links"
2. Add `rel="me"` to the link on your Mastodon profile (or use Mastodon's built-in profile fields)
3. Mastodon will verify the bidirectional link between your profile and your site

### Icon Options

Icons use Font Awesome 6. Some popular options:

- Instagram: `fab fa-instagram`
- Facebook: `fab fa-facebook`
- Mastodon: `fab fa-mastodon`
- TikTok: `fab fa-tiktok`
- YouTube: `fab fa-youtube`
- LinkedIn: `fab fa-linkedin`
- GitHub: `fab fa-github`
- Website: `fas fa-globe`
- Email: `fas fa-envelope`
- Shop: `fas fa-shopping-bag`
- Etsy: `fab fa-etsy`

Browse more icons at: https://fontawesome.com/icons

## Deployment

This static site can be deployed to any hosting service. Here are some popular options:

### Netlify (Recommended)

#### Option 1: Using Netlify CLI

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Initialize and deploy:

```bash
netlify init
netlify deploy --prod
```

#### Option 2: Using Git + Netlify Dashboard

1. Push this project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect the build settings from `package.json`
6. Click "Deploy site"

#### Option 3: Manual Deploy

1. Build the site:

```bash
npm run build
```

2. Drag and drop the `dist/` folder to Netlify's dashboard

### Other Hosting Options

- **Vercel**: Connect your GitHub repo and deploy automatically
- **GitHub Pages**: Enable Pages in your repository settings
- **Cloudflare Pages**: Connect your Git repository
- **Any static hosting**: Upload the `dist/` folder contents

### After Deployment

1. Copy your site URL (e.g., `https://your-site.netlify.app` or `https://yourusername.github.io`)
2. Update your config's `config.json` with your actual site URL:

```json
{
  "siteUrl": "https://your-site.netlify.app"
}
```

3. Rebuild and redeploy:

```bash
npm run build
# Or for a specific config: node build.js <config-name>
# Then redeploy using your chosen method (git push, drag & drop, etc.)
```

This ensures the QR code points to your actual site URL.

## Development

### Available Commands

```bash
# Build the site (uses 'example' config by default)
npm run build

# Build a specific config
node build.js <config-name>

# Serve the built site locally (view at http://localhost:3000)
npm run serve

# Build and serve in one command
npm run dev
```

### Local Preview Workflow

1. Make changes to your config's `config.json` or add images to your config's `assets/` folder
2. Build the site: `npm run build` (or `node build.js <config-name>` for a specific config)
3. Preview locally: `npm run serve`
4. Open http://localhost:3000 in your browser
5. Press `Ctrl+C` to stop the server when done

The `serve` package will be installed automatically via `npx` when you first run the serve command.

## Project Structure

```
jblinks/
├── config/             # Configuration directories
│   ├── example/        # Example config
│   │   ├── config.json # Configuration file
│   │   └── assets/     # Images and icons
│   ├── its-doug/       # Custom config example
│   │   ├── config.json
│   │   └── assets/
│   └── <your-config>/  # Your custom configs
│       ├── config.json
│       └── assets/
├── template.html       # HTML template
├── build.js           # Build script
├── package.json       # Node.js dependencies
├── dist/              # Generated output (git-ignored)
│   ├── index.html
│   └── qrcode.png
└── README.md
```

## Customization

You can customize the design by editing:

- `config/<your-config>/config.json` - Colors, fonts, and theme settings
- `template.html` - HTML structure and inline CSS

You can have multiple configs for different profiles or purposes. Each config directory in `config/` is completely independent.

## Third-Party Licenses

This project uses the following third-party libraries:

- **qrcode** (MIT License) - Copyright (c) 2012 Ryan Day
  - Used for QR code generation
  - License: https://github.com/soldair/node-qrcode/blob/master/license

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

**You are free to:**

- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

**Under the following terms:**

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- NonCommercial — You may not use the material for commercial purposes

For more information, visit: https://creativecommons.org/licenses/by-nc/4.0/

> This software is anti-racist, anti-transphobic, and anti-fascist
