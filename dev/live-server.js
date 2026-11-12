// Dev server for the Goodwill app: serves index.html (with a tracker script tag
// added) plus the files under src/ and assets/, writes what happens in the app to
// dev/events.jsonl (read by the Claude Code pane), and reloads the browser
// whenever a source file changes.
// Run: node dev/live-server.js   then open http://localhost:5173
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 5173;
const ROOT = path.join(__dirname, '..');
const PAGE = path.join(ROOT, 'index.html');
const LOG = path.join(__dirname, 'events.jsonl');
const TRACKER = fs.readFileSync(path.join(__dirname, 'tracker.js'), 'utf8');
const MAX_LINES = 500;
const TYPES = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
// Same policy as the <meta> tag in index.html, sent as a real header too.
const HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
};

fs.writeFileSync(LOG, '');
let lines = [];
function log(ev) {
  lines.push(JSON.stringify({ t: Date.now(), ...ev }));
  if (lines.length > MAX_LINES) lines = lines.slice(-MAX_LINES);
  fs.writeFileSync(LOG, lines.join('\n') + '\n');
}

const clients = new Set();
let reloadTimer;
fs.watch(ROOT, { recursive: true }, (_, file) => {
  if (!file || !/^(index\.html$|src[\\/]|assets[\\/])/.test(file)) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    log({ kind: 'reload', text: `${file} changed, browser reloaded` });
    for (const res of clients) res.write('data: reload\n\n');
  }, 200);
});

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/__live') {
    let body = '';
    req.on('data', c => { if (body.length < 20000) body += c; });
    req.on('end', () => {
      try { log(JSON.parse(body)); } catch { /* ignore malformed */ }
      res.writeHead(204).end();
    });
    return;
  }
  if (req.url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (req.url === '/__tracker.js') {
    res.writeHead(200, { ...HEADERS, 'Content-Type': TYPES['.js'] }).end(TRACKER);
    return;
  }
  if (req.url === '/' || req.url.startsWith('/?') || req.url === '/index.html') {
    const html = fs.readFileSync(PAGE, 'utf8');
    const tag = '<script src="/__tracker.js"></script>';
    const i = html.lastIndexOf('</body>');
    res.writeHead(200, { ...HEADERS, 'Content-Type': 'text/html; charset=utf-8' });
    res.end(i >= 0 ? html.slice(0, i) + tag + html.slice(i) : html + tag);
    return;
  }
  // Static files: only known types, only inside src/ and assets/ (dev/ and backups stay private).
  let rel;
  try { rel = decodeURIComponent(req.url.split('?')[0]); } catch { rel = ''; }
  const file = path.join(ROOT, rel);
  const type = TYPES[path.extname(file)];
  const inside = [path.join(ROOT, 'src'), path.join(ROOT, 'assets')].some(d => file.startsWith(d + path.sep));
  if (req.method === 'GET' && type && inside && fs.existsSync(file) && fs.statSync(file).isFile()) {
    // Range requests: browsers need them to seek and loop video.
    const size = fs.statSync(file).size, m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
    if (m) {
      const start = +m[1], end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
      if (start > end) { res.writeHead(416, { ...HEADERS, 'Content-Range': `bytes */${size}` }).end(); return; }
      res.writeHead(206, { ...HEADERS, 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { ...HEADERS, 'Content-Type': type }).end(fs.readFileSync(file));
    return;
  }
  res.writeHead(404, HEADERS).end();
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Goodwill live: http://localhost:${PORT}  (log: ${LOG})`);
});
