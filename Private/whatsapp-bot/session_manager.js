/**
 * Session Capture & Cloud Restore Utility for Baileys
 * Serializes the multi-file auth state into:
 * 1. whatsapp_session_bundle.json (Direct JSON map of all key files)
 * 2. whatsapp_session_base64.txt (Single environment variable ready string)
 */

const fs = require("fs");
const path = require("path");

const AUTH_DIR = path.join(__dirname, "auth_info_baileys");
const BUNDLE_FILE = path.join(__dirname, "whatsapp_session_bundle.json");
const BASE64_FILE = path.join(__dirname, "whatsapp_session_base64.txt");

function captureSession() {
  if (!fs.existsSync(AUTH_DIR)) {
    console.error("[Error] auth_info_baileys directory does not exist!");
    process.exit(1);
  }

  const files = fs.readdirSync(AUTH_DIR);
  if (files.length === 0) {
    console.error("[Error] auth_info_baileys is empty!");
    process.exit(1);
  }

  const sessionData = {};
  for (const file of files) {
    const fullPath = path.join(AUTH_DIR, file);
    if (fs.statSync(fullPath).isFile()) {
      sessionData[file] = fs.readFileSync(fullPath, "utf-8");
    }
  }

  const jsonStr = JSON.stringify(sessionData, null, 2);
  const base64Str = Buffer.from(jsonStr).toString("base64");

  fs.writeFileSync(BUNDLE_FILE, jsonStr, "utf-8");
  fs.writeFileSync(BASE64_FILE, base64Str, "utf-8");

  console.log(`[Success] Captured ${Object.keys(sessionData).length} session files.`);
  console.log(`[Bundle File]: ${BUNDLE_FILE} (${(jsonStr.length / 1024).toFixed(2)} KB)`);
  console.log(`[Base64 File]: ${BASE64_FILE} (${(base64Str.length / 1024).toFixed(2)} KB)`);
}

function restoreSession(base64Str, targetDir = AUTH_DIR) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const jsonStr = Buffer.from(base64Str, "base64").toString("utf-8");
  const sessionData = JSON.parse(jsonStr);

  for (const [file, content] of Object.entries(sessionData)) {
    fs.writeFileSync(path.join(targetDir, file), content, "utf-8");
  }

  console.log(`[Restore] Successfully restored ${Object.keys(sessionData).length} session files to ${targetDir}`);
}

module.exports = { captureSession, restoreSession };

if (require.main === module) {
  captureSession();
}
