import { useEffect, useState, useMemo, useRef } from "react";

export default function CommandPalette({ open, onClose, actions }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const selectedRef = useRef(0);

  const filtered = useMemo(() => {
    return actions.filter((a) =>
      a.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, actions]);

  // Keep ref in sync (avoids stale closure)
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Keyboard handling (NO setState in effect body directly)
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") return onClose();

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) =>
          filtered.length ? (prev + 1) % filtered.length : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[selectedRef.current];
        if (item) {
          item.action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, onClose]);

  // Reset safely when opening (DEFERRED → no warning)
  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      setQuery("");
      setSelected(0);
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="cmd-overlay">
      <div className="cmd-modal" role="dialog" aria-modal="true">
          <input
            autoFocus
            placeholder="Type a command..."
            className="cmd-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-controls="command-list"
            aria-expanded={open}
          />

        <div className="cmd-list" role="listbox" id="command-list">
          {filtered.length === 0 && (
            <div className="cmd-empty">No results</div>
          )}

          {filtered.map((item, i) => (
            <div
              key={item.label}
              id={`command-option-${i}`}
              role="option"
              aria-selected={i === selected}
              className={`cmd-item ${i === selected ? "active" : ""}`}
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}