/**
 * Ali CNC Private CEO AI - Huskey Sentinel
 * Live Telemetry & Keep-Awake Ping Dashboard
 * Displays Multimodal, Dynamic Routing, Custom Chats, and Supabase Telemetry
 */

function getStatusHtml(stats) {
  const {
    uptimeSeconds,
    memoryUsageMB,
    phoneNumber,
    botState,
    totalMessagesHandled,
    voiceNotesRead = 0,
    imagesRead = 0,
    customChatTriggers = 0,
    lastActiveTime,
    selfPingUrl
  } = stats;

  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ali CNC CEO AI • Huskey Sentinel</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22><text y=%2226%22 font-size=%2224%22>🐺</text></svg>">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: rgba(18, 24, 38, 0.85);
      --card-border: rgba(56, 189, 248, 0.2);
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.35);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.4);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: radial-gradient(circle at 50% 0%, #172554 0%, var(--bg) 75%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      width: 100%;
      max-width: 740px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px var(--accent-glow);
      padding: 32px;
      overflow: hidden;
      position: relative;
    }
    .glow-radar {
      position: absolute;
      top: -120px;
      right: -120px;
      width: 240px;
      height: 240px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-icon {
      font-size: 32px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 8px;
      border-radius: 16px;
      line-height: 1;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 13px;
      color: var(--text-muted);
    }
    .status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid var(--success);
      color: var(--success);
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 0 12px var(--success-glow);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }
    .metric-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.12);
      border-radius: 16px;
      padding: 16px;
    }
    .metric-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .metric-val {
      font-size: 17px;
      font-weight: 700;
      color: var(--text);
    }
    .capabilities-section {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .cap-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .caps-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 13px;
    }
    .cap-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #cbd5e1;
    }
    .ping-section {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .ping-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .url-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #090d16;
      border: 1px solid rgba(148, 163, 184, 0.2);
      padding: 10px 14px;
      border-radius: 12px;
      margin-top: 10px;
    }
    .url-box input {
      background: transparent;
      border: none;
      color: var(--accent);
      font-family: monospace;
      font-size: 13px;
      width: 100%;
      outline: none;
    }
    .btn {
      background: var(--accent);
      color: #041e49;
      font-size: 13px;
      font-weight: 600;
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn:hover {
      filter: brightness(1.15);
      transform: translateY(-1px);
    }
    .btn:active {
      transform: translateY(0);
    }
    .auto-ping-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(148, 163, 184, 0.1);
      font-size: 12px;
      color: var(--text-muted);
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
    }
    .footer a {
      color: var(--accent);
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="glow-radar"></div>

    <div class="header">
      <div class="brand">
        <div class="brand-icon">🐺</div>
        <div>
          <div class="brand-title">Ali CNC CEO AI</div>
          <div class="brand-sub">Huskey Sentinel • Multimodal Cloud Node</div>
        </div>
      </div>
      <div class="status-pill">
        <div class="status-dot"></div>
        <span>${botState || 'ACTIVE'}</span>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Uptime</div>
        <div class="metric-val" id="uptimeDisplay">${uptimeString}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">RAM Footprint</div>
        <div class="metric-val">${memoryUsageMB} MB</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Messages</div>
        <div class="metric-val">${totalMessagesHandled || 0} msgs</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Custom Chats (!pai)</div>
        <div class="metric-val">${customChatTriggers || 0}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Autopilot Active</div>
        <div class="metric-val" style="color: var(--accent);">${stats.activeHandledChats || 0} chats</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Voice Notes (VMs)</div>
        <div class="metric-val">${voiceNotesRead || 0} read</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Images Processed</div>
        <div class="metric-val">${imagesRead || 0} read</div>
      </div>
    </div>

    <div class="capabilities-section">
      <div class="cap-title">⚡ Autonomous Sentinel Capabilities</div>
      <div class="caps-list">
        <div class="cap-item"><span>🎯</span> <b>Autopilot:</b> "handle this chat" / "i got this"</div>
        <div class="cap-item"><span>🏷️</span> <b>Trigger:</b> <code>!pai {prompt}</code> + Self-Chat</div>
        <div class="cap-item"><span>📦</span> <b>Batching:</b> 1.2s sliding window debounce</div>
        <div class="cap-item"><span>🎙️</span> <b>Voice Notes:</b> Replicate Whisper Large-v3</div>
        <div class="cap-item"><span>🖼️</span> <b>Images:</b> Replicate LLaVA-13B + Gemini Vision</div>
        <div class="cap-item"><span>🧠</span> <b>AI Router:</b> DeepSeek V3.1 / R1 / Gemini</div>
        <div class="cap-item"><span>💾</span> <b>Telemetry:</b> Supabase live system_logs</div>
      </div>
    </div>

    <div class="ping-section">
      <div class="ping-title">
        <span>⚡ Render Free-Plan Keep-Awake URL</span>
      </div>
      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
        Add this URL to <b>UptimeRobot</b> or <b>cron-job.org</b> (every 5-10 minutes) to keep your Render instance permanently awake 24/7.
      </p>
      <div class="url-box">
        <input type="text" id="pingUrlInput" value="${selfPingUrl || 'https://forge.alicnc.pk/ping'}" readonly>
        <button class="btn" onclick="copyPingUrl()">Copy</button>
      </div>
      <div class="auto-ping-bar">
        <span>Autonomous Heartbeat: <b>Every 10m</b></span>
        <span>Last Active: <b>${new Date(lastActiveTime).toLocaleTimeString()}</b></span>
      </div>
    </div>

    <div class="footer">
      <span>Ali CNC • Raja Muhammad Ali Asghar</span>
      <a href="https://forge.alicnc.pk" target="_blank">forge.alicnc.pk →</a>
    </div>
  </div>

  <script>
    function copyPingUrl() {
      const input = document.getElementById('pingUrlInput');
      input.select();
      document.execCommand('copy');
      const btn = event.target;
      const old = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = old, 1500);
    }
  </script>
</body>
</html>`;
}

module.exports = { getStatusHtml };
