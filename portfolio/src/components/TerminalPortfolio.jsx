/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import { IDENTITY, PROJECTS, SKILL_TIERS } from '../data/portfolioData';
import styles from './TerminalPortfolio.module.css';

const PROMPT = `${IDENTITY.handle}@portfolio:~$ `;

const HELP_TEXT = `Available commands:
  whoami          — who is this person?
  about           — detailed bio
  ls projects/    — list all projects
  cat projects/<slug>  — project details
  skills          — tech stack breakdown
  contact         — contact info
  open github     — open GitHub profile
  open linkedin   — open LinkedIn profile
  open instagram  — open Instagram profile
  copy email      — copy email to clipboard
  help            — show this message
  theme           — toggle light/dark mode
  clear           — clear terminal
  exit            — back to visual portfolio

Tab to autocomplete • ↑↓ for history`;

const COMMANDS = ['whoami', 'about', 'ls projects/', 'skills', 'contact', 'open github', 'open linkedin', 'open instagram', 'copy email', 'help', 'theme', 'clear', 'exit'];

function processCommand(input, toggleTheme) {
  const cmd = input.trim().toLowerCase();

  if (cmd === 'help' || cmd === '?') {
    return HELP_TEXT;
  }

  if (cmd === 'whoami') {
    return `${IDENTITY.name} — ${IDENTITY.role}
📍 ${IDENTITY.location}
🎓 ${IDENTITY.year} @ ${IDENTITY.university}
🔗 ${IDENTITY.github}`;
  }

  if (cmd === 'about') {
    return IDENTITY.bio.join('\n\n');
  }

  if (cmd === 'ls projects/' || cmd === 'ls projects') {
    const maxLen = Math.max(...PROJECTS.map(p => p.slug.length));
    return PROJECTS.map(
      p => `  ${p.slug.padEnd(maxLen + 2)}${p.tech.slice(0, 3).join(', ')}`
    ).join('\n');
  }

  if (cmd.startsWith('cat projects/')) {
    const slug = cmd.replace('cat projects/', '').replace('/README.md', '').trim();
    const project = PROJECTS.find(p => p.slug === slug);
    if (!project) {
      return `cat: projects/${slug}: No such file or directory\nTry: ls projects/`;
    }
    return `╭─────────────────────────────────────╮
│ ${project.title.padEnd(36)}│
╰─────────────────────────────────────╯

${project.description}

Tech: ${project.tech.join(' • ')}
GitHub: ${project.githubUrl}${project.liveUrl ? `\nLive: ${project.liveUrl}` : ''}`;
  }

  if (cmd === 'skills') {
    return SKILL_TIERS.map(tier =>
      `── ${tier.tier} ──\n${tier.skills.map(s => `  • ${s.name} (${s.category})`).join('\n')}`
    ).join('\n\n');
  }

  if (cmd === 'contact') {
    return `📧 Email:     ${IDENTITY.email}
🔗 GitHub:    ${IDENTITY.github}
💼 LinkedIn:  ${IDENTITY.linkedin}
📸 Instagram: ${IDENTITY.instagram}

Feel free to reach out — I'm open to internships, freelance, and collaborating on interesting projects.`;
  }

  if (cmd === 'theme' || cmd === 'theme toggle') {
    if (toggleTheme) toggleTheme();
    return 'Theme toggled ✓';
  }

  if (cmd === 'clear') {
    return '__CLEAR__';
  }

  if (cmd === 'exit') {
    return '__EXIT__';
  }

  if (cmd === 'open github') {
    window.open(IDENTITY.github, '_blank');
    return `Opening ${IDENTITY.github} ...`;
  }
  if (cmd === 'open linkedin') {
    window.open(IDENTITY.linkedin, '_blank');
    return `Opening ${IDENTITY.linkedin} ...`;
  }
  if (cmd === 'open instagram') {
    window.open(IDENTITY.instagram, '_blank');
    return `Opening ${IDENTITY.instagram} ...`;
  }
  if (cmd === 'copy email') {
    navigator.clipboard?.writeText(IDENTITY.email);
    return `✓ Copied ${IDENTITY.email} to clipboard`;
  }

  if (cmd === '') {
    return '';
  }

  // Easter eggs
  if (cmd === 'sudo rm -rf /') {
    return '🔥 Nice try. This portfolio is indestructible.';
  }
  if (cmd === 'coffee' || cmd === 'brew coffee') {
    return '☕ Brewing... done. Caffeine levels nominal.';
  }
  if (cmd === 'gae') {
    return 'no u';
  }
  if (cmd === 'hello') {
    return 'yes yes hello this is a human speaking';
  }

  return `command not found: ${cmd}\nType 'help' for available commands.`;
}

export const TerminalPortfolio = ({ onExit, toggleTheme }) => {
  const [history, setHistory] = useState([
    { type: 'output', text: `Welcome to walkinguy's portfolio terminal v1.0.0\nType 'help' for available commands.\n` },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const val = input;

    // Add the prompt + input to history
    setHistory(prev => [...prev, { type: 'input', text: `${PROMPT}${val}` }]);

    if (val.trim()) {
      setCmdHistory(prev => [val, ...prev]);
    }
    setHistoryIdx(-1);

    const result = processCommand(val, toggleTheme);

    if (result === '__CLEAR__') {
      setHistory([]);
    } else if (result === '__EXIT__') {
      if (onExit) onExit();
    } else if (result) {
      setHistory(prev => [...prev, { type: 'output', text: result }]);
    }

    setInput('');
  }, [input, toggleTheme, onExit]);

  const handleKeyDown = useCallback((e) => {
    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIdx(prev => {
        const next = Math.min(prev + 1, cmdHistory.length - 1);
        if (cmdHistory[next]) setInput(cmdHistory[next]);
        return next;
      });
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIdx(prev => {
        const next = Math.max(prev - 1, -1);
        setInput(next < 0 ? '' : cmdHistory[next] || '');
        return next;
      });
    }

    // Tab completion
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.toLowerCase();
      if (!partial) return;

      // Check commands
      const cmdMatch = COMMANDS.find(c => c.startsWith(partial));
      if (cmdMatch) { setInput(cmdMatch); return; }

      // Check project slugs for cat
      if (partial.startsWith('cat projects/')) {
        const slugPartial = partial.replace('cat projects/', '');
        const match = PROJECTS.find(p => p.slug.startsWith(slugPartial));
        if (match) setInput(`cat projects/${match.slug}`);
      }
    }
  }, [input, cmdHistory]);

  return (
    <div className={styles.terminalPortfolio} onClick={() => inputRef.current?.focus()}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalDots}>
          <span className={`${styles.terminalDot} ${styles.terminalDotRed}`} onClick={onExit} />
          <span className={`${styles.terminalDot} ${styles.terminalDotYellow}`} />
          <span className={`${styles.terminalDot} ${styles.terminalDotGreen}`} />
        </div>
        <span className={styles.terminalTitle}>walkinguy@portfolio — bash</span>
        <button className={styles.terminalExitBtn} onClick={onExit}>
          ← Visual Mode
        </button>
      </div>

      <div className={styles.terminalBody} ref={scrollRef}>
        <div className={styles.terminalScanlines} aria-hidden="true" />

        {history.map((entry, i) => (
          <div
            key={i}
            className={`${styles.terminalLine} ${entry.type === 'input' ? styles.terminalLineInput : styles.terminalLineOutput}`}
          >
            <pre>{entry.text}</pre>
          </div>
        ))}

        <form className={styles.terminalInputLine} onSubmit={handleSubmit}>
          <span className={styles.terminalPrompt}>{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.terminalInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
};
