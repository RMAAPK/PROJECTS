/**
 * Ali CNC Private CEO AI - Memory Fabric API
 * Houses all 25 master dossier nodes with multi-token keyword relevance scoring engine.
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

const DOSSIER_NODES = [
  {
    sneakKey: "ALI_IDENTITY",
    category: "identity",
    title: "Primary Identity & Demographics",
    content: "Raja Muhammad Ali Asghar, operating professionally as Ali CNC / Muhammad Ali. Born Dec 24, 2003 (Age 22 as of 2026), Rawalpindi & Sector F-11 Islamabad. INTJ (Estimated IQ 150+). Solo Founder & CEO of Ali CNC (alicnc.pk, forge.alicnc.pk), 2D/3D CAD/CAM Designer, 3-Axis CNC Router Operator & Programmer, Additive Manufacturing Specialist. Coding since age 4, hardware assembly since age 7, professional CNC designing on Sep 7, 2025. Dual certified in CAD/CAM (TITANS of CNC Academy TITAN-2M, TITAN-3M Credential), PSEB Registered."
  },
  {
    sneakKey: "IFTIKHAR_MENTOR_BOSS",
    category: "workshop",
    title: "Workshop Mentor & Boss: Iftikhar Bhai",
    content: "Iftikhar Bhai is Ali's workshop mentor and boss in Sector F-11 Islamabad. Senior woodworking and precision routing craftsman, authority in machine tooling, tolerances, and workshop discipline. Revered father figure."
  },
  {
    sneakKey: "GHULAM_ASGHAR_FATHER",
    category: "workshop",
    title: "Father: Raja Ghulam Asghar Abbasi",
    content: "Ghulam Asghar (Raja Ghulam Asghar Abbasi) is Ali's father. Prominent local leader; served as President (Saddar) of Tajran (Traders Association) in Pindora, Rawalpindi."
  },
  {
    sneakKey: "HASEEB_FARGO_DOG",
    category: "workshop",
    title: "Cousin Haseeb & Fargo the German Shepherd",
    content: "Haseeb is Ali's close cousin in Rawalpindi and primary caretaker of Fargo, the family German Shepherd dog. Fargo is tracked and cared for daily."
  },
  {
    sneakKey: "WORKSHOP_CREW_F11",
    category: "workshop",
    title: "Sector F-11 Workshop Crew",
    content: "Daily operating crew in Sector F-11 CNC workshop: Muneeb, Usama, Merab, and Chacha. Team includes machine operators, trainees, associates, and senior shop coworkers. Historical workshops consolidated: Welcome Edge Cutting and Umer Al Khairy CNC under Ali CNC."
  },
  {
    sneakKey: "MINGDA_1325_CNC",
    category: "hardware",
    title: "Hefei Mingda 1325 3-Axis Industrial Router",
    content: "Hefei Mingda 1325 (3-Axis Industrial Wood Router) driven via NcStudio. Media: MDF, Lasani, HDF, HDX, super-gloss acrylic, laminate, solid Sheesham, Oak, commercial laminates. Tooling: Flat end mills, V-carve (60, 90 deg), 6mm ball nose bits for 3D relief climb finishing."
  },
  {
    sneakKey: "NCSTUDIO_PCIMC_CONTROLLER",
    category: "hardware",
    title: "Weihong PCIMC-3D Motion Controller & NcStudio",
    content: "Weihong PCIMC-3D PCI Motion Control Interface card (DB15 J1 connector, WCH CH365 PCI chip) running NcStudio v5.56 / v8 control software for Mingda 1325 CNC."
  },
  {
    sneakKey: "SPINDLE_SPECS_COOLING",
    category: "hardware",
    title: "Water-Cooled Spindle Specs & Cooling",
    content: "3.2 kW / 5.5 kW Water-Cooled Spindle, operating from 6,000 to 24,000 RPM with dedicated closed-loop water circulation cooling."
  },
  {
    sneakKey: "BAMBU_A1_PRINTER",
    category: "hardware",
    title: "Bambu Lab A1 3D Printer",
    content: "Bambu Lab A1 3D Printer running Bambu Studio for slicer optimization, multi-color prototypes, custom jigs, and rapid fabrication."
  },
  {
    sneakKey: "ESP32_NCSTUDIO_PENDANT",
    category: "hardware",
    title: "ESP32 Wireless Bluetooth NC Studio Pendant",
    content: "Engineered custom ESP32 / NodeMCU wireless Bluetooth remote communicating with custom Python Windows background service to control NcStudio wirelessly across the workshop."
  },
  {
    sneakKey: "POCO_C85_TERMUX",
    category: "hardware",
    title: "POCO C85 HyperOS Automation Rig",
    content: "Mobile device: POCO C85 running Xiaomi HyperOS with Termux, Shizuku UID 2000, Onshape Mobile, VLC, MPV. Audio setup: KZ Castor Pro Bass Edition IEMs + Conexant CX31993 USB-C DAC dongle."
  },
  {
    sneakKey: "FORGE_AI_YC_W27",
    category: "projects",
    title: "Forge AI - Y Combinator W27 Application",
    content: "Authored Y Combinator W27 application & pitch for Forge AI: real-time AI tool breakage protection (<30ms reaction) via spindle acoustic telemetry and native Windows defense sentinel (ForgeAI_NcStudio_Defense.exe) injecting Win32 PageDown override messages."
  },
  {
    sneakKey: "DSP_ACOUSTICS_FORMULA",
    category: "projects",
    title: "Forge AI Acoustic Chatter & Tooth-Pass Formula",
    content: "Forge AI tooth-pass acoustic formula: f_tp = (RPM * Flutes) / 60. Example: 18,000 RPM * 2 flutes / 60 = 600 Hz fundamental. A 2.4 kHz harmonic spike indicates regenerative chatter."
  },
  {
    sneakKey: "PAGEDOWN_OVERRIDE_MECHANISM",
    category: "projects",
    title: "ForgeAI NcStudio Defense PageDown Override",
    content: "ForgeAI_NcStudio_Defense.exe dispatches Win32 WM_KEYDOWN VK_NEXT (PageDown) in < 5ms to instantly drop feed rate from 100% to 25% or 0% upon acoustic chatter spikes."
  },
  {
    sneakKey: "TRADEMARK_ALI_CNC",
    category: "projects",
    title: "TM-01 Trademark: ALI CNC",
    content: "Class 42 trademark application with IPO Pakistan for CAD, 3D modeling, and engineering design services under mark ALI CNC (App No. 890258)."
  },
  {
    sneakKey: "TRADEMARK_AHYEON",
    category: "projects",
    title: "TM-01 Trademark: AHYEON",
    content: "Class 9 trademark application with IPO Pakistan for digital media, downloads, and software under mark AHYEON (App No. 890259)."
  },
  {
    sneakKey: "HEXAGON_NESTING_80",
    category: "projects",
    title: "80 Hexagon Interlocking Nesting in Vectric Aspire",
    content: "Zero-waste interlocking nesting algorithm cutting 80 identical interlocking MDF hexagons on a single 4x8 sheet in Vectric Aspire."
  },
  {
    sneakKey: "SVGV_BINARY_FORMAT",
    category: "projects",
    title: "SVGV Binary Vector Format",
    content: "SVGV binary vector format designed with encoder.js for ultra-compact 2D vector geometry serialization for CNC routing."
  },
  {
    sneakKey: "KPOP_BIASES_GROUPS",
    category: "interests",
    title: "K-Pop Ultimate Biases & Girl Groups",
    content: "Ultimate Biases: BIBI (Kim Hyung-seo, admired for raw authenticity) and Jung Ahyeon (of BABYMONSTER). Biases: Jennie (2nd), Lisa, Rose, Jisoo. Groups: BABYMONSTER, BLACKPINK, ILLIT, LE SSERAFIM, TWICE, NewJeans, IVE."
  },
  {
    sneakKey: "KDRAMA_500_LOG",
    category: "interests",
    title: "Korean Dramas (500+ Completed)",
    content: "Completed 500+ Korean drama series. Favorites: Itaewon Class, Queen Seondeok, The Woman Who Swallowed the Sun. Great admiration for actresses Suzy, Jisoo, and IU."
  },
  {
    sneakKey: "MOTORSPORTS_GAMING",
    category: "interests",
    title: "Formula 1 & Age of Mythology",
    content: "Formula 1 Grand Prix racing follower. Custom scenario & map trigger script designer in Age of Mythology."
  },
  {
    sneakKey: "TITANS_OF_CNC_CERTS",
    category: "identity",
    title: "TITANS of CNC Academy Certifications",
    content: "Dual certified in CAD/CAM through TITANS of CNC Academy: TITAN-2M Credential and TITAN-3M Credential. Registered with Pakistan Software Export Board (PSEB)."
  },
  {
    sneakKey: "VAULT_AES_SECURITY",
    category: "security",
    title: "Encrypted AES-256 Vault Architecture",
    content: "EncryptedVault AES-256-GCM hardware-backed keystore protecting API credentials, Supabase JWT tokens, and private CEO logs on POCO C85."
  },
  {
    sneakKey: "SHIZUKU_SYSTEM_BRIDGE",
    category: "hardware",
    title: "Shizuku UID 2000 System Bridge",
    content: "Shizuku UID 2000 ADB shell bridge allowing PAI to execute privileged shell diagnostics, inspect system logs, and interface with device telemetry without root."
  },
  {
    sneakKey: "WORKSHOP_MATERIALS_FEEDS",
    category: "workshop",
    title: "Precision Feeds & Speeds for Workshop Media",
    content: "Precision feeds and speeds for MDF, Lasani, HDF, HDX, super-gloss acrylic, and hardwoods: 18,000 RPM, 3,500 mm/min feed, 6mm 2-flute carbide endmill, climb milling."
  }
];

function searchMemoryFabric(query, maxResults = 4) {
  if (!query || !query.trim()) return [];
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
  for (const node of DOSSIER_NODES) {
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
  DOSSIER_NODES,
  searchMemoryFabric
};
