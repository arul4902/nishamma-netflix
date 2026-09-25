const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('--- Starting Static Build for Nishamma+ ---');

// 1. Clean and recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Copy index.html
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
console.log('✓ Inlined index.html copied to dist/');

// 3. Copy assets directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
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

if (fs.existsSync(path.join(rootDir, 'assets'))) {
  copyDir(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
  console.log('✓ assets/ directory copied to dist/assets/');
}

// 4. Also copy css and js as fallbacks
if (fs.existsSync(path.join(rootDir, 'css'))) {
  copyDir(path.join(rootDir, 'css'), path.join(distDir, 'css'));
  console.log('✓ css/ directory copied to dist/css/');
}
if (fs.existsSync(path.join(rootDir, 'js'))) {
  copyDir(path.join(rootDir, 'js'), path.join(distDir, 'js'));
  console.log('✓ js/ directory copied to dist/js/');
}

console.log('--- Static Build Complete: dist/ is ready for Vercel CDN ---');
