import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Brand SVG with elegant Sprout and Golden Harvest sun/accent
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1B432B"/>
      <stop offset="100%" stop-color="#245C3A"/>
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#80B85B"/>
      <stop offset="100%" stop-color="#5F8F45"/>
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3C658"/>
      <stop offset="100%" stop-color="#D6A63A"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background with subtle border -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)"/>
  
  <!-- Subtle circular field ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="#5F8F45" stroke-width="3" stroke-dasharray="8 8" opacity="0.4"/>

  <!-- Golden Sun / Harvest Dawn in background -->
  <circle cx="330" cy="180" r="44" fill="url(#sunGrad)" opacity="0.95" filter="url(#glow)"/>

  <!-- Main Agriculture Sprout / Plant Symbolism -->
  <g filter="url(#glow)">
    <!-- Main stem -->
    <path d="M256 384 C256 310 256 220 256 160" stroke="#FAF7F0" stroke-width="16" stroke-linecap="round"/>
    
    <!-- Left Leaf -->
    <path d="M256 280 C210 270 160 210 160 160 C210 160 256 210 256 280 Z" fill="url(#leafGrad)" stroke="#FAF7F0" stroke-width="6" stroke-linejoin="round"/>
    
    <!-- Right Leaf -->
    <path d="M256 220 C290 200 350 160 350 120 C310 120 270 170 256 220 Z" fill="#80B85B" stroke="#FAF7F0" stroke-width="6" stroke-linejoin="round"/>

    <!-- Seed base / Fertile Soil Furrow -->
    <path d="M190 384 C220 404 292 404 322 384 C310 420 202 420 190 384 Z" fill="url(#sunGrad)"/>
  </g>

  <!-- Text Badge "KS" or "KisanSetu" -->
  <text x="256" y="455" font-size="34" font-weight="900" text-anchor="middle" fill="#FAF7F0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="4px">KISANSETU</text>
</svg>`;

// Maskable version with 15% safe padding
const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1B432B"/>
      <stop offset="100%" stop-color="#245C3A"/>
    </linearGradient>
    <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#80B85B"/>
      <stop offset="100%" stop-color="#5F8F45"/>
    </linearGradient>
    <linearGradient id="sunGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3C658"/>
      <stop offset="100%" stop-color="#D6A63A"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable safe zone -->
  <rect width="512" height="512" fill="url(#bgGrad2)"/>

  <!-- Centered content scaled into safe 80% circle (scale 0.78 around 256,256) -->
  <g transform="translate(256, 256) scale(0.76) translate(-256, -256)">
    <!-- Sun -->
    <circle cx="330" cy="180" r="44" fill="url(#sunGrad2)" opacity="0.95"/>

    <!-- Main stem -->
    <path d="M256 384 C256 310 256 220 256 160" stroke="#FAF7F0" stroke-width="16" stroke-linecap="round"/>
    
    <!-- Left Leaf -->
    <path d="M256 280 C210 270 160 210 160 160 C210 160 256 210 256 280 Z" fill="url(#leafGrad2)" stroke="#FAF7F0" stroke-width="6" stroke-linejoin="round"/>
    
    <!-- Right Leaf -->
    <path d="M256 220 C290 200 350 160 350 120 C310 120 270 170 256 220 Z" fill="#80B85B" stroke="#FAF7F0" stroke-width="6" stroke-linejoin="round"/>

    <!-- Seed base -->
    <path d="M190 384 C220 404 292 404 322 384 C310 420 202 420 190 384 Z" fill="url(#sunGrad2)"/>
    
    <text x="256" y="455" font-size="34" font-weight="900" text-anchor="middle" fill="#FAF7F0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" letter-spacing="4px">KISANSETU</text>
  </g>
</svg>`;

async function run() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
  console.log('Wrote public/icon.svg');

  const svgBuffer = Buffer.from(svgContent);
  const maskableBuffer = Buffer.from(maskableSvgContent);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Wrote pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Wrote pwa-512x512.png');

  // 512x512 Maskable PNG
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Wrote pwa-maskable-512x512.png');

  // Apple Touch Icon 180x180 PNG
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Wrote apple-touch-icon.png');

  // Favicon 64x64 PNG saved as favicon.ico
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Wrote favicon.ico');
}

run().catch(console.error);
