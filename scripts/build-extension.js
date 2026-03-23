import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');

// Copy manifest.json
fs.copyFileSync(
  path.join(publicDir, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy tomato images
const tomatoImages = [
  'tomato-mascot.png',
  'tomato-stage1.png',
  'tomato-stage2.png',
  'tomato-stage3.png',
];

tomatoImages.forEach(img => {
  const imgPath = path.join(publicDir, img);
  if (fs.existsSync(imgPath)) {
    fs.copyFileSync(imgPath, path.join(distDir, img));
  }
});

// Copy icons
const iconsDir = path.join(publicDir, 'icons');
const distIconsDir = path.join(distDir, 'icons');

if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

if (fs.existsSync(iconsDir)) {
  fs.readdirSync(iconsDir).forEach(file => {
    fs.copyFileSync(
      path.join(iconsDir, file),
      path.join(distIconsDir, file)
    );
  });
}

console.log('Extension build complete! Load the "dist" folder in Chrome.');
