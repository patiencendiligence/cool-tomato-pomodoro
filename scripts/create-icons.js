import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Simple tomato icon SVG
const createSvg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Tomato body -->
  <circle cx="${size/2}" cy="${size/2 + size*0.05}" r="${size*0.4}" fill="#e74c3c"/>
  <!-- Highlight -->
  <ellipse cx="${size*0.35}" cy="${size*0.4}" rx="${size*0.1}" ry="${size*0.08}" fill="#ec7063" opacity="0.6"/>
  <!-- Stem -->
  <rect x="${size*0.42}" y="${size*0.08}" width="${size*0.16}" height="${size*0.18}" fill="#27ae60" rx="${size*0.03}"/>
  <!-- Leaf -->
  <path d="M${size*0.5} ${size*0.15} Q${size*0.7} ${size*0.05} ${size*0.75} ${size*0.18}" stroke="#27ae60" stroke-width="${size*0.06}" fill="none" stroke-linecap="round"/>
</svg>`;

// Write SVG files (can be used directly or converted to PNG)
[16, 48, 128].forEach(size => {
  const svg = createSvg(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.svg`), svg);
  console.log(`Created icon${size}.svg`);
});

// For PNG, we'll create a simple base64 encoded placeholder
// These are minimal red circle icons as fallback
const pngData = {
  16: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2klEQVQ4T6WTsQ3CMBCGP0egpGMEBmAERmAERmAERmAERmCEDBBRUqZjBIZgIefgQuwcwpUn+/7v/v+dU9F4qsb1AQzgAtyBGZgknYJPAZwMMAJn4AAclXCHJPgG0AMP4w5sJZ38gC8AEziB3QPDSXoUwC8AnWtXYJ2jWWLOkzT/7oEKRHI28wBb6YOcbWD+ChiZfOkBjJaY8wPwCWCrZKu2n+dpkOAJQF1HWAGNpEuh0AJwMsAI/CWe5L6JBDAAL8M+xpPkOgkPAJoSYV6epFMo1AC8DTv9A3mKbBFVXr8GAAAAAElFTkSuQmCC',
  48: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA5klEQVRoQ+2ZwQ3CMAxFfxhgBIZgBIZgBIZgBIZgBIZghAwQUdKxCkNkKjdKcnFVqU2P9pVYjh3HdcXgUQ2uHwng7sBdYCe4C3QB1Q0ugDvQAHPgAJwkXf2AnwH4PvAG9pKufsB3AN4GPIHd1ekZ8j6StL8O4BwROZsvHaDT35K2v8d6WtI3gB+AXeAJrK9OP4TPJe3+OlAXkXKb7wLYSmrCUBfY8wA7YAFMykhp+5Ok/X8CqIvIsc1fCLCSNMsh9QC8DfsYT5JrJ/wAaE6EfXmSjqHQA/A07PQH8hPZIr4GZHBIgrkbfwAAAABJRU5ErkJggg==',
  128: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAA+klEQVR4nO3csQ3CMBRF0RdGYARGYARGYARGYARGYARGyAARJSVdWoYgMoWbKHqJdCXrd/6x/pwUSKqSVCXJU3UA1QXslQD2SgB7JYC9EsBeCWCvBLBXAtgrAeyVAPZKAHslgL0SwF4JYK8EsFcC2CsB7JUA9koAeyWAvRLAXglgrwSwVwLYKwHslQD2SgB7JYC9EsBeCWCvBLBXAtgrAeyVAPZKAHslgL0SwF4JYK8EsFcC2CsB7JUA9koAeyWAvRLAXglgrwSwVwLYKwHslQD2SgB7JYC9EsBeCWCvBLBXAtgrAeyVAPZKAHslgL0SwF4JYK8EsFcC2OsHKJRREXm3PQIAAAAASUVORK5CYII='
};

[16, 48, 128].forEach(size => {
  const buffer = Buffer.from(pngData[size], 'base64');
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
});

console.log('Icons created successfully!');
