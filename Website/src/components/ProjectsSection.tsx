import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

export const ProjectsSection: React.FC = () => {
  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const rmaaProjects = [
    {
      name: 'RMAA AI Ahyeon',
      tag: 'BABYMONSTER Idol Engine',
      badge: 'Active & Verified',
      badgeColor: theme.colors.emerald,
      desc: 'Hyper-personalized conversational AI modeled after Jung Ahyeon (BABYMONSTER). Built with turn-0 persona conditioning, Weverse empathetic memory, 800-situp Knowing Bros stamina lore, and Korean colloquial alignment.',
      tech: ['Qwen2.5-0.5B GGUF', 'Ollama Local Runtime', 'Few-Shot KV Anchoring', 'Zero Corporate Fluff'],
      actions: [
        { label: 'GitHub Repository', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Ahyeon' },
        { label: 'Ollama: ollama run ahyeon', url: 'http://localhost:11434' },
      ],
    },
    {
      name: 'RMAA AI Wohnee',
      tag: 'ILLIT Idol Engine',
      badge: 'Active & Verified',
      badgeColor: theme.colors.cyan,
      desc: 'Bubbly, natural comedian conversational intelligence modeled after Lee Won-hee (ILLIT). Embeds her official Weverse Magazine "no regrets" philosophy, garlic bread / Buldak ramen banter, and room-cleaning destress routines.',
      tech: ['Qwen2.5-0.5B GGUF', 'Ollama Local Runtime', 'Natural Comedian Dialogue', 'Zero Corporate Fluff'],
      actions: [
        { label: 'GitHub Repository', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Wohnee' },
        { label: 'Ollama: ollama run wonhee', url: 'http://localhost:11434' },
      ],
    },
    {
      name: 'RMAA AI Web Hub',
      tag: 'Frontend Platform',
      badge: 'Live Production',
      badgeColor: theme.colors.violet,
      desc: 'Central React 18 + Vite micro-frontend hub hosting all RMAA AI interfaces under a single unified Render deployment architecture. Synchronized with unified.db SQLite store.',
      tech: ['React 18', 'Vite', 'Render Cloud Platform', 'unified.db Store'],
      actions: [
        { label: 'Main Website (rmaa.pk)', url: 'https://rmaa.pk' },
        { label: 'Contact: say@rmaa.pk', url: 'mailto:say@rmaa.pk' },
      ],
    },
    {
      name: 'RMAA AI Trading Bot',
      tag: 'Quantitative Sentinel',
      badge: 'In Queue',
      badgeColor: theme.colors.amber,
      desc: 'Algorithmic market surveillance engine and automated trade executor designed for low-latency signals and risk management.',
      tech: ['Python 3.13', 'Market Websockets', 'Backtesting Engine', 'Render Worker'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Trading%20Bot' },
      ],
    },
    {
      name: 'RMAA AI Product Scout',
      tag: 'E-Commerce Intelligence',
      badge: 'In Queue',
      badgeColor: theme.colors.amber,
      desc: 'Autonomous trend detection engine scanning global marketplaces and synthesizing arbitrage opportunities.',
      tech: ['Scraping Sentinels', 'Sentiment Analysis', 'Supabase Sync'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Product%20Scout' },
      ],
    },
    {
      name: 'RMAA AI Sniper',
      tag: 'High-Frequency Harvester',
      badge: 'In Queue',
      badgeColor: theme.colors.amber,
      desc: 'High-frequency proxy-rotated data extractor designed for distributed signal discovery with zero downtime.',
      tech: ['DataImpulse Proxies', 'Async Workers', 'SQLite Ledger'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Sniper' },
      ],
    },
    {
      name: 'RMAA AI Food',
      tag: 'Culinary Intelligence',
      badge: 'In Queue',
      badgeColor: theme.colors.amber,
      desc: 'Nutritional calculation matrix and meal formulation engine with ingredient shelf-life tracking.',
      tech: ['Macro Calculator', 'Recipe Generation', 'Pantry DB'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Food' },
      ],
    },
    {
      name: 'RMAA AI Lawer',
      tag: 'Legal Contract Parser',
      badge: 'In Queue',
      badgeColor: theme.colors.amber,
      desc: 'Contract clause extraction engine cross-referencing commercial agreements and IP assignment liabilities.',
      tech: ['NLP Clause Parser', 'Precedent Search', 'Document Diff'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Lawer' },
      ],
    },
    {
      name: 'RMAA AI Drama Buddy',
      tag: 'Narrative Companion',
      badge: 'Active & Verified',
      badgeColor: theme.colors.emerald,
      desc: 'Asian & Korean drama discussion partner with episode cliffhanger tracking and character arc analysis.',
      tech: ['React Native', 'Supabase', 'Python Scraper'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/Drama%20Buddy' },
      ],
    },
    {
      name: 'RMAA AI SVGVPlayer',
      tag: 'Video Animation Engine',
      badge: 'Active & Verified',
      badgeColor: theme.colors.emerald,
      desc: 'Ultra-lightweight vector video playback system using Expo and React Native SVG, rendering real-time animated frames from encoded JSON payloads.',
      tech: ['React Native', 'Expo', 'SVG Animation'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/SVGVPlayer' },
      ],
    },
    {
      name: 'RMAA AI VectorVision',
      tag: 'Video to Vector AI Pipeline',
      badge: 'Active & Verified',
      badgeColor: theme.colors.emerald,
      desc: 'Node.js backend with Replicate AI vision models to trace and encode MP4 videos into highly compressed JSON vector sequences.',
      tech: ['Node.js', 'Replicate AI', 'pgvector'],
      actions: [
        { label: 'View Spec', url: 'https://github.com/RMAAPK/PROJECTS/tree/main/VectorVision_Node' },
      ],
    },
  ];

  return (
    <View style={styles.section} id="projects">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RMAA.PK COLLECTION</Text>
            </View>
            <Text style={styles.contactEmail}>say@rmaa.pk</Text>
          </View>
          <Text style={styles.title}>
            RMAA AI <Text style={styles.titleHighlight}>Projects</Text>
          </Text>
          <Text style={styles.subtitle}>
            A dedicated suite of specialized personal AI engines, localized GGUF weights, and autonomous tools.
            Every project starts with "RMAA AI", is open-source, and deploys under a unified Render architecture.
          </Text>
        </View>

        {/* Project Grid */}
        <View style={styles.grid}>
          {rmaaProjects.map((p, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.statusPill, { borderColor: p.badgeColor }]}>
                  <View style={[styles.statusDot, { backgroundColor: p.badgeColor }]} />
                  <Text style={[styles.statusText, { color: p.badgeColor }]}>{p.badge}</Text>
                </View>
                <Text style={styles.tagText}>{p.tag}</Text>
              </View>

              <Text style={styles.cardTitle}>{p.name}</Text>
              <Text style={styles.cardDesc}>{p.desc}</Text>

              {/* Tech Badges */}
              <View style={styles.techRow}>
                {p.tech.map((t, tIdx) => (
                  <View key={tIdx} style={styles.techBadge}>
                    <Text style={styles.techText}>{t}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {p.actions.map((act, aIdx) => (
                  <Pressable
                    key={aIdx}
                    onPress={() => openUrl(act.url)}
                    style={({ hovered }: any) => [
                      styles.actionBtn,
                      hovered && styles.actionBtnHover,
                    ]}
                  >
                    <Text style={styles.actionText}>{act.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 80,
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 48,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  badgeText: {
    color: theme.colors.cyan,
    fontSize: 11,
    fontFamily: theme.fonts.mono,
    fontWeight: '700',
    letterSpacing: 1,
  },
  contactEmail: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.mono,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
    fontFamily: theme.fonts.heading,
  },
  titleHighlight: {
    color: theme.colors.cyan,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 720,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  card: {
    flex: 1,
    minWidth: 340,
    maxWidth: '100%',
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: theme.fonts.mono,
  },
  tagText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.mono,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: theme.fonts.heading,
  },
  cardDesc: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  techBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radii.sm,
  },
  techText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontFamily: theme.fonts.mono,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 'auto',
  },
  actionBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radii.sm,
  },
  actionBtnHover: {
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderColor: theme.colors.cyan,
  },
  actionText: {
    color: theme.colors.cyan,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: theme.fonts.mono,
  },
});
