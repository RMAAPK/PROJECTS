package pk.alicnc.ceo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * MemoryFabric: Offline Executive Knowledge Base & Multi-Token Relevance Scoring Engine
 * Houses 25 rich dossier nodes spanning Ali's identity, Sector F-11 workshop, machinery,
 * Forge AI acoustics, trademarks, and cultural anchors.
 */
public class MemoryFabric {

    public static class MemoryNode {
        public final String sneakKey;
        public final String category;
        public final String title;
        public final String content;

        public MemoryNode(String sneakKey, String category, String title, String content) {
            this.sneakKey = sneakKey;
            this.category = category;
            this.title = title;
            this.content = content;
        }
    }

    private static class ScoredNode {
        final MemoryNode node;
        final int score;

        ScoredNode(MemoryNode node, int score) {
            this.node = node;
            this.score = score;
        }
    }

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
        "what", "who", "where", "when", "why", "how", "is", "are", "was", "were",
        "am", "the", "a", "an", "and", "or", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "do", "does", "did", "my", "your", "his",
        "her", "their", "our", "me", "you", "him", "them", "us", "i", "it",
        "its", "tell", "about", "can", "could", "would", "should", "will",
        "detail", "summarize", "show", "give", "please", "run", "have", "has",
        "had", "take", "takes", "much", "many", "be", "been", "being"
    ));

    private static final List<MemoryNode> NODES = new ArrayList<>();

    static {
        // 1. Identity & Demographics
        NODES.add(new MemoryNode("ALI_IDENTITY", "identity", "Primary Identity & Demographics",
            "Raja Muhammad Ali Asghar, operating professionally as Ali CNC / Muhammad Ali. Born Dec 24, 2003 (Age 22 as of 2026), Rawalpindi & Sector F-11 Islamabad. INTJ (Estimated IQ 150+). Solo Founder & CEO of Ali CNC (alicnc.pk, forge.alicnc.pk), 2D/3D CAD/CAM Designer, 3-Axis CNC Router Operator & Programmer, Additive Manufacturing Specialist. Coding since age 4, hardware assembly since age 7, professional CNC designing on Sep 7, 2025. Dual certified in CAD/CAM (TITANS of CNC Academy TITAN-2M, TITAN-3M Credential), PSEB Registered."));

        // 2. Workshop Mentorship & Boss
        NODES.add(new MemoryNode("IFTIKHAR_MENTOR_BOSS", "workshop", "Workshop Mentor & Boss: Iftikhar Bhai",
            "Iftikhar Bhai is Ali's workshop mentor and boss in Sector F-11 Islamabad. Senior woodworking and precision routing craftsman, authority in machine tooling, tolerances, and workshop discipline. Revered father figure."));

        // 3. Father
        NODES.add(new MemoryNode("GHULAM_ASGHAR_FATHER", "workshop", "Father: Raja Ghulam Asghar Abbasi",
            "Ghulam Asghar (Raja Ghulam Asghar Abbasi) is Ali's father. Prominent local leader; served as President (Saddar) of Tajran (Traders Association) in Pindora, Rawalpindi."));

        // 4. Family Dog & Caretaker
        NODES.add(new MemoryNode("HASEEB_FARGO_DOG", "workshop", "Cousin HaseEB & Fargo the German Shepherd",
            "Haseeb is Ali's close cousin in Rawalpindi and primary caretaker of Fargo, the family German Shepherd dog. Fargo is tracked and cared for daily."));

        // 5. Sector F-11 Workshop Crew
        NODES.add(new MemoryNode("WORKSHOP_CREW_F11", "workshop", "Sector F-11 Workshop Crew",
            "Daily operating crew in Sector F-11 CNC workshop: Muneeb, Usama, Merab, and Chacha. Team includes machine operators, trainees, associates, and senior shop coworkers. Historical workshops consolidated: Welcome Edge Cutting and Umer Al Khairy CNC under Ali CNC."));

        // 6. Industrial CNC Router
        NODES.add(new MemoryNode("MINGDA_1325_CNC", "hardware", "Hefei Mingda 1325 3-Axis Industrial Router",
            "Hefei Mingda 1325 (3-Axis Industrial Wood Router) driven via NcStudio. Media: MDF, Lasani, HDF, HDX, super-gloss acrylic, laminate, solid Sheesham, Oak, commercial laminates. Tooling: Flat end mills, V-carve (60, 90 deg), 6mm ball nose bits for 3D relief climb finishing."));

        // 7. Motion Controller Hardware & Software
        NODES.add(new MemoryNode("NCSTUDIO_PCIMC_CONTROLLER", "hardware", "Weihong PCIMC-3D Motion Controller & NcStudio",
            "Weihong PCIMC-3D PCI Motion Control Interface card (DB15 J1 connector, WCH CH365 PCI chip) running NcStudio v5.56 / v8 control software for Mingda 1325 CNC."));

        // 8. Spindle Specs & Cooling
        NODES.add(new MemoryNode("SPINDLE_SPECS_COOLING", "hardware", "Water-Cooled Spindle Specs & Cooling",
            "3.2 kW / 5.5 kW Water-Cooled Spindle, operating from 6,000 to 24,000 RPM with dedicated closed-loop water circulation cooling."));

        // 9. 3D Printing
        NODES.add(new MemoryNode("BAMBU_A1_PRINTER", "hardware", "Bambu Lab A1 3D Printer",
            "Bambu Lab A1 3D Printer running Bambu Studio for slicer optimization, multi-color prototypes, custom jigs, and rapid fabrication."));

        // 10. Wireless Pendant
        NODES.add(new MemoryNode("ESP32_NCSTUDIO_PENDANT", "hardware", "ESP32 Wireless Bluetooth NC Studio Pendant",
            "Engineered custom ESP32 / NodeMCU wireless Bluetooth remote communicating with custom Python Windows background service to control NcStudio wirelessly across the workshop."));

        // 11. Mobile Rig
        NODES.add(new MemoryNode("POCO_C85_TERMUX", "hardware", "POCO C85 HyperOS Automation Rig",
            "Mobile device: POCO C85 running Xiaomi HyperOS with Termux, Shizuku UID 2000, Onshape Mobile, VLC, MPV. Audio setup: KZ Castor Pro Bass Edition IEMs + Conexant CX31993 USB-C DAC dongle."));

        // 12. Forge AI YC Application
        NODES.add(new MemoryNode("FORGE_AI_YC_W27", "projects", "Forge AI - Y Combinator W27 Application",
            "Authored Y Combinator W27 application & pitch for Forge AI: real-time AI tool breakage protection (<30ms reaction) via spindle acoustic telemetry and native Windows defense sentinel (ForgeAI_NcStudio_Defense.exe) injecting Win32 PageDown override messages."));

        // 13. DSP Acoustics & Chatter Formula
        NODES.add(new MemoryNode("DSP_ACOUSTICS_FORMULA", "projects", "Forge AI Acoustic Chatter & Tooth-Pass Formula",
            "Forge AI tooth-pass acoustic formula: f_tp = (RPM * Flutes) / 60. Example: 18,000 RPM * 2 flutes / 60 = 600 Hz fundamental. A 2.4 kHz harmonic spike indicates regenerative chatter."));

        // 14. PageDown Override Mechanism
        NODES.add(new MemoryNode("PAGEDOWN_OVERRIDE_MECHANISM", "projects", "ForgeAI NcStudio Defense PageDown Override",
            "ForgeAI_NcStudio_Defense.exe dispatches Win32 WM_KEYDOWN VK_NEXT (PageDown) in < 5ms to instantly drop feed rate from 100% to 25% or 0% upon acoustic chatter spikes."));

        // 15. Trademark ALI CNC
        NODES.add(new MemoryNode("TRADEMARK_ALI_CNC", "projects", "TM-01 Trademark: ALI CNC",
            "Class 42 trademark application with IPO Pakistan for CAD, 3D modeling, and engineering design services under mark ALI CNC (App No. 890258)."));

        // 16. Trademark AHYEON
        NODES.add(new MemoryNode("TRADEMARK_AHYEON", "projects", "TM-01 Trademark: AHYEON",
            "Class 9 trademark application with IPO Pakistan for digital media, downloads, and software under mark AHYEON (App No. 890259)."));

        // 17. Hexagon Nesting
        NODES.add(new MemoryNode("HEXAGON_NESTING_80", "projects", "80 Hexagon Interlocking Nesting in Vectric Aspire",
            "Zero-waste interlocking nesting algorithm cutting 80 identical interlocking MDF hexagons on a single 4x8 sheet in Vectric Aspire."));

        // 18. SVGV Binary Vector Format
        NODES.add(new MemoryNode("SVGV_BINARY_FORMAT", "projects", "SVGV Binary Vector Format",
            "SVGV binary vector format designed with encoder.js for ultra-compact 2D vector geometry serialization for CNC routing."));

        // 19. K-Pop Biases & Girl Groups
        NODES.add(new MemoryNode("KPOP_BIASES_GROUPS", "interests", "K-Pop Ultimate Biases & Girl Groups",
            "Ultimate Biases: BIBI (Kim Hyung-seo, admired for raw authenticity) and Jung Ahyeon (of BABYMONSTER). Biases: Jennie (2nd), Lisa, Rose, Jisoo. Groups: BABYMONSTER, BLACKPINK, ILLIT, LE SSERAFIM, TWICE, NewJeans, IVE."));

        // 20. Korean Dramas
        NODES.add(new MemoryNode("KDRAMA_500_LOG", "interests", "Korean Dramas (500+ Completed)",
            "Completed 500+ Korean drama series. Favorites: Itaewon Class, Queen Seondeok, The Woman Who Swallowed the Sun. Great admiration for actresses Suzy, Jisoo, and IU."));

        // 21. Motorsports & Gaming
        NODES.add(new MemoryNode("MOTORSPORTS_GAMING", "interests", "Formula 1 & Age of Mythology",
            "Formula 1 Grand Prix racing follower. Custom scenario & map trigger script designer in Age of Mythology."));

        // 22. CAD/CAM Certifications
        NODES.add(new MemoryNode("TITANS_OF_CNC_CERTS", "identity", "TITANS of CNC Academy Certifications",
            "Dual certified in CAD/CAM through TITANS of CNC Academy: TITAN-2M Credential and TITAN-3M Credential. Registered with Pakistan Software Export Board (PSEB)."));

        // 23. Vault Security
        NODES.add(new MemoryNode("VAULT_AES_SECURITY", "security", "Encrypted AES-256 Vault Architecture",
            "EncryptedVault AES-256-GCM hardware-backed keystore protecting API credentials, Supabase JWT tokens, and private CEO logs on POCO C85."));

        // 24. Shizuku System Bridge
        NODES.add(new MemoryNode("SHIZUKU_SYSTEM_BRIDGE", "hardware", "Shizuku UID 2000 System Bridge",
            "Shizuku UID 2000 ADB shell bridge allowing PAI to execute privileged shell diagnostics, inspect system logs, and interface with device telemetry without root."));

        // 25. Workshop Feeds & Speeds
        NODES.add(new MemoryNode("WORKSHOP_MATERIALS_FEEDS", "workshop", "Precision Feeds & Speeds for Workshop Media",
            "Precision feeds and speeds for MDF, Lasani, HDF, HDX, super-gloss acrylic, and hardwoods: 18,000 RPM, 3,500 mm/min feed, 6mm 2-flute carbide endmill, climb milling."));
    }

    /**
     * Search memory fabric using multi-token keyword relevance scoring with stemming and variants.
     */
    public static List<MemoryNode> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String rawClean = query.trim().toLowerCase();
        String upperSneak = rawClean.toUpperCase().replace(" ", "_");

        // Tokenize query into words
        String[] tokens = rawClean.split("[^a-zA-Z0-9_\\-]+");
        List<String> keywords = new ArrayList<>();
        for (String t : tokens) {
            String token = t.trim();
            if (token.length() > 1 && !STOPWORDS.contains(token)) {
                keywords.add(token);
            }
        }

        // If all tokens were filtered, keep non-empty tokens
        if (keywords.isEmpty()) {
            for (String t : tokens) {
                if (t.trim().length() > 1) keywords.add(t.trim());
            }
        }

        List<ScoredNode> scoredList = new ArrayList<>();
        for (MemoryNode node : NODES) {
            int score = 0;
            String sneakLower = node.sneakKey.toLowerCase();
            String titleLower = node.title.toLowerCase();
            String contentLower = node.content.toLowerCase();

            // 1. Direct Sneak Key match
            if (node.sneakKey.equals(upperSneak) || upperSneak.contains(node.sneakKey)) {
                score += 120;
            }

            // 2. Full exact substring match
            if (titleLower.contains(rawClean)) {
                score += 80;
            } else if (contentLower.contains(rawClean)) {
                score += 50;
            }

            // 3. Multi-token scoring with stemming & variants
            for (String kw : keywords) {
                Set<String> variants = new HashSet<>();
                variants.add(kw);
                variants.add(kw.replace("-", ""));
                variants.add(kw.replace("-", "_"));

                if (kw.endsWith("s") && kw.length() > 2) {
                    String stem = kw.substring(0, kw.length() - 1);
                    variants.add(stem);
                    variants.add(stem.replace("-", ""));
                }
                if (kw.contains("-")) {
                    for (String sub : kw.split("-")) {
                        if (sub.length() > 1 && !STOPWORDS.contains(sub)) {
                            variants.add(sub);
                        }
                    }
                }

                for (String v : variants) {
                    if (sneakLower.contains(v)) {
                        score += 35;
                    }
                    if (titleLower.contains(v)) {
                        score += 25;
                    }
                    if (contentLower.contains(v)) {
                        score += 15;
                    }
                }
            }

            if (score > 0) {
                scoredList.add(new ScoredNode(node, score));
            }
        }

        // Sort descending by score
        Collections.sort(scoredList, new Comparator<ScoredNode>() {
            @Override
            public int compare(ScoredNode a, ScoredNode b) {
                return Integer.compare(b.score, a.score);
            }
        });

        List<MemoryNode> results = new ArrayList<>();
        int maxResults = Math.min(scoredList.size(), 4);
        for (int i = 0; i < maxResults; i++) {
            results.add(scoredList.get(i).node);
        }
        return results;
    }

    public static List<MemoryNode> getAll() {
        return NODES;
    }
}
