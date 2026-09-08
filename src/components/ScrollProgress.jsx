import { useEffect, useState } from 'react';

// A very thin fixed bar at the very top of the page tracking scroll
// progress (0% at the top of the page, 100% at the bottom). Purely
// decorative/informational - no functionality depends on it. Uses a
// single scroll listener (rAF-throttled) rather than per-frame work.
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div className="av-scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

export default ScrollProgress;
