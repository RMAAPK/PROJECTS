/**
 * PAI Memory Fabric API
 * Lightweight keyword-relevance scoring engine over in-memory context nodes.
 * Add custom nodes to MEMORY_NODES as needed.
 */

const STOPWORDS = new Set([
  "what", "who", "where", "when", "why", "how", "is", "are", "was", "were",
  "am", "the", "a", "an", "and", "or", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "do", "does", "did", "my", "your", "his",
  "her", "their", "our", "me", "you", "him", "them", "us", "i", "it",
  "its", "tell", "about", "can", "could", "would", "should", "will",
  "detail", "summarize", "show", "give", "please", "run", "have", "has",
  "had", "take", "takes", "much", "many", "be", "been", "being"
]);

// Add custom context nodes here if needed
// Format: { sneakKey: "UNIQUE_KEY", category: "category", title: "Title", content: "Content..." }
const MEMORY_NODES = [];

function searchMemoryFabric(query, maxResults = 4) {
  if (!query || !query.trim() || MEMORY_NODES.length === 0) return [];
  const rawClean = query.trim().toLowerCase();
  const upperSneak = rawClean.toUpperCase().replace(/\s+/g, "_");

  const rawTokens = rawClean.split(/[^a-zA-Z0-9_\-]+/);
  const keywords = [];
  for (const t of rawTokens) {
    const token = t.trim();
    if (token.length > 1 && !STOPWORDS.has(token)) {
      keywords.push(token);
    }
  }
  if (keywords.length === 0) {
    for (const t of rawTokens) {
      if (t.trim().length > 1) keywords.push(t.trim());
    }
  }

  const scoredList = [];
  for (const node of MEMORY_NODES) {
    let score = 0;
    const sneakLower = node.sneakKey.toLowerCase();
    const titleLower = node.title.toLowerCase();
    const contentLower = node.content.toLowerCase();

    if (node.sneakKey === upperSneak || upperSneak.includes(node.sneakKey)) {
      score += 120;
    }
    if (titleLower.includes(rawClean)) {
      score += 80;
    } else if (contentLower.includes(rawClean)) {
      score += 50;
    }

    for (const kw of keywords) {
      const variants = new Set([kw, kw.replace(/-/g, ""), kw.replace(/-/g, "_")]);
      if (kw.endsWith("s") && kw.length > 2) {
        variants.add(kw.slice(0, -1));
      }
      for (const v of variants) {
        if (sneakLower.includes(v)) score += 35;
        if (titleLower.includes(v)) score += 25;
        if (contentLower.includes(v)) score += 15;
      }
    }

    if (score > 0) scoredList.push({ node, score });
  }

  scoredList.sort((a, b) => b.score - a.score);
  return scoredList.slice(0, maxResults).map(item => item.node);
}

module.exports = {
  MEMORY_NODES,
  searchMemoryFabric
};
