const { spawn } = require('child_process');
const http = require('http');

let serverProcess = null;
let isRestarting = false;

function startServer() {
  if (serverProcess) {
    try { serverProcess.kill(); } catch (e) {}
  }

  console.log('[WATCHDOG] 🚀 Launching DecillionX Server Process...');
  serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  serverProcess.on('exit', (code, signal) => {
    console.warn(`[WATCHDOG] ⚠️ Server process exited with code ${code}, signal ${signal}. Restarting in 1s...`);
    serverProcess = null;
    if (!isRestarting) {
      isRestarting = true;
      setTimeout(() => { isRestarting = false; startServer(); }, 1000);
    }
  });
}

function checkHealth() {
  const req = http.get('http://localhost:3000/api/health', { timeout: 3500 }, (res) => {
    if (res.statusCode !== 200) {
      console.warn(`[WATCHDOG] Health check returned HTTP ${res.statusCode}. Restarting server...`);
      startServer();
    }
  });

  req.on('error', () => {
    console.warn('[WATCHDOG] Server unresponsive on http://localhost:3000. Restarting server...');
    startServer();
  });

  req.on('timeout', () => {
    req.destroy();
    console.warn('[WATCHDOG] Health check timed out. Restarting server...');
    startServer();
  });
}

// Initial start
startServer();

// Periodically check health every 5 seconds
setInterval(checkHealth, 5000);
