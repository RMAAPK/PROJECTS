import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const PersonalLifeSection: React.FC = () => {
  return (
    <View style={styles.sectionWrapper} id="culture">
      <View style={styles.container}>
        {/* Section Heading */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>🎧 PASSIONS, TASTE &amp; OFF-DUTY OBSESSIONS</Text>
          <Text style={styles.sectionTitle}>
            Beyond the Spindle: <Text style={styles.highlight}>Music, Dramas &amp; Code</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            Great engineering doesn't happen in an emotional vacuum. Here is the cultural fuel that
            powers late-night firmware compiles and high-feed roughing passes.
          </Text>
        </View>

        {/* Culture Cards Grid */}
        <View style={styles.cultureGrid}>
          {/* Card 1: Music & Ultimate Biases */}
          <View style={styles.cultureCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🎤</Text>
              <View style={[styles.badge, { borderColor: theme.colors.rose }]}>
                <Text style={[styles.badgeText, { color: theme.colors.rose }]}>Soundtrack</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>The Heavy-Rotation Soundscape</Text>
            <Text style={styles.cardText}>
              Machining requires relentless focus. When cutting titanium or drafting intricate 3D
              reliefs, my playlist is dominated by unfiltered authenticity and high-voltage energy.
            </Text>

            <View style={styles.tagGroup}>
              <View style={styles.biasPillPrimary}>
                <Text style={styles.biasTextPrimary}>👑 BIBI (Kim Hyung-seo)</Text>
              </View>
              <View style={styles.biasPillPrimary}>
                <Text style={styles.biasTextPrimary}>✨ Jung Ahyeon (BABYMONSTER)</Text>
              </View>
              <View style={styles.biasPillSecondary}>
                <Text style={styles.biasTextSecondary}>Jennie • Lisa • Rosé • Jisoo</Text>
              </View>
              <View style={styles.biasPillSecondary}>
                <Text style={styles.biasTextSecondary}>BABYMONSTER • ILLIT • LE SSERAFIM</Text>
              </View>
            </View>

            <View style={styles.audioGearBox}>
              <Text style={styles.audioGearTitle}>AUDIO ARSENAL:</Text>
              <Text style={styles.audioGearText}>
                KZ Castor Pro Bass Edition IEMs paired with a Conexant CX31993 USB-C Hi-Res DAC
                dongle for sub-bass punch and acoustic isolation from CNC stepper noise.
              </Text>
            </View>
          </View>

          {/* Card 2: 500+ K-Dramas */}
          <View style={styles.cultureCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📺</Text>
              <View style={[styles.badge, { borderColor: theme.colors.violet }]}>
                <Text style={[styles.badgeText, { color: theme.colors.violet }]}>500+ Series</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>The 500+ K-Drama Master Log</Text>
            <Text style={styles.cardText}>
              A certified marathoner with over 500 completed Korean drama series. Drawn to raw grit,
              underdog vengeance, historical court intrigue, and intricate plot architecture.
            </Text>

            <View style={styles.dramaList}>
              <View style={styles.dramaItem}>
                <Text style={styles.dramaBullet}>★</Text>
                <View>
                  <Text style={styles.dramaName}>Itaewon Class</Text>
                  <Text style={styles.dramaSub}>The ultimate masterclass in unwavering founder persistence.</Text>
                </View>
              </View>

              <View style={styles.dramaItem}>
                <Text style={styles.dramaBullet}>★</Text>
                <View>
                  <Text style={styles.dramaName}>Queen Seondeok</Text>
                  <Text style={styles.dramaSub}>Uncompromising political chess, strategy, and leadership.</Text>
                </View>
              </View>

              <View style={styles.dramaItem}>
                <Text style={styles.dramaBullet}>★</Text>
                <View>
                  <Text style={styles.dramaName}>The Woman Who Swallowed the Sun</Text>
                  <Text style={styles.dramaSub}>Deep narrative tenacity and resilience against all odds.</Text>
                </View>
              </View>
            </View>

            <View style={styles.actressPillRow}>
              <Text style={styles.actressPillLabel}>Admired Talent:</Text>
              <Text style={styles.actressPill}>Bae Suzy</Text>
              <Text style={styles.actressPill}>IU</Text>
              <Text style={styles.actressPill}>Kim Ji-soo</Text>
            </View>
          </View>

          {/* Card 3: Strategy & Motorsports */}
          <View style={styles.cultureCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🏎️</Text>
              <View style={[styles.badge, { borderColor: theme.colors.amber }]}>
                <Text style={[styles.badgeText, { color: theme.colors.amber }]}>Telemetry &amp; Tactics</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Formula 1 &amp; Strategic Simulation</Text>
            <Text style={styles.cardText}>
              Fascinated by aerodynamics, tire degradation curves, and millisecond pit decisions in
              Formula 1 Grand Prix racing. Precision telemetry in motorsports mirrors high-feed CNC
              milling.
            </Text>

            <View style={styles.bulletBox}>
              <Text style={styles.bulletItem}>
                <Text style={styles.bulletTitle}>Age of Mythology:</Text> Architecting custom scenarios,
                multi-faction campaign maps, and complex trigger scripting since early youth.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bulletTitle}>Hitman Stealth Series:</Text> Methodical stealth,
                silent execution, and zero-trace sandbox problem solving.
              </Text>
            </View>
          </View>

          {/* Card 4: Companion & Family */}
          <View style={styles.cultureCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🐺</Text>
              <View style={[styles.badge, { borderColor: theme.colors.emerald }]}>
                <Text style={[styles.badgeText, { color: theme.colors.emerald }]}>Loyalty</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Fargo the German Shepherd</Text>
            <Text style={styles.cardText}>
              In Rawalpindi, loyalty is non-negotiable. Fargo is our family German Shepherd—watched
              over daily by my close cousin Haseeb and me. Whether guarding the compound or greeting
              us after a 16-hour shop stretch, he keeps us grounded.
            </Text>

            <View style={styles.loyaltyQuote}>
              <Text style={styles.loyaltyQuoteText}>
                "The shop may be high-tech, but our roots remain pure grit, family brotherhood, and
                unconditional loyalty."
              </Text>
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
    backgroundColor: '#0B0D14',
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
    color: theme.colors.violet,
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
    color: theme.colors.violet,
  },
  sectionDesc: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    maxWidth: 720,
    lineHeight: 24,
  },
  cultureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  cultureCard: {
    width: '48.5%' as any,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 26,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  biasPillPrimary: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  biasTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.rose,
  },
  biasPillSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  biasTextSecondary: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  audioGearBox: {
    backgroundColor: 'rgba(9, 10, 15, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.radii.md,
    padding: 12,
  },
  audioGearTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    marginBottom: 4,
  },
  audioGearText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  dramaList: {
    gap: 10,
    marginBottom: 16,
  },
  dramaItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dramaBullet: {
    color: theme.colors.amber,
    fontSize: 14,
    marginTop: 2,
  },
  dramaName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dramaSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  actressPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  actressPillLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  actressPill: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
    fontSize: 11,
    color: theme.colors.violet,
    fontWeight: '600',
  },
  bulletBox: {
    gap: 10,
  },
  bulletItem: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  bulletTitle: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  loyaltyQuote: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.emerald,
    padding: 12,
    borderRadius: 4,
  },
  loyaltyQuoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
});
