const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Get config name from command line argument
const configName = process.argv[2];
if (!configName) {
  console.error('Error: Config name required.');
  console.error('Usage: node build.js <config-name>');
  console.error('Available configs: example, its-doug, janeburns');
  process.exit(1);
}

// Build config path: config/{configName}
const configPath = path.resolve('config', configName);

// Validate config folder exists
if (!fs.existsSync(configPath)) {
  console.error(`Error: Config '${configName}' not found in config/ directory.`);
  console.error('Usage: node build.js <config-name>');
  process.exit(1);
}

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Read configuration from config folder
const configFilePath = path.join(configPath, 'config.json');
if (!fs.existsSync(configFilePath)) {
  console.error(`Error: config.json not found in 'config/${configName}' folder.`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

console.log(`Building with config folder: ${configPath}`);

// Read template
let template = fs.readFileSync('template.html', 'utf8');

// Generate links HTML (with image support and fallback to icons)
const linksHtml = config.links
  .map(link => {
    const hasImage = link.image && link.image.trim() !== '';
    const iconOrImage = hasImage
      ? `<img src="${link.image}" alt="${link.title}" class="link-image">`
      : `<i class="link-icon ${link.icon}"></i>`;

    const isMastodon =
      (typeof link.title === 'string' && link.title.toLowerCase().includes('mastodon')) ||
      (typeof link.icon === 'string' && link.icon.toLowerCase().includes('mastodon')) ||
      (typeof link.url === 'string' && /^https?:\/\/[^\s]+\/@/.test(link.url));

    const relAttr = isMastodon ? 'me noopener noreferrer' : 'noopener noreferrer';

    return `
            <a href="${link.url}" class="link-item" target="_blank" rel="${relAttr}">
                ${iconOrImage}
                <span class="link-title">${link.title}</span>
            </a>`;
  })
  .join('\n');

// Generate background style based on type
let backgroundStyle;
if (config.profile.background.type === 'image') {
  backgroundStyle = `background-image: url('${config.profile.background.value}');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;`;
} else if (config.profile.background.type === 'gradient') {
  backgroundStyle = `background: ${config.profile.background.value};`;
} else {
  backgroundStyle = `background-color: ${config.profile.background.value};`;
}

// Replace placeholders in template
template = template.replace(/{{NAME}}/g, config.profile.name);
template = template.replace(/{{BIO}}/g, config.profile.bio);
template = template.replace(/{{AVATAR_URL}}/g, config.profile.avatar);
template = template.replace(/{{SITE_URL}}/g, config.siteUrl);
template = template.replace(/{{BACKGROUND_STYLE}}/g, backgroundStyle);
template = template.replace(
  /{{BG_COLOR}}/g,
  config.profile.theme.backgroundColor
);
template = template.replace(
  /{{BUTTON_COLOR}}/g,
  config.profile.theme.buttonColor
);
template = template.replace(
  /{{BUTTON_HOVER_COLOR}}/g,
  config.profile.theme.buttonHoverColor
);
template = template.replace(
  /{{BUTTON_BORDER}}/g,
  config.profile.theme.buttonBorder
);
template = template.replace(/{{TEXT_COLOR}}/g, config.profile.theme.textColor);
template = template.replace(
  /{{FONT_FAMILY}}/g,
  config.profile.theme.fontFamily
);
template = template.replace(/{{LINKS}}/g, linksHtml);

// Clear and recreate dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist');

// Copy assets directory to dist
const assetsPath = path.join(configPath, 'assets');
if (fs.existsSync(assetsPath)) {
  copyDir(assetsPath, 'dist/assets');
  console.log('✓ Assets copied');
}

// Write the generated HTML
fs.writeFileSync('dist/index.html', template);

// Generate QR code
QRCode.toFile(
  'dist/qrcode.png',
  config.siteUrl,
  {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  },
  err => {
    if (err) {
      console.error('Error generating QR code:', err);
    } else {
      console.log('✓ Build complete!');
      console.log('✓ QR code generated');
      console.log('✓ Output directory: dist/');
    }
  }
);
