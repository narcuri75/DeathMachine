import { createReadStream, stat } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const root = resolve(process.cwd());

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mp4', 'video/mp4'],
]);

function isInsideRoot(filePath) {
  return filePath === root || filePath.startsWith(`${root}${sep}`);
}

function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header || '');

  if (!match) {
    return null;
  }

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : size - 1;

  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end || start >= size) {
    return null;
  }

  return {
    start,
    end: Math.min(end, size - 1),
  };
}

function sendFile(request, response, filePath) {
  stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      send404(response);
      return;
    }

    const type = contentTypes.get(extname(filePath).toLowerCase()) || 'application/octet-stream';
    const range = parseRange(request.headers.range, stats.size);

    if (request.headers.range && !range) {
      response.writeHead(416, {
        'Content-Range': `bytes */${stats.size}`,
        'Accept-Ranges': 'bytes',
      });
      response.end();
      return;
    }

    if (range) {
      response.writeHead(206, {
        'Content-Type': type,
        'Content-Length': range.end - range.start + 1,
        'Content-Range': `bytes ${range.start}-${range.end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      });
      createReadStream(filePath, range).pipe(response);
      return;
    }

    response.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    });
    createReadStream(filePath).pipe(response);
  });
}

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
  const requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = resolve(root, requestedPath);

  if (!isInsideRoot(filePath)) {
    response.writeHead(403);
    response.end();
    return;
  }

  sendFile(request, response, filePath);
});

server.listen(port, host, () => {
  console.log(`Serving http://${host}:${port}`);
});
