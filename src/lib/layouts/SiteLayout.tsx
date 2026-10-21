import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import ToastHost from '../components/toast/ToastHost';
import PageErrorBoundary from './PageErrorBoundary';

export default function SiteLayout() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // The root theme also reaches Skeleton elements rendered through portals.
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const hash = location.hash.slice(1);
      const section = hash
        ? Array.from(
            contentRef.current?.querySelectorAll<HTMLElement>('[data-section]') ?? [],
          ).find((element) => element.dataset.section === hash)
        : null;
      if (section) {
        section.scrollIntoView({
          block: 'start',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="min-h-screen">
      <div
        data-portfolio=""
        className="flex min-h-dvh flex-col overflow-clip bg-site-bg font-sans leading-[1.55] text-site-ink max-[581px]:rounded-[10px]"
      >
        <Navbar
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        />
        <div ref={contentRef} className="flex-1">
          <PageErrorBoundary key={location.key}>
            <Outlet />
          </PageErrorBoundary>
        </div>
        <Footer />
      </div>
      <ToastHost />
    </div>
  );
}
