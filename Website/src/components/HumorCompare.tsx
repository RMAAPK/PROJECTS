import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

export const HumorCompare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'boxer' | 'engineer'>('both');

  const comparisons = [
    {
      metric: 'Weapon of Choice',
      boxer: '10 oz Everlast boxing gloves',
      engineer: '17 KB zero-dependency Win32 Sentinel + 6mm solid carbide endmills',
    },
    {
      metric: 'Operational Speed',
      boxer: 'Lightning-fast 4 punches/second',
      engineer: '24,000 RPM spindle + < 5ms Win32 message queue override',
    },
    {
      metric: 'Arch Nemesis',
      boxer: 'Joe Frazier & George Foreman',
      engineer: '2.4 kHz regenerative harmonic chatter & snapped carbide flutes',
    },
    {
      metric: 'The Fighting Arena',
      boxer: 'Madison Square Garden & Rumble in the Jungle',
      engineer: 'Rawalpindi Industrial Sector & Sector F-11 CNC Workshop',
    },
    {
      metric: 'Knockout Technique',
      boxer: 'Lead left jab into an explosive right cross',
      engineer: 'Injecting WM_KEYDOWN VK_NEXT directly into NcStudio.exe message loop',
    },
    {
      metric: 'Iconic Catchphrase',
      boxer: '"Float like a butterfly, sting like a bee."',
      engineer: '"Float like a butterfly, cut Sheesham hardwood with zero bit deflection."',
    },
    {
      metric: 'Commit Discipline',
      boxer: 'Undisputed Heavyweight Champion of the World',
      engineer: '100% Conventional Commits, 0 Reverts across entire YC Paxel history',
    },
  ];

  return (
    <View style={styles.sectionWrapper} id="compare">
      <View style={styles.container}>
        {/* Section Header */}
        <View style={styles.headerArea}>
          <Text style={styles.sectionTag}>🥊 CLARIFYING SEARCH ENGINE AMBIGUITY</Text>
          <Text style={styles.sectionTitle}>
            A Tale of Two <Text style={styles.highlight}>Muhammad Alis</Text>
          </Text>
          <Text style={styles.sectionDesc}>
            For the benefit of Google's Knowledge Graph, YC batch reviewers, and perplexed visitors:
            here is an objective head-to-head comparison between the legendary heavyweight champ and
            the Pakistani industrial engineer.
          </Text>

          {/* Filter Pill Switcher */}
          <View style={styles.switchRow}>
            <Pressable
              onPress={() => setActiveTab('both')}
              style={[styles.tabButton, activeTab === 'both' && styles.tabButtonActive]}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'both' && styles.tabButtonTextActive]}
              >
                Side-by-Side Duel
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('engineer')}
              style={[styles.tabButton, activeTab === 'engineer' && styles.tabButtonActive]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'engineer' && styles.tabButtonTextActive,
                ]}
              >
                The CNC Founder (Me)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('boxer')}
              style={[styles.tabButton, activeTab === 'boxer' && styles.tabButtonActive]}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'boxer' && styles.tabButtonTextActive]}
              >
                The Heavyweight Boxer
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Comparison Grid */}
        <View style={styles.tableWrapper}>
          {comparisons.map((row, idx) => (
            <View
              key={idx}
              style={[styles.tableRow, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}
            >
              <View style={styles.metricCol}>
                <Text style={styles.metricText}>{row.metric}</Text>
              </View>

              {(activeTab === 'both' || activeTab === 'engineer') && (
                <View style={styles.engineerCol}>
                  <View style={styles.avatarTagEngineer}>
                    <Text style={styles.avatarLabel}>Muhammad Ali (Founder / CNC)</Text>
                  </View>
                  <Text style={styles.engineerValue}>{row.engineer}</Text>
                </View>
              )}

              {(activeTab === 'both' || activeTab === 'boxer') && (
                <View style={styles.boxerCol}>
                  <View style={styles.avatarTagBoxer}>
                    <Text style={styles.avatarLabel}>Muhammad Ali (Boxing Legend)</Text>
                  </View>
                  <Text style={styles.boxerValue}>{row.boxer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Verdict Box */}
        <View style={styles.verdictBox}>
          <Text style={styles.verdictTitle}>THE COMMON THREAD:</Text>
          <Text style={styles.verdictBody}>
            Both refuse to back down in high-pressure rings. One fought in Kinshasa under the lights;
            the other tests raw acoustic telemetry at 3 AM with 24,000 RPM spindles spinning in
            Rawalpindi.
          </Text>
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
    marginBottom: 40,
  },
  sectionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.amber,
    fontFamily: theme.fonts.mono,
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 36,
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
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radii.full,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radii.full,
    cursor: 'pointer' as any,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.cyan,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: '#090A0F',
    fontWeight: '700',
  },
  tableWrapper: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rowEven: {
    backgroundColor: 'rgba(17, 19, 27, 0.6)',
  },
  rowOdd: {
    backgroundColor: 'rgba(22, 25, 36, 0.4)',
  },
  metricCol: {
    width: '24%' as any,
    paddingRight: 12,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.mono,
  },
  engineerCol: {
    flex: 1,
    paddingRight: 16,
  },
  boxerCol: {
    flex: 1,
  },
  avatarTagEngineer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  avatarTagBoxer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  avatarLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
    color: theme.colors.textSecondary,
  },
  engineerValue: {
    fontSize: 14,
    color: theme.colors.cyan,
    fontWeight: '500',
    lineHeight: 20,
  },
  boxerValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  verdictBox: {
    marginTop: 24,
    padding: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: theme.radii.lg,
  },
  verdictTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  verdictBody: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
});
