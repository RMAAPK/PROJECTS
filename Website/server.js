const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Enable gzip/deflate compression for fast Core Web Vitals
app.use(compression());
app.use(express.json());

// Load 50+ blog dataset for SSR and API
let blogs = [];
try {
  const blogsPath = path.join(__dirname, 'src', 'data', 'blogs.json');
  if (fs.existsSync(blogsPath)) {
    blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));
    console.log(`[Blog Engine] Loaded ${blogs.length} high-signal blog articles into memory.`);
  }
} catch (e) {
  console.error('[Blog Engine] Error loading blogs:', e);
}

// Security & caching headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Health check endpoint for Render Web Services
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    founder: 'Muhammad Ali (Raja Muhammad Ali Asghar)',
    uptime: process.uptime(),
    blogsCount: blogs.length,
    timestamp: new Date().toISOString(),
    primaryEmail: 'say@rmaa.pk',
  });
});

// Dedicated /ping endpoint for cron jobs (e.g. UptimeRobot, cron-job.org) to keep rmaa.pk awake 24/7
app.all('/ping', (req, res) => {
  const isHtml = req.accepts(['html', 'json']) === 'html' && !req.query.json;
  const uptimeSeconds = Math.floor(process.uptime());
  const uptimeFormatted = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`;

  if (isHtml) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PONG • rmaa.pk Keep-Alive Sentinel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;700&family=Inter:wght@600;800;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #090A0F;
      color: #F3F4F6;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #11131B;
      border: 1px solid #1E2230;
      border-radius: 16px;
      padding: 36px 32px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }
    .pulse-ring {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 2px solid #10B981;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .pulse-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 16px #10B981;
      animation: pulse 1.6s infinite ease-in-out;
    }
    @keyframes pulse {
      0% { transform: scale(0.85); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 24px #10B981; }
      100% { transform: scale(0.85); opacity: 0.8; }
    }
    h1 {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .pong { color: #10B981; }
    .domain { color: #38BDF8; font-family: 'Fira Code', monospace; }
    p {
      color: #9CA3AF;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 24px;
    }
    .stats-box {
      background: #0D0F16;
      border: 1px solid #1E2230;
      border-radius: 10px;
      padding: 16px;
      font-family: 'Fira Code', monospace;
      font-size: 12px;
      text-align: left;
      margin-bottom: 24px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .stat-row:last-child { border-bottom: none; }
    .label { color: #6B7280; }
    .val { color: #F3F4F6; font-weight: 600; }
    .val.green { color: #10B981; }
    .val.cyan { color: #38BDF8; }
    .back-btn {
      display: inline-block;
      text-decoration: none;
      background: #1E2230;
      color: #F3F4F6;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .back-btn:hover {
      background: #38BDF8;
      color: #090A0F;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="pulse-ring">
      <div class="pulse-dot"></div>
    </div>
    <h1>STATUS: <span class="pong">PONG</span></h1>
    <p><span class="domain">rmaa.pk</span> is awake &amp; spinning cleanly.</p>
    
    <div class="stats-box">
      <div class="stat-row">
        <span class="label">STATUS:</span>
        <span class="val green">200 OK • ALIVE</span>
      </div>
      <div class="stat-row">
        <span class="label">UPTIME:</span>
        <span class="val cyan">${uptimeFormatted}</span>
      </div>
      <div class="stat-row">
        <span class="label">ARTICLES:</span>
        <span class="val">${blogs.length} Published</span>
      </div>
      <div class="stat-row">
        <span class="label">TARGET:</span>
        <span class="val">rmaa.pk</span>
      </div>
      <div class="stat-row">
        <span class="label">FOUNDER:</span>
        <span class="val">Muhammad Ali</span>
      </div>
      <div class="stat-row">
        <span class="label">SERVER TIME:</span>
        <span class="val">${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
      </div>
    </div>

    <a href="/" class="back-btn">← Return to rmaa.pk</a>
  </div>
</body>
</html>`);
  }

  // Pure JSON response for automated cronbots / monitors
  res.status(200).json({
    status: 'alive',
    message: 'pong',
    domain: 'rmaa.pk',
    founder: 'Muhammad Ali (Raja Muhammad Ali Asghar)',
    uptimeSeconds,
    uptimeFormatted,
    blogsCount: blogs.length,
    timestamp: new Date().toISOString(),
  });
});

