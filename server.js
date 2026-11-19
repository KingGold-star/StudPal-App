const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleAiTutorRequest, handleGenerateSpeechRequest } = require('./serverAiTutor');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Global CORS preflight handler
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, apikey, x-client-info, x-gemini-api-key',
    });
    res.end();
    return;
  }

  const rawUrl = req.url || '';
  const pathname = rawUrl.split('?')[0];

  // Backend AI Tutor Endpoint (Supabase edge function parity & local proxy)
  if (pathname === '/functions/v1/ai-tutor' || pathname === '/api/ai-tutor') {
    return handleAiTutorRequest(req, res);
  }

  // Backend TTS Speech Endpoint (Aoede realistic female voice & caching)
  if (pathname === '/functions/v1/generate-speech' || pathname === '/api/generate-speech') {
    return handleGenerateSpeechRequest(req, res);
  }

  let reqUrl = decodeURI(pathname);
  if (reqUrl === '/') reqUrl = '/index.html';

  // Candidate paths to search for the requested file
  const candidatePaths = [
    path.join(__dirname, 'preview', reqUrl),
    path.join(__dirname, reqUrl),
    path.join(__dirname, 'assets', reqUrl.replace(/^\/assets/, '')),
    path.join(__dirname, 'preview', path.basename(reqUrl))
  ];

  let filePath = null;
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      filePath = candidate;
      break;
    }
  }

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${reqUrl}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`500 Server Error: ${err.code}`);
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
});

server.on('error', (err) => {
  console.error('[Preview Server Error]:', err);
});

process.on('uncaughtException', (err) => {
  console.error('[Preview Server UncaughtException]:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Preview Server UnhandledRejection]:', reason);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Preview Server UnhandledRejection]:', reason);
});

server.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`  StudPal AI Tutor Backend Server is LIVE!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  AI Tutor Endpoint: http://localhost:${PORT}/functions/v1/ai-tutor`);
  console.log(`  Speech Endpoint:   http://localhost:${PORT}/functions/v1/generate-speech`);
  console.log(`====================================================`);
});
