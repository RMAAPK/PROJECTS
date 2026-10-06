import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from './theme';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HumorCompare } from './components/HumorCompare';
import { OriginStorySection } from './components/OriginStorySection';
import { AcousticSimulator } from './components/AcousticSimulator';
import { EngineeringSection } from './components/EngineeringSection';
import { ProjectsSection } from './components/ProjectsSection';
import { PersonalLifeSection } from './components/PersonalLifeSection';
import { BlogSection } from './components/BlogSection';
import { TerminalDialogue } from './components/TerminalDialogue';
import { AiAssistant } from './components/AiAssistant';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Initialize slug from URL (e.g. /blog/some-slug or ?article=some-slug)
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

  useEffect(() => {
    const initialSlug = parseSlugFromLocation();
    setSelectedSlug(initialSlug);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSelectedSlug(parseSlugFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (!path.startsWith('/blog/')) {
        setSelectedSlug(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slug: string | null) => {
    setSelectedSlug(slug);
    if (slug) {
      window.history.pushState({}, '', `/blog/${slug}`);
      setCurrentPath(`/blog/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/blog');
      setCurrentPath('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    if (id === 'blog') {
      navigateTo('/blog');
      return;
    }
    
    // If we're on the blog page and trying to scroll to a home section, go home first
    if (currentPath.startsWith('/blog')) {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isBlogPage = currentPath.startsWith('/blog');

  return (
    <View style={styles.appRoot}>
      <Navbar onScrollTo={scrollToSection} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isBlogPage ? (
          <View style={{ paddingTop: 80, paddingBottom: 40, flex: 1 }}>
            <BlogSection
              selectedSlug={selectedSlug}
              onSelectArticle={handleSelectArticle}
            />
          </View>
        ) : (
          <>
            <HeroSection
              onExplore={() => scrollToSection('engineering')}
              onOpenEmail={() => (window.location.href = 'mailto:say@rmaa.pk')}
              onLaunchSimulator={() => scrollToSection('simulator')}
            />

            <HumorCompare />

            <OriginStorySection />

            <AcousticSimulator />

            <EngineeringSection />

            <ProjectsSection />

            <PersonalLifeSection />

            <TerminalDialogue />

            <ContactSection />
          </>
        )}

        <Footer onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <AiAssistant />
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