// JSON API: List all blogs
app.get('/api/blogs', (req, res) => {
  res.status(200).json(blogs);
});

// JSON API: Get single blog by slug
app.get('/api/blogs/:slug', (req, res) => {
  const post = blogs.find((b) => b.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.status(200).json(post);
});

// Trigger Instant Google Sitemap Ping
function pingGoogle(sitemapUrl) {
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  fetch(pingUrl)
    .then((r) => console.log(`[Google Ping] Dispatched ping to Google. Status: ${r.status}`))
    .catch((err) => console.log(`[Google Ping] Network notice: ${err.message}`));
}

app.all('/api/ping-google', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  pingGoogle(sitemapUrl);
  res.status(200).json({
    status: 'dispatched',
    sitemap: sitemapUrl,
    message: 'Google sitemap ping dispatched successfully.',
    articlesIndexed: blogs.length,
  });
});

// Dynamic sitemap.xml indexing all 50+ blog articles
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  let urlEntries = `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

  for (const post of blogs) {
    urlEntries += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// RSS 2.0 / Atom Feed for Google News & Aggregators
app.get(['/rss.xml', '/feed.xml'], (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  let items = '';

  for (const post of blogs) {
    items += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category><![CDATA[${post.category}]]></category>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>say@rmaa.pk (Muhammad Ali)</author>
    </item>`;
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Muhammad Ali — Systems, CNC Machining &amp; Acoustic AI</title>
    <link>${baseUrl}/blog</link>
    <description>Technical essays, CNC machining physics, acoustic tool breakage AI, kernel sentinels, and founder philosophy by Muhammad Ali (Raja Muhammad Ali Asghar).</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo_final.svg</url>
      <title>Muhammad Ali</title>
      <link>${baseUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  res.header('Content-Type', 'application/xml');
  res.send(rss);
});

// robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`);
});

// Server-Side Rendered SEO injection for /blog/:slug
app.get('/blog/:slug', (req, res, next) => {
  const post = blogs.find((b) => b.slug === req.params.slug);
  const indexPath = path.join(__dirname, 'dist', 'index.html');

  if (!post || !fs.existsSync(indexPath)) {
    return next();
  }

  const baseUrl = req.protocol + '://' + req.get('host');
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Inject dynamic SEO meta tags
  const dynamicTitle = `${post.title} — Muhammad Ali`;
  const dynamicDesc = post.description.replace(/"/g, '&quot;');

  // Schema.org BlogPosting JSON-LD
  const schemaJsonLd = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${postUrl}"
    },
    "headline": "${post.title.replace(/"/g, '\\"')}",
    "description": "${post.description.replace(/"/g, '\\"')}",
    "keywords": "${post.keywords}",
    "articleSection": "${post.category}",
    "author": {
      "@type": "Person",
      "name": "Muhammad Ali",
      "alternateName": "Raja Muhammad Ali Asghar",
      "url": "https://rmaa.pk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ali CNC",
      "url": "https://alicnc.pk"
    },
    "datePublished": "${post.publishedAt}",
    "dateModified": "${post.publishedAt}"
  }
  </script>`;

  html = html.replace(/<title>.*?<\/title>/, `<title>${dynamicTitle}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${dynamicTitle}" />`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${dynamicDesc}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${dynamicTitle}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${dynamicDesc}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${postUrl}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${postUrl}" />`);
  html = html.replace('</head>', `${schemaJsonLd}\n</head>`);

  // Pre-render content inside noscript/article for Googlebot crawling
  const noscriptContent = `
  <noscript>
    <article style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: sans-serif; color: #F3F4F6; background: #090A0F;">
      <p><a href="/blog" style="color: #38BDF8;">← Back to All Articles</a></p>
      <h1 style="color: #38BDF8;">${post.title}</h1>
      <p style="color: #9CA3AF;">Category: ${post.category} • Published: ${post.publishedAt} • By Muhammad Ali</p>
      <div style="line-height: 1.7; white-space: pre-wrap;">${post.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </article>
  </noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${noscriptContent}`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

// Static assets from Vite build
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
  })
);

// Fallback to index.html for single-page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================================================
// AUTONOMOUS RENDER FREE-TIER KEEP-ALIVE SENTINEL (Pings every 10 minutes)
// ============================================================================
function startKeepAliveSentinel() {
  const PING_INTERVAL_MS = 10 * 60 * 1000; // Exactly 10 minutes (prevents 15m idle sleep)
  const targetHost = process.env.RENDER_EXTERNAL_URL || 'https://rmaa.pk';

  console.log(`[Keep-Alive Sentinel] Initialized for Render Free Tier Web Service.`);
  console.log(`[Keep-Alive Sentinel] Automated self-ping armed: ${targetHost}/ping every 10 minutes.`);

  const executeHeartbeat = () => {
    const url = `${targetHost}/ping`;
    const client = url.startsWith('https') ? require('https') : require('http');

    client.get(url, (res) => {
      console.log(`[Keep-Alive Sentinel] Autonomous ping successful: ${url} (HTTP ${res.statusCode}) at ${new Date().toISOString()}`);
    }).on('error', (err) => {
      console.warn(`[Keep-Alive Sentinel] External self-ping warning: ${err.message}. Triggering local fallback...`);
      require('http').get(`http://127.0.0.1:${PORT}/healthz`, (localRes) => {
        console.log(`[Keep-Alive Sentinel] Local fallback ping healthy: HTTP ${localRes.statusCode}`);
      }).on('error', () => {});
    });
  };

  // First ping 30s after startup, then every 10 minutes continuously
  setTimeout(executeHeartbeat, 30 * 1000);
  setInterval(executeHeartbeat, PING_INTERVAL_MS);
}

