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

// Copy tomato mascot
const mascotPath = path.join(publicDir, 'tomato-mascot.png');
if (fs.existsSync(mascotPath)) {
  fs.copyFileSync(mascotPath, path.join(distDir, 'tomato-mascot.png'));
}

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
