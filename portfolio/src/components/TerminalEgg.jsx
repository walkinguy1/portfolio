import { useState, useEffect } from 'react';

export const TerminalEgg = ({ open, onClose }) => {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    if (!open) {
      setLines([]);
      return;
    }
    
    const bootSequence = [
      "OS boot sequence...",
      "Loading kernel modules...",
      "Mounting visual cortices...",
      "Injecting coffee into mainframes...",
      "SUCCESS: Caffeine levels nominal.",
      "> tushar --whoami",
      "Developer, Designer, Problem Solver.",
      "> _"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose} style={{ zIndex: 100000 }}>
      <div className="cmd-modal" onClick={e => e.stopPropagation()} style={{ padding: '20px', minHeight: '300px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: '#aaa', fontSize: '12px' }}>terminal.exe</span>
          <button onClick={onClose} style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}>
          {lines.map((l, index) => (
            <div key={index}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
