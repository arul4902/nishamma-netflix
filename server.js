const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon'
};

function resolveFilePath(reqUrl) {
  let decodedUrl = decodeURI(reqUrl.split('?')[0]);
  if (decodedUrl === '/' || decodedUrl === '') decodedUrl = '/index.html';

  const cleanUrl = decodedUrl.startsWith('/') ? decodedUrl.slice(1) : decodedUrl;

  const candidateDirs = [
    process.cwd(),
    __dirname,
    path.join(__dirname, 'dist'),
    path.join(process.cwd(), 'dist')
  ];

  for (const dir of candidateDirs) {
    const directPath = path.join(dir, cleanUrl);
    if (fs.existsSync(directPath) && !fs.statSync(directPath).isDirectory()) {
      return directPath;
    }

    // Try space vs underscore replacement (e.g. image_copy_3.png vs image copy 3.png)
    if (cleanUrl.includes('_')) {
      const spacePath = path.join(dir, cleanUrl.replace(/_/g, ' '));
      if (fs.existsSync(spacePath) && !fs.statSync(spacePath).isDirectory()) {
        return spacePath;
      }
    }
    if (cleanUrl.includes(' ')) {
      const underscorePath = path.join(dir, cleanUrl.replace(/ /g, '_'));
      if (fs.existsSync(underscorePath) && !fs.statSync(underscorePath).isDirectory()) {
        return underscorePath;
      }
    }
  }

  // Fallback for missing images to image.png
  const ext = path.extname(cleanUrl).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    for (const dir of candidateDirs) {
      const fallbackImg = path.join(dir, 'assets', 'image.png');
      if (fs.existsSync(fallbackImg) && !fs.statSync(fallbackImg).isDirectory()) return fallbackImg;
    }
    return null;
  }

  // If a media or code file was explicitly requested and not found, do not serve HTML
  if (['.mp4', '.mp3', '.wav', '.css', '.js', '.json'].includes(ext)) {
    return null;
  }

  // Fallback for navigation routes to index.html
  for (const dir of candidateDirs) {
    const indexPath = path.join(dir, 'index.html');
    if (fs.existsSync(indexPath) && !fs.statSync(indexPath).isDirectory()) return indexPath;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const reqUrl = req.headers['x-forwarded-url'] ||
                 req.headers['x-matched-path'] ||
                 req.headers['x-invoke-path'] ||
                 req.url || '/';

  if (reqUrl.includes('__debug')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
      res.end(JSON.stringify({
        reqUrl,
        rawUrl: req.url,
        headers: req.headers,
        cwd: process.cwd(),
        dirname: __dirname,
        cwdFiles: fs.readdirSync(process.cwd()),
        dirnameFiles: fs.readdirSync(__dirname),
        assetsInCwd: fs.existsSync(path.join(process.cwd(), 'assets')) ? fs.readdirSync(path.join(process.cwd(), 'assets')) : 'none',
        assetsInDirname: fs.existsSync(path.join(__dirname, 'assets')) ? fs.readdirSync(path.join(__dirname, 'assets')) : 'none'
      }, null, 2));
    } catch (e) {
      res.end(JSON.stringify({ error: e.message, stack: e.stack }));
    }
    return;
  }

  // Prevent serving server.js itself as code
  const targetUrl = (reqUrl === '/server.js' || reqUrl === 'server.js') ? '/index.html' : reqUrl;
  const filePath = resolveFilePath(targetUrl);

  if (!filePath || !fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: '404 Not Found',
      requestedUrl: req.url,
      cwd: process.cwd(),
      dirname: __dirname,
      cwdFiles: fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()) : [],
      dirnameFiles: fs.existsSync(__dirname) ? fs.readdirSync(__dirname) : []
    }, null, 2));
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Support range requests for smooth video & audio playback
  const range = req.headers.range;
  if (range && (ext === '.mp4' || ext === '.mp3')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    });
    file.pipe(res);
  } else {
    const cacheControl = (ext === '.html') ? 'no-cache' : 'public, max-age=31536000, immutable';
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Cache-Control': cacheControl
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// Export server for Vercel Serverless Function & local execution
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`NISHAMMA+ server running at http://localhost:${PORT}`);
  });
}

module.exports = server;
