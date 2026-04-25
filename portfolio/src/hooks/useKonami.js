import { useEffect } from "react";

export default function useKonami(onTrigger) {
  useEffect(() => {
    const sequence = [
      "ArrowUp","ArrowUp",
      "ArrowDown","ArrowDown",
      "ArrowLeft","ArrowRight",
      "ArrowLeft","ArrowRight",
      "b","a"
    ];

    let index = 0;

    const handler = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (key === sequence[index]) {
        index++;
        if (index === sequence.length) {
          onTrigger();
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onTrigger]);
}