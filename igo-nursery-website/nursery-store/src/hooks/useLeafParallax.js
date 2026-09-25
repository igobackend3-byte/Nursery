import { useEffect } from 'react';

// Sets two CSS custom properties on the document root - --leaf-mx/--leaf-my,
// each roughly -1..1 - tracking the pointer's offset from the viewport
// centre, rAF-throttled. Only decorative leaves (`.decor-leaf-parallax`,
// see animations.css) read these inside their own keyframes, so this never
// touches product cards, text, buttons or the navbar. A no-op on touch-only
// devices (no mousemove) and fully inert under prefers-reduced-motion.
function useLeafParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const root = document.documentElement;
    let ticking = false;
    let lastX = 0;
    let lastY = 0;

    function apply() {
      root.style.setProperty('--leaf-mx', lastX.toFixed(3));
      root.style.setProperty('--leaf-my', lastY.toFixed(3));
      ticking = false;
    }

    function onMove(e) {
      lastX = (e.clientX / window.innerWidth) * 2 - 1;
      lastY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
}

export default useLeafParallax;
