import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '../theme';

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo }) => {
  const openEmail = () => {
    window.location.href = 'mailto:say@rmaa.pk';
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.navInner}>
        {/* Brand / Name */}
        <Pressable onPress={() => onScrollTo('hero')} style={styles.brand}>
          <View style={styles.spindleDot} />
          <Text style={styles.brandText}>
            Muhammad <Text style={styles.brandHighlight}>Ali</Text>
          </Text>
          <View style={styles.aliasBadge}>
            <Text style={styles.aliasText}>@thealidev</Text>
          </View>
        </Pressable>

        {/* Links */}
        <View style={styles.navLinks}>
          <Pressable onPress={() => onScrollTo('compare')} style={styles.linkItem}>
            <Text style={styles.linkText}>The Two Alis</Text>
          </Pressable>
          <Pressable onPress={() => onScrollTo('origin')} style={styles.linkItem}>
            <Text style={styles.linkText}>Origin Story</Text>
          </Pressable>
          <Pressable onPress={() => onScrollTo('engineering')} style={styles.linkItem}>
            <Text style={styles.linkText}>Engineering</Text>
          </Pressable>
          <Pressable onPress={() => onScrollTo('simulator')} style={styles.linkItem}>
            <Text style={styles.linkText}>Acoustic Lab</Text>
          </Pressable>
          <Pressable onPress={() => onScrollTo('culture')} style={styles.linkItem}>
            <Text style={styles.linkText}>Culture & Life</Text>
          </Pressable>
          <Pressable onPress={() => onScrollTo('blog')} style={styles.linkItem}>
            <View style={styles.blogLinkPill}>
              <Text style={styles.blogLinkText}>Blog (52)</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => onScrollTo('terminal')} style={styles.linkItem}>
            <Text style={styles.linkText}>Terminal</Text>
          </Pressable>
        </View>

        {/* Right CTA */}
        <View style={styles.ctaGroup}>
          <View style={styles.statusPill}>
            <View style={styles.pulseIndicator} />
            <Text style={styles.statusText}>Rawalpindi, PK</Text>
          </View>

          <Pressable onPress={openEmail} style={styles.emailButton}>
            <Text style={styles.emailButtonText}>say@rmaa.pk</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'sticky' as any,
    top: 0,
    zIndex: 1000,
    width: '100%',
    backgroundColor: 'rgba(9, 10, 15, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  navInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto' as any,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer' as any,
  },
  spindleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.cyan,
    shadowColor: theme.colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: theme.colors.cyan,
  },
  aliasBadge: {
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
    marginLeft: 4,
  },
  aliasText: {
    fontSize: 11,
    fontFamily: theme.fonts.mono,
    color: theme.colors.cyan,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    display: 'flex',
  },
  linkItem: {
    cursor: 'pointer' as any,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    transition: 'color 0.2s ease' as any,
  },
  blogLinkPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
  },
  blogLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.cyan,
    fontFamily: theme.fonts.mono,
  },
  ctaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.emerald,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.emerald,
    fontWeight: '600',
  },
  emailButton: {
    backgroundColor: theme.colors.cyan,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radii.md,
    cursor: 'pointer' as any,
  },
  emailButtonText: {
    color: '#090A0F',
    fontWeight: '700',
    fontSize: 13,
    fontFamily: theme.fonts.mono,
  },
});
