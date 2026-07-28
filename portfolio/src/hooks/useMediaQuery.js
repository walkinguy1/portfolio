import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query and re-renders when it flips.
 * Used to mount/unmount components rather than just hide them, so the
 * work behind a heavy component is never done on devices that skip it.
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    onChange => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
