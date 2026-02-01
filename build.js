const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const https = require('https');
const http = require('http');

// Get config name from command line argument
const configName = process.argv[2];
if (!configName) {
  console.error('Error: Config name required.');
  console.error('Usage: node build.js <config-name>');
  console.error('Available configs: example, its-doug, janeburns');
  process.exit(1);
}

// Validate config name doesn't contain path traversal sequences or absolute paths
if (
  configName.includes('..') ||
  path.isAbsolute(configName) ||
  path.normalize(configName) !== configName
) {
  console.error(`Error: Invalid config name '${configName}'.`);
  process.exit(1);
}

// Build config path: config/{configName}
const baseConfigDir = path.resolve('config');
const configPath = path.resolve(baseConfigDir, configName);

// Ensure resolved path is within the config directory (prevent path traversal)
const normalizedConfigPath = path.normalize(configPath);
const normalizedBaseDir = path.normalize(baseConfigDir);
if (
  !normalizedConfigPath.startsWith(normalizedBaseDir + path.sep) &&
  normalizedConfigPath !== normalizedBaseDir
) {
  console.error(`Error: Invalid config path.`);
  process.exit(1);
}

// Validate config folder exists
if (!fs.existsSync(configPath)) {
  console.error(
    `Error: Config '${configName}' not found in config/ directory.`
  );
  console.error('Usage: node build.js <config-name>');
  process.exit(1);
}

// Helper function to validate that a path stays within a base directory
function isPathWithinBase(targetPath, baseDir) {
  const normalizedTarget = path.normalize(path.resolve(targetPath));
  const normalizedBase = path.normalize(path.resolve(baseDir));
  return (
    normalizedTarget.startsWith(normalizedBase + path.sep) ||
    normalizedTarget === normalizedBase
  );
}

// Helper function to validate file/directory name doesn't contain path traversal
function isValidFileName(name) {
  if (
    !name ||
    name.includes('..') ||
    path.isAbsolute(name) ||
    path.normalize(name) !== name
  ) {
    return false;
  }
  // Reject names with path separators
  if (name.includes(path.sep) || (path.sep !== '/' && name.includes('/'))) {
    return false;
  }
  return true;
}

// Helper function to copy directory recursively
function copyDir(src, dest, allowedBaseDir) {
  // Validate src is within allowed base directory
  if (!isPathWithinBase(src, allowedBaseDir)) {
    throw new Error(
      `Path traversal detected: ${src} is outside allowed directory ${allowedBaseDir}`
    );
  }
  // Path is validated and safe to use
  const validatedSrc = path.normalize(path.resolve(src));
  const validatedBase = path.normalize(path.resolve(allowedBaseDir));
  // Final check: ensure validated path stays within base
  if (
    !validatedSrc.startsWith(validatedBase + path.sep) &&
    validatedSrc !== validatedBase
  ) {
    throw new Error(
      `Path traversal detected: ${validatedSrc} is outside allowed directory ${validatedBase}`
    );
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(validatedSrc, { withFileTypes: true });

  for (const entry of entries) {
    // Validate entry name to prevent path traversal
    if (!isValidFileName(entry.name)) {
      console.warn(`Skipping invalid entry name: ${entry.name}`);
      continue;
    }

    const srcPath = path.join(validatedSrc, entry.name);
    const destPath = path.join(dest, entry.name);

    // Validate resolved paths stay within allowed directories
    if (!isPathWithinBase(srcPath, allowedBaseDir)) {
      throw new Error(
        `Path traversal detected: ${srcPath} is outside allowed directory ${allowedBaseDir}`
      );
    }
    // Path is validated and safe to use
    const validatedSrcPath = path.normalize(path.resolve(srcPath));
    const validatedAllowedBase = path.normalize(path.resolve(allowedBaseDir));
    // Final check: ensure validated path stays within base
    if (
      !validatedSrcPath.startsWith(validatedAllowedBase + path.sep) &&
      validatedSrcPath !== validatedAllowedBase
    ) {
      throw new Error(
        `Path traversal detected: ${validatedSrcPath} is outside allowed directory ${validatedAllowedBase}`
      );
    }

    if (entry.isDirectory()) {
      copyDir(validatedSrcPath, destPath, allowedBaseDir);
    } else {
      fs.copyFileSync(validatedSrcPath, destPath);
    }
  }
}

// Helper function to download a file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    // Bunny Fonts uses HTTPS, but handle both for robustness
    const protocol = url.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(destPath);

    const request = protocol.get(url, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
        }
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
        }
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });

    request.on('error', err => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });
  });
}

