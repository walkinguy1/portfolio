import { useState, useEffect } from 'react';
import styles from './TerminalEgg.module.css';

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
    <div className={styles.cmdOverlay} onClick={onClose} style={{ zIndex: 100000 }}>
      <div className={styles.cmdModal} onClick={e => e.stopPropagation()}>
        <div className={styles.terminalHeader}>
          <span className={styles.terminalTitle}>terminal.exe</span>
          <button className={styles.terminalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.terminalContent}>
          {lines.map((l, index) => (
            <div key={index}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
