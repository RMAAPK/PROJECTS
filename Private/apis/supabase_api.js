/**
 * Supabase PostgREST & Storage API Client
 * Deeply integrates PAI with Supabase (wfccdwzreyspzewrzjjy.supabase.co):
 * - Real-time system telemetry logging into system_logs
 * - Verified CNC snippets (G-code, canned cycles, cutting mechanics, Kienzle force)
 * - B2B Catalog items and machine specs
 */

const SUPABASE_DEFAULT_URL = process.env.SUPABASE_URL || "https://wfccdwzreyspzewrzjjy.supabase.co";
const SUPABASE_DEFAULT_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  "REDACTED_SUPABASE_KEY";

function getHeaders(apiKey) {
  const key = apiKey || process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_DEFAULT_KEY;
  return {
    "apikey": key,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}

/**
 * Log system telemetry event to Supabase system_logs table
 * @param {string} type - e.g. 'PAI_QUERY', 'PAI_MEDIA_PERCEPTION', 'PAI_MODEL_ROUTE'
 * @param {string} message - description or summary of event
 * @param {string} status - 'SUCCESS' | 'WARNING' | 'ERROR'
 * @param {string} [supabaseUrl]
 * @param {string} [apiKey]
 */
async function logSystemEvent(type, message, status = "SUCCESS", supabaseUrl = SUPABASE_DEFAULT_URL, apiKey) {
  try {
    const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/system_logs`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...getHeaders(apiKey),
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        type: type,
        message: typeof message === "string" ? message.slice(0, 1000) : JSON.stringify(message).slice(0, 1000),
        status: status,
        created_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch (err) {
    console.warn(`[Supabase Telemetry Warning]: ${err.message}`);
    return false;
  }
}

/**
 * Search CNC Snippets and Knowledge from Supabase
 * @param {string} query - search query
 * @param {number} [limit=3] - max results
 * @param {string} [supabaseUrl]
 * @param {string} [apiKey]
 * @returns {Promise<Array>}
 */
async function searchCncKnowledge(query, limit = 3, supabaseUrl = SUPABASE_DEFAULT_URL, apiKey) {
  try {
    if (!query || typeof query !== "string") return [];
    const clean = query.trim().toLowerCase();

    // Check relevant keywords
    const keywords = ["gcode", "g83", "peck", "drill", "macro", "kienzle", "power", "feed", "rpm", "flute", "chatter", "chip", "mingda", "weihong", "lathe", "thread", "sinumerik", "fanuc", "haas", "milling", "spindle"];
    const hasKeyword = keywords.some(k => clean.includes(k));
    if (!hasKeyword && clean.length < 5) return [];

    // Query cnc_snippets from Supabase
    const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/cnc_snippets?select=id,title,snippet_type,controller_dialect,code_content,parameters&limit=${limit}`;
    const res = await fetch(url, {
      headers: getHeaders(apiKey)
    });

    if (!res.ok) {
      return [];
    }

    const snippets = await res.json();
    // Rank snippets based on token overlap with query
    const tokens = clean.split(/\s+/).filter(t => t.length > 2);
    const scored = snippets.map(s => {
      let score = 0;
      const haystack = `${s.title} ${s.snippet_type} ${s.controller_dialect} ${s.code_content}`.toLowerCase();
      tokens.forEach(tok => {
        if (haystack.includes(tok)) score += 1;
      });
      return { ...s, score };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  } catch (err) {
    console.warn(`[Supabase Snippets Search Warning]: ${err.message}`);
    return [];
  }
}

/**
 * Fetch B2B catalog items from Supabase
 * @param {string} [supabaseUrl]
 * @param {string} [apiKey]
 * @returns {Promise<Array>}
 */
async function fetchCatalogItems(supabaseUrl = SUPABASE_DEFAULT_URL, apiKey) {
  try {
    const url = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/catalog_items?select=*&limit=10`;
    const res = await fetch(url, { headers: getHeaders(apiKey) });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn(`[Supabase Catalog Fetch Warning]: ${err.message}`);
    return [];
  }
}

/**
 * Fetch all memories from Supabase PostgREST (if table exists)
 */
async function fetchMemories(supabaseUrl = SUPABASE_DEFAULT_URL, anonKey) {
  try {
    const url = `${supabaseUrl}/rest/v1/memories?select=*&order=created_at.desc`;
    const res = await fetch(url, { headers: getHeaders(anonKey) });
    if (!res.ok) return [];
    return await res.json();
  } catch (_) {
    return [];
  }
}

module.exports = {
  logSystemEvent,
  searchCncKnowledge,
  fetchCatalogItems,
  fetchMemories,
  SUPABASE_DEFAULT_URL
};