// Helper function to extract font URLs from CSS
function extractFontUrls(css) {
  const urls = [];
  const urlRegex = /url\(['"]?([^'")]+)['"]?\)/g;
  let match;

  while ((match = urlRegex.exec(css)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Helper function to parse font family and weights from config
function parseFontConfig(fontFamily) {
  // Extract font name (remove quotes and 'sans-serif' etc)
  const fontName = fontFamily.replace(/['"]/g, '').split(',')[0].trim();

  // Default weights if not specified - Poppins typically uses 300,400,500,600,700
  const defaultWeights = [300, 400, 500, 600, 700];

  return {
    name: fontName,
    weights: defaultWeights,
  };
}

// Function to download fonts from Bunny Fonts
async function downloadFonts(fontFamily) {
  const fontConfig = parseFontConfig(fontFamily);
  const fontName = fontConfig.name;
  const weights = fontConfig.weights;

  // Create fonts directory
  const fontsDir = path.join('dist', 'assets', 'fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }

  // Build Bunny Fonts URL - try multiple formats to get all weights
  // Format: family=FontName:300,400,500,600,700 (comma-separated weights)
  const weightsParam = weights.join(',');
  const bunnyFontsUrl = `https://fonts.bunny.net/css?family=${encodeURIComponent(fontName)}:${weightsParam}&display=swap`;

  console.log(`Downloading fonts from Bunny Fonts: ${fontName}...`);

  try {
    // Download the CSS file
    const cssResponse = await new Promise((resolve, reject) => {
      https
        .get(bunnyFontsUrl, response => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to fetch CSS: ${response.statusCode}`));
            return;
          }
          let data = '';
          response.on('data', chunk => (data += chunk));
          response.on('end', () => resolve(data));
        })
        .on('error', reject);
    });

    // Extract font URLs from CSS
    const fontUrls = extractFontUrls(cssResponse);

    if (fontUrls.length === 0) {
      throw new Error('No font URLs found in CSS');
    }

    // Download each font file
    const fontFiles = [];
    for (let i = 0; i < fontUrls.length; i++) {
      const fontUrl = fontUrls[i];
      const urlObj = new URL(fontUrl, bunnyFontsUrl);
      const fileName = path.basename(urlObj.pathname);
      const destPath = path.join(fontsDir, fileName);

      await downloadFile(fontUrl, destPath);
      fontFiles.push({ url: fontUrl, localPath: `assets/fonts/${fileName}` });
    }

    // Generate local CSS with @font-face declarations
    const localCss = generateLocalFontCSS(cssResponse, fontFiles);
    const cssPath = path.join('dist', 'assets', 'fonts.css');
    fs.writeFileSync(cssPath, localCss);

    console.log(`✓ Downloaded ${fontFiles.length} font files`);
    return cssPath;
  } catch (error) {
    console.error('Error downloading fonts:', error.message);
    throw error;
  }
}

// Function to generate local CSS with @font-face declarations
function generateLocalFontCSS(originalCss, fontFiles) {
  // Create a map of remote URLs to local paths
  const urlMap = new Map();
  fontFiles.forEach(({ url, localPath }) => {
    urlMap.set(url, localPath);
  });

  // Replace all font URLs with local paths
  let localCss = originalCss;
  fontFiles.forEach(({ url, localPath }) => {
    // Replace both quoted and unquoted URLs
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`url\\(['"]?${escapedUrl}['"]?\\)`, 'g');
    localCss = localCss.replace(regex, `url('${localPath}')`);
  });

  return localCss;
}

// Read configuration from config folder
// Construct path safely: configPath is already validated to be within baseConfigDir
const configFilePath = path.join(configPath, 'config.json');
// Resolve and normalize the path to prevent path traversal
const resolvedConfigFilePath = path.normalize(path.resolve(configFilePath));
const normalizedConfigBase = path.normalize(path.resolve(configPath));
// Final validation: ensure resolved path stays within configPath (prevent path traversal)
if (
  !resolvedConfigFilePath.startsWith(normalizedConfigBase + path.sep) &&
  resolvedConfigFilePath !== normalizedConfigBase
) {
  console.error(`Error: Invalid config file path.`);
  process.exit(1);
}
if (!fs.existsSync(resolvedConfigFilePath)) {
  console.error(
    `Error: config.json not found in 'config/${configName}' folder.`
  );
  process.exit(1);
}
// Path is validated and safe to use
const config = JSON.parse(fs.readFileSync(resolvedConfigFilePath, 'utf8'));

console.log(`Building with config folder: ${configPath}`);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });
}

function sanitizeIconClass(value) {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .filter(part => /^[A-Za-z0-9_-]+$/.test(part))
    .join(' ');
}

function sanitizeHref(rawUrl) {
  const url = String(rawUrl || '').trim();
  if (!url) {
    throw new Error('Empty link url');
  }

  // Allow relative URLs
  if (
    url.startsWith('/') ||
    url.startsWith('./') ||
    url.startsWith('../') ||
    url.startsWith('#')
  ) {
    return url;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  const allowed = new Set(['http:', 'https:', 'mailto:', 'tel:']);
  if (!allowed.has(parsed.protocol)) {
    throw new Error(`Disallowed URL scheme: ${parsed.protocol}`);
  }

  return url;
}

function isMailOrTel(rawUrl) {
  const url = String(rawUrl || '')
    .trim()
    .toLowerCase();
  return url.startsWith('mailto:') || url.startsWith('tel:');
}

// Read template
let template = fs.readFileSync('template.html', 'utf8');

// Generate links HTML (with image support and fallback to icons)
const linksHtml = config.links
  .map(link => {
    const hasImage = link.image && link.image.trim() !== '';
    const safeTitleText = escapeHtml(link.title);
    const safeTitleAttr = escapeHtml(link.title);

    const iconOrImage = hasImage
      ? `<img src="${escapeHtml(link.image)}" alt="${safeTitleAttr}" class="link-image">`
      : `<i class="link-icon ${escapeHtml(sanitizeIconClass(link.icon))}"></i>`;

    const isMastodon =
      (typeof link.title === 'string' &&
        link.title.toLowerCase().includes('mastodon')) ||
      (typeof link.icon === 'string' &&
        link.icon.toLowerCase().includes('mastodon')) ||
      (typeof link.url === 'string' && /^https?:\/\/[^\s]+\/@/.test(link.url));

    const relAttrValue = isMastodon
      ? 'me noopener noreferrer'
      : 'noopener noreferrer';

    const safeHref = escapeHtml(sanitizeHref(link.url));
    const targetAttr = isMailOrTel(link.url) ? '' : ' target="_blank"';
    const relAttr = isMailOrTel(link.url) ? '' : ` rel="${relAttrValue}"`;

    return `
            <a href="${safeHref}" class="link-item"${targetAttr}${relAttr}>
                ${iconOrImage}
                <span class="link-title">${safeTitleText}</span>
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
const nameRaw = String(config.profile.name ?? '');
const bioRaw = String(config.profile.bio ?? '');
const siteUrlRaw = String(config.siteUrl ?? '');

template = template.replace(/{{NAME_TEXT}}/g, escapeHtml(nameRaw));
template = template.replace(/{{NAME_ATTR}}/g, escapeHtml(nameRaw));
template = template.replace(/{{BIO_TEXT}}/g, escapeHtml(bioRaw));
template = template.replace(/{{BIO_ATTR}}/g, escapeHtml(bioRaw));
template = template.replace(
  /{{AVATAR_URL_ATTR}}/g,
  escapeHtml(config.profile.avatar ?? '')
);
template = template.replace(/{{SITE_URL_ATTR}}/g, escapeHtml(siteUrlRaw));
template = template.replace(/{{SITE_URL_JSON}}/g, JSON.stringify(siteUrlRaw));

const mailtoSubject = `Check out ${nameRaw}`;
const mailtoHref = `mailto:?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(siteUrlRaw)}`;
template = template.replace(
  /{{SHARE_EMAIL_HREF_ATTR}}/g,
  escapeHtml(mailtoHref)
);

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
// Validate assetsPath stays within configPath
if (!isPathWithinBase(assetsPath, configPath)) {
  console.error(`Error: Invalid assets path.`);
  process.exit(1);
}
if (fs.existsSync(assetsPath)) {
  copyDir(assetsPath, 'dist/assets', configPath);
  console.log('✓ Assets copied');
}

// Download fonts from Bunny Fonts and complete build
const fontFamily = config.profile.theme.fontFamily || "'Poppins', sans-serif";
(async () => {
  try {
    await downloadFonts(fontFamily);

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
          process.exit(1);
        } else {
          console.log('✓ Build complete!');
          console.log('✓ QR code generated');
          console.log('✓ Output directory: dist/');
        }
      }
    );
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
})();
