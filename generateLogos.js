// Utility script to convert SVG to PNG
// Run this with Node.js after installing sharp:
// npm install sharp
// node generateLogos.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define paths
const publicDir = path.join(__dirname, 'public');
const logoSvgPath = path.join(publicDir, 'logo.svg');
const faviconSvgPath = path.join(publicDir, 'favicon.svg');
const outputLogo192Path = path.join(publicDir, 'logo192.png');
const outputLogo512Path = path.join(publicDir, 'logo512.png');
const outputFaviconPath = path.join(publicDir, 'favicon.ico');

// Check if files exist
if (!fs.existsSync(logoSvgPath)) {
  console.error('Logo SVG file does not exist:', logoSvgPath);
  process.exit(1);
}

if (!fs.existsSync(faviconSvgPath)) {
  console.error('Favicon SVG file does not exist:', faviconSvgPath);
  process.exit(1);
}

// Convert logo to 192x192 PNG
sharp(logoSvgPath)
  .resize(192, 192)
  .png()
  .toFile(outputLogo192Path)
  .then(() => {
    console.log('Created:', outputLogo192Path);
  })
  .catch(err => {
    console.error('Error creating logo192.png:', err);
  });

// Convert logo to 512x512 PNG
sharp(logoSvgPath)
  .resize(512, 512)
  .png()
  .toFile(outputLogo512Path)
  .then(() => {
    console.log('Created:', outputLogo512Path);
  })
  .catch(err => {
    console.error('Error creating logo512.png:', err);
  });

// Convert favicon to ico
sharp(faviconSvgPath)
  .resize(64, 64)
  .png()
  .toFile(outputFaviconPath.replace('.ico', '.png'))
  .then(() => {
    console.log('Created PNG favicon, use a converter to create .ico file');
  })
  .catch(err => {
    console.error('Error creating favicon:', err);
  });

console.log('Conversion process started. Check console for results.'); 