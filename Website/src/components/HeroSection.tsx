import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenEmail: () => void;
  onLaunchSimulator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onOpenEmail,
  onLaunchSimulator,
}) => {
  return (
    <View style={styles.heroWrapper} id="hero">
      <View style={styles.heroContainer}>
        {/* Top Tagline Pill */}
        <View style={styles.badgeRow}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>⚡ SOLO FOUNDER &amp; CNC SYSTEMS ARCHITECT</Text>
          </View>
          <View style={styles.iqBadge}>
            <Text style={styles.iqBadgeText}>INTJ • IQ 150+</Text>
          </View>
          <View style={styles.paxelBadge}>
            <Text style={styles.paxelBadgeText}>YC Paxel Verified (0 Reverts)</Text>
          </View>
          <View style={[styles.paxelBadge, { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
            <Text style={[styles.paxelBadgeText, { color: '#ffd700' }]}>🏆 5x Tech Briefs 2026 Finalist</Text>
          </View>
        </View>

        {/* Main Punchline Header */}
        <Text style={styles.punchTitle}>
          Hi, I'm <Text style={styles.highlightName}>Muhammad Ali</Text>.
        </Text>

        <Text style={styles.punchSubtitle}>
          No, not the one with boxing gloves. The one who wrestles{' '}
          <Text style={styles.boldText}>24,000 RPM</Text> industrial spindles, builds real-time
          acoustic AI to stop carbide tool breakage in <Text style={styles.boldText}>&lt; 30ms</Text>,
          and crafts 17 KB zero-dependency Win32 sentinels on the shop floor in Pakistan.
        </Text>

        {/* Punchy Humor Card */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteAccent} />
          <View style={styles.quoteBody}>
            <Text style={styles.quoteHeading}>The Operator's Creed:</Text>
            <Text style={styles.quoteText}>
              "Float like a butterfly, cut like a 6mm 2-flute solid carbide endmill at 3,500 mm/min
              without snapping the bit into a \$1,500 piece of Sheesham hardwood."
            </Text>
          </View>
        </View>

        {/* Call to Actions */}
        <View style={styles.ctaRow}>
          <Pressable onPress={onExplore} style={styles.primaryCta}>
            <Text style={styles.primaryCtaText}>Explore My Work &amp; Arsenal ↓</Text>
          </Pressable>

          <Pressable onPress={onLaunchSimulator} style={styles.secondaryCta}>
            <Text style={styles.secondaryCtaText}>⚡ Acoustic Spindle Lab</Text>
          </Pressable>

          <Pressable onPress={onOpenEmail} style={styles.ghostCta}>
            <Text style={styles.ghostCtaText}>say@rmaa.pk ✉</Text>
          </Pressable>
        </View>

        {/* Stat / Credential Ribbons */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24,000</Text>
            <Text style={styles.statLabel}>Max Spindle RPM</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>&lt; 5 ms</Text>
            <Text style={styles.statLabel}>Win32 Feed Override</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Conventional Commits</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>K-Dramas Completed</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: 'radial-gradient(ellipse at 50% 10%, rgba(56, 189, 248, 0.08) 0%, rgba(9, 10, 15, 1) 70%)' as any,
  },
  heroContainer: {
    maxWidth: 960,
    width: '100%',
    marginHorizontal: 'auto' as any,
    alignItems: 'center',
    textAlign: 'center' as any,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  heroPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  heroPillText: {
    color: theme.colors.cyan,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: theme.fonts.mono,
  },
  iqBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  iqBadgeText: {
    color: theme.colors.violet,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  paxelBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  paxelBadgeText: {
    color: theme.colors.emerald,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  punchTitle: {
    fontSize: 54,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 62,
    marginBottom: 20,
  },
  highlightName: {
    color: theme.colors.cyan,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(56, 189, 248, 0.4)',
  },
  punchSubtitle: {
    fontSize: 20,
    lineHeight: 32,
    color: theme.colors.textSecondary,
    maxWidth: 820,
    marginBottom: 30,
    fontWeight: '400',
  },
  boldText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  quoteCard: {
    maxWidth: 780,
    width: '100%',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 36,
    textAlign: 'left' as any,
  },
  quoteAccent: {
    width: 6,
    backgroundColor: theme.colors.amber,
  },
  quoteBody: {
    padding: 16,
    flex: 1,
  },
  quoteHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.amber,
    fontFamily: theme.fonts.mono,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 40,
  },
  primaryCta: {
    backgroundColor: theme.colors.cyan,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
    shadowColor: theme.colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  primaryCtaText: {
    color: '#090A0F',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: theme.fonts.mono,
  },
  secondaryCta: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  secondaryCtaText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  ghostCta: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  ghostCtaText: {
    color: theme.colors.cyan,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: theme.fonts.mono,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    paddingVertical: 18,
    paddingHorizontal: 24,
    maxWidth: 780,
    width: '100%',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
    display: 'flex',
  },
});
