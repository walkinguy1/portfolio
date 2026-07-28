import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  // Use ref to avoid stale closure — no re-render needed for visibility
  const visibleRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const DOT_SIZE = 8;
    const RING_SIZE = 40;
    const RING_SIZE_HOVER = 60;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHovering = false;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Always center dot exactly on cursor
      dot.style.transform = `translate(${mouseX - DOT_SIZE / 2}px, ${mouseY - DOT_SIZE / 2}px)`;
      // Show cursor elements on first move — use DOM directly to avoid stale closure
      if (!visibleRef.current) {
        visibleRef.current = true;
        dot.classList.add(styles.cursorDotVisible);
        ring.classList.add(styles.cursorRingVisible);
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      // Center ring on cursor based on current size
      const size = isHovering ? RING_SIZE_HOVER : RING_SIZE;
      ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = () => { isHovering = true; ring.classList.add(styles.cursorRingHover); };
    const onLeave = () => { isHovering = false; ring.classList.remove(styles.cursorRingHover); };

    const attachListeners = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);
    attachListeners();

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <div className={styles.cursorDot} ref={dotRef} />
      <div className={styles.cursorRing} ref={ringRef} />
    </>
  );
};
