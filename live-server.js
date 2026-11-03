// Dev server for the Goodwill app: serves index.html with a tracker injected,
// writes what happens in the app to dev/events.jsonl (read by the Claude Code
// pane), and reloads the browser whenever index.html changes.
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

fs.writeFileSync(LOG, '');
let lines = [];
function log(ev) {
  lines.push(JSON.stringify({ t: Date.now(), ...ev }));
  if (lines.length > MAX_LINES) lines = lines.slice(-MAX_LINES);
  fs.writeFileSync(LOG, lines.join('\n') + '\n');
}

const clients = new Set();
let reloadTimer;
fs.watch(PAGE, () => {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    log({ kind: 'reload', text: 'index.html changed, browser reloaded' });
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
  if (req.url === '/' || req.url.startsWith('/?') || req.url === '/index.html') {
    const html = fs.readFileSync(PAGE, 'utf8');
    const tag = `<script>${TRACKER}</script>`;
    const i = html.lastIndexOf('</body>');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(i >= 0 ? html.slice(0, i) + tag + html.slice(i) : html + tag);
    return;
  }
  res.writeHead(404).end();
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Goodwill live: http://localhost:${PORT}  (log: ${LOG})`);
});
