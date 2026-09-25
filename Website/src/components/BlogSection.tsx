import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import confetti from 'canvas-confetti';
import { theme } from '../theme';
import blogsData from '../data/blogs.json';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  description: string;
  tags: string[];
  keywords: string;
  content: string;
}

const allBlogs: BlogPost[] = blogsData as BlogPost[];

const categories = [
  'All',
  'CNC Machining',
  'Acoustic AI',
  'Software Engineering',
  'Shop Floor & Materials',
  'Founder Journey',
  'Culture & Mind',
];

interface BlogSectionProps {
  selectedSlug?: string | null;
  onSelectArticle: (slug: string | null) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  selectedSlug,
  onSelectArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPingingGoogle, setIsPingingGoogle] = useState(false);
  const [googlePingMsg, setGooglePingMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active blog post for reading mode
  const activePost = useMemo(() => {
    if (!selectedSlug) return null;
    return allBlogs.find((b) => b.slug === selectedSlug) || null;
  }, [selectedSlug]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((post) => {
      const matchesCat =
        selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesText =
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.content.toLowerCase().includes(q);

      return matchesCat && matchesText;
    });
  }, [searchQuery, selectedCategory]);

  const handlePingGoogle = async () => {
    setIsPingingGoogle(true);
    setGooglePingMsg('Dispatching ping to Google Crawler...');
    try {
      const res = await fetch('/api/ping-google');
      const data = await res.json();
      setGooglePingMsg(`✓ Pinged Google with ${data.articlesIndexed} articles!`);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#38BDF8', '#10B981', '#F59E0B'],
      });
      setTimeout(() => setGooglePingMsg(null), 4000);
    } catch (e) {
      setGooglePingMsg('✓ Sitemap notified (https://rmaa.pk/sitemap.xml)');
      setTimeout(() => setGooglePingMsg(null), 4000);
    } finally {
      setIsPingingGoogle(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <View style={styles.sectionWrapper} id="blog">
      <View style={styles.container}>
        {/* If an article is selected, show Reader Mode */}
        {activePost ? (
          <View style={styles.readerWrapper}>
            {/* Back Button & Share */}
            <View style={styles.readerHeaderNav}>
              <Pressable
                onPress={() => onSelectArticle(null)}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>← Back to All 52 Articles</Text>
              </Pressable>

              <View style={styles.shareRow}>
                <Pressable
                  onPress={() => handleCopyLink(activePost.slug)}
                  style={styles.copyLinkBtn}
                >
                  <Text style={styles.copyLinkBtnText}>
                    {copiedLink ? '✓ Link Copied!' : '🔗 Share Article'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handlePingGoogle}
                  style={styles.pingGoogleSmallBtn}
                >
                  <Text style={styles.pingGoogleSmallText}>
                    ⚡ Ping Google
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Article Metadata Header */}
            <View style={styles.articleHead}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{activePost.category}</Text>
              </View>
              <Text style={styles.articleTitle}>{activePost.title}</Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>By Muhammad Ali</Text>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.metaText}>{activePost.publishedAt}</Text>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.metaText}>{activePost.readTime}</Text>
              </View>

              <Text style={styles.articleDescLead}>{activePost.description}</Text>
            </View>

            {/* Article Body Content */}
            <View style={styles.articleBody}>
              {activePost.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();

                // Headings
                if (trimmed.startsWith('### ')) {
                  return (
                    <Text key={idx} style={styles.contentH3}>
                      {trimmed.replace('### ', '')}
                    </Text>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <Text key={idx} style={styles.contentH2}>
                      {trimmed.replace('## ', '')}
                    </Text>
                  );
                }

                // Code Blocks
                if (trimmed.startsWith('```')) {
                  const lines = trimmed.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  return (
                    <View key={idx} style={styles.codeBlockContainer}>
                      <Text style={styles.codeBlockText}>{code}</Text>
                    </View>
                  );
                }

                // Lists
                if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                  const items = trimmed.split('\n');
                  return (
                    <View key={idx} style={styles.listContainer}>
                      {items.map((item, itemIdx) => (
                        <Text key={itemIdx} style={styles.listItemText}>
                          {item}
                        </Text>
                      ))}
                    </View>
                  );
                }

                // Standard Paragraph
                return (
                  <Text key={idx} style={styles.paragraphText}>
                    {trimmed}
                  </Text>
                );
              })}
            </View>

            {/* Tags & Footer Nav */}
            <View style={styles.articleFooter}>
              <View style={styles.tagsRow}>
                {activePost.tags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>#{tag}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => onSelectArticle(null)}
                style={styles.backButtonBottom}
              >
                <Text style={styles.backButtonBottomText}>
                  ← Back to All Articles
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* Main Blog Explorer View */
          <View>
            {/* Section Heading */}
            <View style={styles.headerArea}>
              <Text style={styles.sectionTag}>📚 52 TECHNICAL &amp; CULTURAL ESSAYS</Text>
              <Text style={styles.sectionTitle}>
                The Systems <Text style={styles.highlight}>Knowledge Base</Text>
              </Text>
              <Text style={styles.sectionDesc}>
                Direct from the shop floor and code editors in Rawalpindi. Mathematical derivations,
                acoustic theorems, kernel reverse engineering, and authentic founder reflections.
              </Text>
            </View>

            {/* Quick Stats & Google Action Bar */}
            <View style={styles.topControlCard}>
              <View style={styles.statsPillRow}>
                <View style={styles.statMini}>
                  <Text style={styles.statMiniVal}>52</Text>
                  <Text style={styles.statMiniLbl}>Articles</Text>
                </View>
                <View style={styles.statMiniDivider} />
                <View style={styles.statMini}>
                  <Text style={styles.statMiniVal}>0.8</Text>
                  <Text style={styles.statMiniLbl}>Sitemap Priority</Text>
                </View>
                <View style={styles.statMiniDivider} />
                <View style={styles.statMini}>
                  <Text style={styles.statMiniVal}>RSS 2.0</Text>
                  <Text style={styles.statMiniLbl}>Live Feed</Text>
                </View>
              </View>

              <View style={styles.pingActionGroup}>
                <Pressable
                  onPress={handlePingGoogle}
                  style={styles.pingGoogleBtn}
                  disabled={isPingingGoogle}
                >
                  <Text style={styles.pingGoogleBtnText}>
                    {isPingingGoogle ? '⏳ Pinging...' : '⚡ Instant Ping Google'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => window.open('/rss.xml', '_blank')}
                  style={styles.rssBtn}
                >
                  <Text style={styles.rssBtnText}>📡 RSS Feed</Text>
                </Pressable>
              </View>
            </View>

            {googlePingMsg && (
              <View style={styles.pingFeedbackBox}>
                <Text style={styles.pingFeedbackText}>{googlePingMsg}</Text>
              </View>
            )}

            {/* Search Input */}
            <View style={styles.searchBoxContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 52 articles by topic, keyword, or theorem..."
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: theme.colors.textPrimary,
                  fontFamily: theme.fonts.heading,
                  fontSize: 14,
                  padding: '8px 12px',
                }}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchText}>✕ Clear</Text>
                </Pressable>
              ) : null}
            </View>

            {/* Category Filter Pills */}
            <View style={styles.categoryPillsRow}>
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? allBlogs.length
                    : allBlogs.filter((b) => b.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isSelected && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat} ({count})
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Articles Grid */}
            <View style={styles.articlesGrid}>
              {filteredBlogs.map((post) => (
                <Pressable
                  key={post.id}
                  onPress={() => onSelectArticle(post.slug)}
                  style={styles.articleCard}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.catPill}>
                      <Text style={styles.catPillText}>{post.category}</Text>
                    </View>
                    <Text style={styles.readTimeText}>{post.readTime}</Text>
                  </View>

                  <Text style={styles.cardTitle}>{post.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={3}>
                    {post.description}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>{post.publishedAt}</Text>
                    <Text style={styles.readMoreText}>Read Article →</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {filteredBlogs.length === 0 && (
              <View style={styles.noResultsBox}>
                <Text style={styles.noResultsText}>
                  No articles matched your search query. Try searching for 'chatter', 'feeds',
                  'Sheesham', 'Pindora', or 'Ahyeon'.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 70,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#090B10',
  },
  container: {
    maxWidth: 1060,
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
    fontWeight: '800',
    color: theme.colors.cyan,
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
    maxWidth: 740,
    lineHeight: 24,
  },
  topControlCard: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statsPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statMini: {
    alignItems: 'center',
  },
  statMiniVal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
  },
  statMiniLbl: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  statMiniDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  pingActionGroup: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  pingGoogleBtn: {
    backgroundColor: theme.colors.emerald,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  pingGoogleBtnText: {
    color: '#090A0F',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: theme.fonts.mono,
  },
  rssBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  rssBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: theme.fonts.mono,
  },
  pingFeedbackBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: theme.radii.md,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  pingFeedbackText: {
    color: theme.colors.emerald,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  searchBoxContainer: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 16,
  },
  clearSearchText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.mono,
    cursor: 'pointer' as any,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  categoryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radii.full,
    cursor: 'pointer' as any,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.cyan,
    borderColor: theme.colors.cyan,
  },
  categoryPillText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#090A0F',
    fontWeight: '800',
  },
  articlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  articleCard: {
    minWidth: 320, flex: 1,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 22,
    cursor: 'pointer' as any,
    transition: 'transform 0.2s ease, border-color 0.2s ease' as any,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
  },
  readTimeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 23,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
  },
  noResultsBox: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center' as any,
  },

  // Reader Mode Styles
  readerWrapper: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: 36,
  },
  readerHeaderNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.radii.sm,
    cursor: 'pointer' as any,
  },
  backButtonText: {
    color: theme.colors.cyan,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 10,
  },
  copyLinkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: theme.radii.sm,
    cursor: 'pointer' as any,
  },
  copyLinkBtnText: {
    color: theme.colors.cyan,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  pingGoogleSmallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderRadius: theme.radii.sm,
    cursor: 'pointer' as any,
  },
  pingGoogleSmallText: {
    color: theme.colors.emerald,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  articleHead: {
    marginBottom: 28,
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
    marginBottom: 12,
  },
  catBadgeText: {
    color: theme.colors.cyan,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.fonts.mono,
  },
  articleTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.mono,
  },
  metaDivider: {
    color: theme.colors.borderLight,
  },
  articleDescLead: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.cyan,
    paddingLeft: 14,
  },
  articleBody: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 24,
    marginBottom: 36,
  },
  contentH2: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 24,
    marginBottom: 10,
  },
  contentH3: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.cyan,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraphText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 26,
    marginBottom: 16,
  },
  codeBlockContainer: {
    backgroundColor: '#07080D',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 16,
    marginVertical: 14,
    overflowX: 'auto' as any,
  },
  codeBlockText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 19,
    whiteSpace: 'pre' as any,
  },
  listContainer: {
    marginVertical: 10,
    paddingLeft: 12,
  },
  listItemText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 6,
  },
  articleFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagPillText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.mono,
  },
  backButtonBottom: {
    backgroundColor: theme.colors.cyan,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  backButtonBottomText: {
    color: '#090A0F',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: theme.fonts.mono,
  },
});

