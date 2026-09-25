import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

export const EngineeringSection: React.FC = () => {
  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const projects = [
    {
      title: 'Ali CNC Forge AI',
      repo: 'alicncltd/ForgeAI',
      url: 'https://forge.alicnc.pk',
      badge: 'Live Production',
      badgeColor: theme.colors.emerald,
      desc: 'Real-time acoustic AI tool breakage prevention & chatter suppression for CNC spindles. Intercepts non-harmonic chatter in < 30ms and triggers feed overrides before carbide tools fracture.',
      highlights: [
        'Standalone 17 KB Win32 C# Sentinel (ForgeAI_NcStudio_Defense.exe) hooking NcStudio.exe in < 5ms',
        'Tooth-pass frequency DSP filter isolating 600 Hz fundamental from 2.4 kHz chatter spikes',
        'Reverse-engineered Weihong PCIMC-3D (WCH CH365 PCI bus & whnc3d.sys driver)',
        'Connected to Supabase cluster (slwehnfipdsnpmgycuwx.supabase.co) with Kienzle force models',
      ],
      actions: [
        { label: 'Live App (forge.alicnc.pk)', url: 'https://forge.alicnc.pk' },
        { label: 'Download Sentinel (/nc)', url: 'https://forge.alicnc.pk/nc' },
        { label: 'GitHub Repository', url: 'https://github.com/alicncltd/ForgeAI' },
      ],
    },
    {
      title: 'Ali CNC Enterprise CAD/CAM Platform',
      repo: 'thealidev/alicnc',
      url: 'https://alicnc.pk',
      badge: 'Production Factory',
      badgeColor: theme.colors.cyan,
      desc: 'High-precision virtual CAD/CAM file factory and automated workshop suite engineered by Muhammad Ali. 177 files, 27,642 lines of code across Next.js 16, TypeScript, and Python Oracle AI.',
      highlights: [
        'Multi-lingual route-level internationalization: Global English, Korean, Turkish, and Japanese',
        'Digital Tools Suite: EchoDesk AI Voice, Oracle Quant Engine, and Collaborative Sketchboard',
        'Zero-waste sheet nesting algorithms reducing hardwood/MDF scrap by 15% - 30%',
        'Commercial digital blueprint distribution via Gumroad (alicnc.gumroad.com)',
      ],
      actions: [
        { label: 'Official Website (alicnc.pk)', url: 'https://alicnc.pk' },
        { label: 'Crunchbase Profile', url: 'https://www.crunchbase.com/organization/ali-cnc-pakistan' },
        { label: 'CadCrowd Portfolio', url: 'https://www.cadcrowd.com/profile/212733-thealidev' },
      ],
    },
    {
      title: 'Ali CNC Private CEO AI (PAI v3.0.0)',
      repo: 'pk.alicnc.ceo',
      url: 'https://github.com/alicncltd',
      badge: 'Native Android 16 APK',
      badgeColor: theme.colors.violet,
      desc: 'Private executive mobile copilot engineered for POCO C85 (Xiaomi HyperOS). Reverse-engineered Gemini Material 3 OLED Dark UI with zero-root Shizuku shell bridge and hardware AES-256 vault.',
      highlights: [
        'Dual-layer soft keyboard WindowInsets API 30+ math (zero blind area above soft input)',
        'In-memory MemoryFabric multi-token stemming search across 25 master profile nodes',
        'Zero external training flags and 100% silent haptic mode (zero spoken audio in workshop)',
        'Rootless UID 2000 execution via Shizuku Bridge and permanent PKCS12 release keystore',
      ],
      actions: [
        { label: 'Inspect Architecture', url: 'https://github.com/thealidev' },
      ],
    },
    {
      title: 'Trace It AI',
      repo: 'C:\\Ali CNC\\Trace It AI',
      url: 'https://github.com/thealidev',
      badge: 'FastAPI + Gemini',
      badgeColor: theme.colors.amber,
      desc: 'AI-assisted CAD vector synthesizer interfacing with Google Gemini 2.5/3.0 Flash to convert raw hand sketches and raster graphics into mathematical toolpaths.',
      highlights: [
        'Multi-target parametric script generator: Vectric Aspire Lua and Onshape FeatureScript',
        'SQLite credit ledger with BEGIN IMMEDIATE atomic transaction concurrency',
        'Self-healing regex and JSON fence parser with geometric intersection segregation',
      ],
      actions: [
        { label: 'Explore Source', url: 'https://github.com/thealidev' },
      ],
    },
  ];

  return (
    <View style={styles.sectionWrapper} id="engineering">
      <View style={styles.container}>
        {/* Section Heading */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>🛠️ PRODUCTION CODE &amp; ARCHITECTURAL ARSENAL</Text>
          <Text style={styles.sectionTitle}>
            Built on Real Iron, Shipped with <Text style={styles.highlight}>Zero Reverts</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            These are not superficial toy demos. Every repository and binary was engineered to solve
            tactile workshop problems and withstand 24/7 manufacturing operations.
          </Text>
        </View>

        {/* Projects Cards List */}
        <View style={styles.projectsGrid}>
          {projects.map((proj, idx) => (
            <View key={idx} style={styles.projectCard}>
              {/* Card Top Row */}
              <View style={styles.cardTop}>
                <View style={styles.titleGroup}>
                  <Text style={styles.projectTitle}>{proj.title}</Text>
                  <Text style={styles.repoTag}>{proj.repo}</Text>
                </View>

                <View style={[styles.statusBadge, { borderColor: proj.badgeColor }]}>
                  <Text style={[styles.statusBadgeText, { color: proj.badgeColor }]}>
                    {proj.badge}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.projectDesc}>{proj.desc}</Text>

              {/* Technical Highlights */}
              <View style={styles.highlightsBox}>
                <Text style={styles.highlightsHeader}>ARCHITECTURAL HIGHLIGHTS:</Text>
                {proj.highlights.map((h, hIdx) => (
                  <View key={hIdx} style={styles.highlightBullet}>
                    <Text style={styles.bulletDot}>▸</Text>
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                {proj.actions.map((act, actIdx) => (
                  <Pressable
                    key={actIdx}
                    onPress={() => openUrl(act.url)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>{act.label} ↗</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Credentials & Registrations Bar */}
        <View style={styles.credsContainer}>
          <View style={styles.credItem}>
            <Text style={styles.credIcon}>🏆</Text>
            <View>
              <Text style={styles.credTitle}>TITANS of CNC Dual Certified</Text>
              <Text style={styles.credSubtitle}>TITAN-2M &amp; TITAN-3M Precision Machining</Text>
            </View>
          </View>

          <View style={styles.credItem}>
            <Text style={styles.credIcon}>🇵🇰</Text>
            <View>
              <Text style={styles.credTitle}>PSEB Registered Founder</Text>
              <Text style={styles.credSubtitle}>Pakistan Software Export Board Recognized</Text>
            </View>
          </View>

          <View style={styles.credItem}>
            <Text style={styles.credIcon}>📜</Text>
            <View>
              <Text style={styles.credTitle}>Registered Trademarks (IPO)</Text>
              <Text style={styles.credSubtitle}><Text style={{fontWeight: '900', color: theme.colors.emerald}}>ALI CNC (TM01) - OFFICIAL BRAND</Text> (IPO App: 890258) | FBR Registered</Text>
            </View>
          </View>

          <View style={styles.credItem}>
            <Text style={styles.credIcon}>🌐</Text>
            <View>
              <Text style={styles.credTitle}>Web3 Developer Grant</Text>
              <Text style={styles.credSubtitle}>WalletConnect 30,000 PKR Grant Winner</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
  container: {
    maxWidth: 1040,
    width: '100%',
    marginHorizontal: 'auto' as any,
  },
  headerArea: {
    alignItems: 'center',
    textAlign: 'center' as any,
    marginBottom: 44,
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 14,
  },
  highlight: {
    color: theme.colors.cyan,
  },
  sectionDesc: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    maxWidth: 720,
    lineHeight: 24,
  },
  projectsGrid: {
    gap: 24,
    marginBottom: 36,
  },
  projectCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 24,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
    minWidth: 260,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  repoTag: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  projectDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  highlightsBox: {
    backgroundColor: 'rgba(9, 10, 15, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.radii.md,
    padding: 14,
    marginBottom: 18,
  },
  highlightsHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  highlightBullet: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bulletDot: {
    color: theme.colors.cyan,
    fontSize: 12,
    fontWeight: '700',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 19,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.sm,
    cursor: 'pointer' as any,
  },
  actionButtonText: {
    color: theme.colors.cyan,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  credsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
  credItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 220,
  },
  credIcon: {
    fontSize: 24,
  },
  credTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  credSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});


