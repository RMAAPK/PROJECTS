import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from './theme';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HumorCompare } from './components/HumorCompare';
import { OriginStorySection } from './components/OriginStorySection';
import { AcousticSimulator } from './components/AcousticSimulator';
import { EngineeringSection } from './components/EngineeringSection';
import { PersonalLifeSection } from './components/PersonalLifeSection';
import { BlogSection } from './components/BlogSection';
import { TerminalDialogue } from './components/TerminalDialogue';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Initialize slug from URL (e.g. /blog/some-slug or ?article=some-slug)
  useEffect(() => {
    const parseSlugFromLocation = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/blog/')) {
        const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
        if (slug) return slug;
      }
      const params = new URLSearchParams(window.location.search);
      const articleParam = params.get('article');
      if (articleParam) return articleParam;

      if (window.location.hash.startsWith('#blog-')) {
        return window.location.hash.replace('#blog-', '');
      }

      return null;
    };

    const initial = parseSlugFromLocation();
    if (initial) {
      setSelectedSlug(initial);
      setTimeout(() => {
        const el = document.getElementById('blog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    const handlePopState = () => {
      setSelectedSlug(parseSlugFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectArticle = (slug: string | null) => {
    setSelectedSlug(slug);
    if (slug) {
      window.history.pushState({}, '', `/blog/${slug}`);
      setTimeout(() => {
        const el = document.getElementById('blog');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.history.pushState({}, '', '/#blog');
    }
  };

  const scrollToSection = (id: string) => {
    if (id === 'blog' && selectedSlug) {
      // Return to blog list if user clicks Blog in nav
      setSelectedSlug(null);
      window.history.pushState({}, '', '/#blog');
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <View style={styles.appRoot}>
      <Navbar onScrollTo={scrollToSection} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HeroSection
          onExplore={() => scrollToSection('engineering')}
          onOpenEmail={() => (window.location.href = 'mailto:say@rmaa.pk')}
          onLaunchSimulator={() => scrollToSection('simulator')}
        />

        <HumorCompare />

        <OriginStorySection />

        <AcousticSimulator />

        <EngineeringSection />

        <PersonalLifeSection />

        <BlogSection
          selectedSlug={selectedSlug}
          onSelectArticle={handleSelectArticle}
        />

        <TerminalDialogue />

        <ContactSection />

        <Footer onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    minHeight: '100vh' as any,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default App;
