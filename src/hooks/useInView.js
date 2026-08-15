import { useEffect, useRef, useState } from "react";

/**
 * Reports when an element first scrolls into view, then stops watching.
 * Replaces react-on-screen's TrackVisibility render prop.
 */
export default function useInView(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect(); // reveal once — don't re-animate on scroll back
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
