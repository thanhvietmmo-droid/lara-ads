/**
 * LARA Ads Dashboard – Render.com Server
 * Tự động chạy trên cloud, có link share cho sếp xem
 */

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const PORT     = process.env.PORT || 3000;
const PASSWORD = process.env.DASHBOARD_PASSWORD || 'lara2026'; // Đổi trong Render Environment

// ── Basic Auth ──
function checkAuth(req, res) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="LARA Ads Dashboard"',
      'Content-Type': 'text/html; charset=utf-8'
    });
    res.end('<h2 style="font-family:sans-serif;text-align:center;margin-top:80px">🔒 Vui lòng đăng nhập để xem dashboard</h2>');
    return false;
  }
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (pass !== PASSWORD) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="LARA Ads Dashboard"' });
    res.end('Sai mật khẩu');
    return false;
  }
  return true;
}

// ── Facebook API Proxy ──
function fbFetch(fbPath, callback) {
  const options = {
    hostname: 'graph.facebook.com',
    path: fbPath,
    method: 'GET',
    headers: { 'User-Agent': 'LARA-Ads-Dashboard/1.0' }
  };
  let raw = '';
  const req = https.request(options, res => {
    res.setEncoding('utf8');
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      try { callback(null, JSON.parse(raw)); }
      catch (e) { callback(new Error('Parse error')); }
    });
  });
  req.on('error', callback);
  req.setTimeout(20000, () => { req.destroy(); callback(new Error('Timeout')); });
  req.end();
}

// ── HTTP Server ──
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Health check cho Render (không cần auth)
  if (parsed.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // Kiểm tra auth cho tất cả route khác
  if (!checkAuth(req, res)) return;

  // Serve dashboard
  if (parsed.pathname === '/' || parsed.pathname === '/dashboard.html') {
    const filePath = path.join(__dirname, 'dashboard.html');
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Không tìm thấy dashboard.html'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // Proxy Facebook API
  if (parsed.pathname === '/api/fb') {
    const fbPath = parsed.query.path;
    if (!fbPath) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Thiếu path' }));
      return;
    }
    fbFetch(decodeURIComponent(fbPath), (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else     res.end(JSON.stringify(data));
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log('✅ LARA Ads Dashboard đang chạy tại port ' + PORT);
  console.log('🔒 Mật khẩu: ' + PASSWORD);
});
