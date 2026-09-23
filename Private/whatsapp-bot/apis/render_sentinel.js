/**
 * Ali CNC PAI — Render Cloud Diagnostic Sentinel
 * Direct integration with Render REST API (api.render.com/v1):
 * - Live container log streaming & anomaly scanning
 * - Automated crash / error / disconnect detection
 * - Zero-downtime service restart & deploy health checks
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const RENDER_API_BASE = "https://api.render.com/v1";
const OWNER_ID = "tea-dakvd5m7bikc73dqn7hg";
const SERVICE_ID = "srv-dam4efgu01pc73bekcvg"; // PAI web service

function getHeaders(apiKey) {
  const key = apiKey || process.env.RENDER_API_KEY || "rnd_PFjD9hO1o1FDapvXr4nAIMDTY4GJ";
  return {
    "Authorization": `Bearer ${key}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
}

/**
 * Fetch raw logs from Render API
 * @param {number} [limit=50] 
 * @param {string} [apiKey] 
 * @returns {Promise<Array<{ id: string, message: string, timestamp: string, level: string }>>}
 */
async function fetchRecentLogs(limit = 50, apiKey) {
  try {
    const url = `${RENDER_API_BASE}/logs?ownerId=${OWNER_ID}&resource=${SERVICE_ID}&limit=${limit}`;
    const res = await fetch(url, { headers: getHeaders(apiKey) });
    if (!res.ok) {
      throw new Error(`Render API HTTP ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    const rawLogs = Array.isArray(data) ? data : (data.logs || []);
    return rawLogs.map(item => {
      const levelLabel = item.labels?.find(l => l.name === "level")?.value || "info";
      return {
        id: item.id,
        timestamp: item.timestamp,
        level: levelLabel,
        message: (item.message || "").trim()
      };
    }).reverse(); // chronological order
  } catch (err) {
    console.error(`[Render Sentinel Error]: ${err.message}`);
    throw err;
  }
}

/**
 * Scan recent logs for anomalies, errors, rate limits, and disconnects
 * @param {number} [limit=100] 
 * @param {string} [apiKey] 
 */
async function auditHuskeyHealth(limit = 100, apiKey) {
  const logs = await fetchRecentLogs(limit, apiKey);
  const anomalies = [];
  const executions = [];
  const autopilotEvents = [];

  const errorKeywords = [
    "error", "exception", "failed", "reconnecting", "disconnect",
    "unhandledrejection", "uncaughtexception", "429", "401", "440", "402", "500", "fatal"
  ];

  for (const log of logs) {
    const lower = log.message.toLowerCase();

    // Check if anomaly
    const hasError = errorKeywords.some(kw => lower.includes(kw));
    if (hasError && !lower.includes("zero errors") && !lower.includes("status: 200")) {
      anomalies.push(log);
    }

    // Check executions
    if (lower.includes("[ai router] ✅ success") || lower.includes("[reply delivered")) {
      executions.push(log);
    }

    // Check autopilot
    if (lower.includes("[autopilot action]")) {
      autopilotEvents.push(log);
    }
  }

  return {
    totalLogsExamined: logs.length,
    anomalyCount: anomalies.length,
    anomalies: anomalies.slice(-15),
    recentExecutions: executions.slice(-10),
    autopilotEvents: autopilotEvents.slice(-5),
    latestLogTime: logs[logs.length - 1]?.timestamp || null
  };
}

/**
 * Check deployment status
 */
async function getDeployStatus(apiKey) {
  try {
    const url = `${RENDER_API_BASE}/services/${SERVICE_ID}/deploys?limit=1`;
    const res = await fetch(url, { headers: getHeaders(apiKey) });
    if (!res.ok) throw new Error(`Render API HTTP ${res.status}`);
    const deploys = await res.json();
    const latest = deploys[0]?.deploy;
    return {
      deployId: latest?.id,
      status: latest?.status,
      commitSha: latest?.commit?.id?.slice(0, 7),
      commitMessage: latest?.commit?.message,
      finishedAt: latest?.finishedAt
    };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Trigger zero-downtime service restart
 */
async function restartRenderService(apiKey) {
  try {
    const url = `${RENDER_API_BASE}/services/${SERVICE_ID}/restart`;
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(apiKey)
    });
    if (!res.ok) throw new Error(`Render restart HTTP ${res.status}: ${await res.text()}`);
    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  fetchRecentLogs,
  auditHuskeyHealth,
  getDeployStatus,
  restartRenderService,
  OWNER_ID,
  SERVICE_ID
};
