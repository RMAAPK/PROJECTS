import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const OriginStorySection: React.FC = () => {
  const milestones = [
    {
      year: 'Age 4',
      badge: 'First Terminal',
      title: 'The Offline Sandbox',
      desc: 'My father bought every sibling a computer with zero internet access. No tutorials, no YouTube, no Stack Overflow. Just raw trial, error, curiosity, and blue screens.',
      color: theme.colors.cyan,
    },
    {
      year: 'Age 5',
      badge: 'System Hobbyist',
      title: 'Reinstalling Windows XP on Repeat',
      desc: 'While other kids were playing with blocks, my obsession was reformatting disks and reinstalling Windows XP, Windows 7, and Linux kernels just to understand what happens before the GUI boots.',
      color: theme.colors.emerald,
    },
    {
      year: 'Age 7',
      badge: 'Hardware Maker',
      title: 'DIY Soldering Irons & Power Banks',
      desc: 'Constructed custom functional soldering irons and emergency battery banks from scavenged lithium cells and raw copper wiring. Learned early: if it does not exist, build it yourself.',
      color: theme.colors.amber,
    },
    {
      year: 'Roots',
      badge: 'Family Lineage',
      title: 'The Pindora Heritage (Raja Ghulam Asghar Abbasi)',
      desc: 'Raised in Rawalpindi by my father, Raja Ghulam Asghar Abbasi, who served as President (Saddar) of the Tajran (Traders Association) in Pindora. Learned the bedrock of character: uncompromised integrity, community loyalty, and standing tall when pressure mounts.',
      color: theme.colors.violet,
    },
    {
      year: 'Mentorship',
      badge: 'Shop Floor Veteran',
      title: 'Under the Wing of Iftikhar Bhai (Sector F-11)',
      desc: 'Cut my teeth as Lead Spindle Operator and Designer in the Sector F-11 CNC cluster under master craftsman Iftikhar Bhai. He taught me the tactile reality of cutting tools: feeling thermal vibration through the gantry, reading Sheesham grain, and never accepting sloppy tolerances.',
      color: theme.colors.rose,
    },
    {
      year: 'Today',
      badge: 'Industrial AI',
      title: 'Bridging Shop Floor Iron & Acoustic Neural Nets',
      desc: 'Consolidated Welcome Edge Cutting and Umer Al Khairy CNC into Ali CNC, earned dual TITANS of CNC Academy credentials, registered with PSEB, and architected Forge AI to make CNC machines listen to their own cutting acoustics.',
      color: theme.colors.cyan,
    },
  ];

  return (
    <View style={styles.sectionWrapper} id="origin">
      <View style={styles.container}>
        {/* Section Heading */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>🌱 THE HUMAN SIDE &amp; ORIGINS</Text>
          <Text style={styles.sectionTitle}>
            How a 5-Year-Old OS Hobbyist Became a <Text style={styles.highlight}>Spindle Whisperer</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            Behind every line of code is twenty years of tinkering, high-stakes machining, and a
            refusal to settle for fragile solutions.
          </Text>
        </View>

        {/* Timeline Grid */}
        <View style={styles.timelineGrid}>
          {milestones.map((item, index) => (
            <View key={index} style={styles.milestoneCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.yearPill, { borderColor: item.color }]}>
                  <Text style={[styles.yearText, { color: item.color }]}>{item.year}</Text>
                </View>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* Life Quote Banner */}
        <View style={styles.lifeBanner}>
          <Text style={styles.bannerEmoji}>🐕</Text>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>The Real Life Anchor in Rawalpindi</Text>
            <Text style={styles.bannerText}>
              When the spindles are quiet and the terminals are idle, life centers around family in
              Rawalpindi, cousin Haseeb, our German Shepherd Fargo, 3 AM K-drama marathons, and
              unfiltered music playlists on repeat.
            </Text>
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
    maxWidth: 780,
  },
  highlight: {
    color: theme.colors.emerald,
  },
  sectionDesc: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    maxWidth: 700,
    lineHeight: 24,
  },
  timelineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 36,
  },
  milestoneCard: {
    minWidth: 320, flex: 1,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  yearPill: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  yearText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: theme.fonts.mono,
  },
  badgeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  lifeBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: theme.radii.lg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bannerEmoji: {
    fontSize: 32,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.emerald,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

