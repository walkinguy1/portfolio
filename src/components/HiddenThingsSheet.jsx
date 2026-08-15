import { useState, useEffect } from 'react';
import styles from './HiddenThingsSheet.module.css';

export const HiddenThingsSheet = ({ gamesPlayed }) => {
  const [open, setOpen] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (open) {
      setHighScore(parseInt(localStorage.getItem('origami-snake-high') || '0', 10));
    } else {
      setHighScore(parseInt(localStorage.getItem('origami-snake-high') || '0', 10)); // initial load
    }
  }, [open]);

  return (
    <>
      <div className={styles.easterEggFab} onClick={() => setOpen(true)} title="Hidden things">
        ?
      </div>
      
      {highScore > 0 && !open && (
        <div className={styles.snakeHighScoreCorner}>BEST: {highScore}</div>
      )}

      {open && (
        <div className={styles.hiddenThingsOverlay} onClick={() => setOpen(false)}>
          <div className={styles.hiddenThingsSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <h3>Hidden Things</h3>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
            <ul className={styles.sheetList}>
              <li>
                <strong>Command Palette:</strong> <code>CTRL + K</code> or <code>/</code>
              </li>
              <li>
                <strong>Snake Game:</strong> <code>↑ ↑ ↓ ↓ ← → ← → B A</code>
              </li>
              <li>
                <strong>Minesweeper:</strong> <code>Type 'm' 'i' 'n' 'e'</code>
              </li>
              {gamesPlayed >= 3 ? (
                <li>
                  <strong>Developer Terminal:</strong> <code>Type 'c' 'o' 'f' 'f' 'e' 'e'</code>
                </li>
              ) : (
                <li className={styles.lockedEgg}>
                  <span>??? (Play {3 - gamesPlayed} more {3 - gamesPlayed === 1 ? 'game' : 'games'} to unlock)</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
