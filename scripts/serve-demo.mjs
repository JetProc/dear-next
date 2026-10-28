import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../dist/index.html', import.meta.url));
createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(html);
  } else { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Synthetic demo only: http://127.0.0.1:4173'));
