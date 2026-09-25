import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import confetti from 'canvas-confetti';
import { theme } from '../theme';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('say@rmaa.pk');
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#38BDF8', '#10B981', '#A855F7'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <View style={styles.sectionWrapper} id="contact">
      <View style={styles.container}>
        {/* Section Heading */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>📬 INITIATE DIRECT TRANSMISSION</Text>
          <Text style={styles.sectionTitle}>
            Let's Build Something <Text style={styles.highlight}>Unbreakable</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            Whether you want to discuss YC batch applications, deploy Forge AI acoustic pods on your
            CNC shop floor, license CAD/CAM parametric toolpaths, or talk music—reach out directly.
          </Text>
        </View>

        {/* Big Email Action Card */}
        <View style={styles.emailCard}>
          <Text style={styles.emailCardLabel}>PRIMARY PERSONAL CONTACT DISPATCH:</Text>
          <Text style={styles.emailDisplay}>say@rmaa.pk</Text>

          <View style={styles.buttonGroup}>
            <Pressable
              onPress={() => (window.location.href = 'mailto:say@rmaa.pk')}
              style={styles.openMailBtn}
            >
              <Text style={styles.openMailBtnText}>Open Email Client ✉</Text>
            </Pressable>

            <Pressable onPress={copyEmail} style={styles.copyBtn}>
              <Text style={styles.copyBtnText}>
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy Address'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Secondary Contact Grid */}
        <View style={styles.channelsGrid}>
          {/* Business Email */}
          <Pressable
            onPress={() => (window.location.href = 'mailto:ali@alicnc.pk')}
            style={styles.channelCard}
          >
            <Text style={styles.channelIcon}>💼</Text>
            <Text style={styles.channelName}>Business &amp; Commercial</Text>
            <Text style={styles.channelLink}>ali@alicnc.pk</Text>
            <Text style={styles.channelDesc}>Commercial licenses, custom G-code, and B2B contracts.</Text>
          </Pressable>

          {/* WhatsApp Direct */}
          <Pressable
            onPress={() => openUrl('https://wa.me/923440708494')}
            style={styles.channelCard}
          >
            <Text style={styles.channelIcon}>💬</Text>
            <Text style={styles.channelName}>WhatsApp Direct</Text>
            <Text style={styles.channelLink}>RMAA: +92 330 9246239</Text>
            <Text style={styles.channelLink}>Ali CNC: +92 344 0708494</Text>
            <Text style={styles.channelDesc}>Direct messaging, urgent machine queries, and shop notes.</Text>
          </Pressable>

          {/* Founder <-> Enterprise Bridge */}
          <Pressable onPress={() => openUrl('https://alicnc.pk')} style={styles.channelCard}>
            <Text style={styles.channelIcon}>?</Text>
            <Text style={styles.channelName}>Ali CNC - Official Enterprise</Text>
            <Text style={styles.channelLink}>Visit alicnc.pk</Text>
            <Text style={styles.channelDesc}>My company's home. CAD/CAM automation, custom tooling, and AI-driven CNC architecture.</Text>
          </Pressable>

          {/* Forge AMK Bridge */}
          <Pressable onPress={() => openUrl('https://forgeamk.com')} style={styles.channelCard}>
            <Text style={styles.channelIcon}>🔥</Text>
            <Text style={styles.channelName}>Forge AMK</Text>
            <Text style={styles.channelLink}>Visit forgeamk.com</Text>
            <Text style={styles.channelDesc}>Acoustic AI integrations and advanced manufacturing systems deployed globally.</Text>
          </Pressable>

          {/* GitHub Profiles */}
          <Pressable
            onPress={() => openUrl('https://github.com/thealidev')}
            style={styles.channelCard}
          >
            <Text style={styles.channelIcon}>🐙</Text>
            <Text style={styles.channelName}>GitHub Profiles</Text>
            <Text style={styles.channelLink}>@thealidev • @alicncltd</Text>
            <Text style={styles.channelDesc}>Open source sentinels, CAD parsers, and YC repositories.</Text>
          </Pressable>

          {/* CadCrowd & Crunchbase */}
          <Pressable
            onPress={() => openUrl('https://www.crunchbase.com/organization/ali-cnc-pakistan')}
            style={styles.channelCard}
          >
            <Text style={styles.channelIcon}>🌐</Text>
            <Text style={styles.channelName}>Corporate Profiles</Text>
            <Text style={styles.channelLink}>Crunchbase • CadCrowd</Text>
            <Text style={styles.channelDesc}>Company registration, verified portfolio, and founder records.</Text>
          </Pressable>
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
    maxWidth: 960,
    width: '100%',
    marginHorizontal: 'auto' as any,
  },
  headerArea: {
    alignItems: 'center',
    textAlign: 'center' as any,
    marginBottom: 36,
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.emerald,
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
    color: theme.colors.emerald,
  },
  sectionDesc: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    maxWidth: 680,
    lineHeight: 24,
  },
  emailCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: theme.radii.lg,
    padding: 30,
    alignItems: 'center',
    marginBottom: 36,
    textAlign: 'center' as any,
  },
  emailCardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.emerald,
    fontFamily: theme.fonts.mono,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  emailDisplay: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.mono,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  openMailBtn: {
    backgroundColor: theme.colors.emerald,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  openMailBtnText: {
    color: '#090A0F',
    fontWeight: '800',
    fontSize: 13,
    fontFamily: theme.fonts.mono,
  },
  copyBtn: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  copyBtnText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
    fontFamily: theme.fonts.mono,
  },
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  channelCard: {
    minWidth: 320, flex: 1,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 20,
    cursor: 'pointer' as any,
  },
  channelIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  channelName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  channelLink: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    marginBottom: 6,
  },
  channelDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
});



