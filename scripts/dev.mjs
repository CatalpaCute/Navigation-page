import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { document } from '../src/lib/render.mjs';

const root = resolve('public');
const types = { '.css':'text/css; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.json':'application/json; charset=utf-8' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (['/', '/projects', '/projects/', '/about', '/about/', '/About', '/About/'].includes(pathname)) {
      const snapshot = JSON.parse(await readFile('src/content/about.json', 'utf8'));
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(document(pathname.toLowerCase().replace(/\/$/,'') || '/', snapshot));
      return;
    }
    const isSource = pathname === '/content/site.mjs';
    const file = isSource ? resolve('src/content/site.mjs') : resolve(root, `.${pathname}`);
    if (!isSource && !file.startsWith(root + '\\') && !file.startsWith(root + '/')) throw new Error('无效路径');
    const contents = await readFile(file);
    response.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream'});
    response.end(contents);
  } catch {
    if (!response.headersSent) response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    response.end('找不到这个文件。');
  }
});
server.on('error', error => { console.error(`预览服务无法启动：${error.message}`); process.exitCode = 1; });
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
