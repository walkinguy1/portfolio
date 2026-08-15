import { useEffect } from "react";

export function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function useTypedSequence(sequence, onTrigger, options = {}) {
  const { disabled = false } = options;
  // Joined to a string so a fresh array literal from the caller
  // doesn't rebind the listener on every render.
  const keys = sequence.join(" ").toLowerCase();

  useEffect(() => {
    if (disabled || !keys) return;

    const normalized = keys.split(" ");
    let index = 0;

    const handler = (event) => {
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if (key === normalized[index]) {
        index += 1;

        if (index === normalized.length) {
          onTrigger();
          index = 0;
        }

        return;
      }

      index = key === normalized[0] ? 1 : 0;
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, keys, onTrigger]);
}