app.listen(PORT, HOST, () => {
  console.log(`[Ali CNC] Personal Web Service running on http://${HOST}:${PORT}`);
  console.log(`[Ali CNC] Ready for Render Web Services health checks at /healthz`);
  console.log(`[Ali CNC] Blog engine active: ${blogs.length} articles indexed at /sitemap.xml and /rss.xml`);

  // Automated Google Sitemap Ping on boot
  const sitemapUrl = 'https://rmaa.pk/sitemap.xml';
  pingGoogle(sitemapUrl);

  // Launch the autonomous 10-minute Render self-ping keep-alive
  startKeepAliveSentinel();
  
  // ==========================================
// AI ASSISTANT EDGE API (Replicate + Supabase)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN ;
    const response = await fetch('https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions', {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + REPLICATE_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          prompt: 'You are Muhammad Ali proxy. Professional. User: ' + message + '\nAI:',
          max_new_tokens: 150
        }
      })
    });
    
    const replicateData = await response.json();
    
    const SUPABASE_URL = process.env.SUPABASE_URL ;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ;
    if (SUPABASE_URL && SUPABASE_KEY) {
      await fetch(SUPABASE_URL + '/rest/v1/ai_chat_logs', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_message: message, timestamp: new Date().toISOString() })
      }).catch(e => console.error('[Supabase Log Error]', e));
    }

    res.json({ status: 'pending', id: replicateData.id });
  } catch (error) {
    console.error('[AI Chat Error]', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/chat/:id', async (req, res) => {
  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN ;
    const response = await fetch('https://api.replicate.com/v1/predictions/' + req.params.id, {
      headers: { 'Authorization': 'Token ' + REPLICATE_API_TOKEN }
    });
    const data = await response.json();
    if (data.status === 'succeeded') {
      res.json({ reply: data.output.join('') });
    } else if (data.status === 'failed') {
      res.status(500).json({ error: 'AI generation failed' });
    } else {
      res.json({ status: data.status });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to poll AI' });
  }
});

// Launch the Private AI service from the Private folder
  startPrivateAI();
});

function startPrivateAI() {
  const { spawn } = require('child_process');
  const botPath = path.join(__dirname, '..', 'Private', 'whatsapp-bot', 'bot.js');
  
  if (fs.existsSync(botPath)) {
    console.log('[Private AI] Starting Private AI from: ' + botPath);
    const botProcess = spawn('node', [botPath], {
      cwd: path.join(__dirname, '..', 'Private', 'whatsapp-bot'),
      stdio: 'inherit',
      env: process.env // Pass Render environment variables down to the bot
    });

    botProcess.on('close', (code) => {
      console.log('[Private AI] Process exited with code ' + code);
      // Restart if it crashes? Render will restart the whole container anyway if we exit, but let's just log it.
    });
  } else {
    console.warn('[Private AI] Could not find bot.js at ' + botPath + '. Skipping Private AI boot.');
  }
}









