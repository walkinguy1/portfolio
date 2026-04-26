import { useEffect } from "react";

function isTypingTarget(target) {
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

  useEffect(() => {
    if (disabled || !Array.isArray(sequence) || sequence.length === 0) return;

    const normalized = sequence.map((key) => key.toLowerCase());
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
  }, [disabled, onTrigger, sequence]);
}
