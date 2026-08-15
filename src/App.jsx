import { useState, useEffect, useContext } from "react";

import { ThemeProvider, ThemeContext } from './Themecontext'

import { NavBar } from './components/nav.jsx'
import { Banner } from './components/banner.jsx'
import { About } from './components/about.jsx'
import { Skills } from './components/skills.jsx'
import { Projects } from './components/Projects.jsx'
import { Contact } from './components/contact.jsx'
import { Footer } from './components/footer.jsx'
import { Marquee } from './components/Marquee.jsx'
import { HiddenThingsSheet } from './components/HiddenThingsSheet.jsx'
import { TerminalEgg } from './components/TerminalEgg.jsx'
import { MetricsStrip } from './components/MetricsStrip.jsx'
import { TerminalPortfolio } from './components/TerminalPortfolio.jsx'

import { HelmetProvider } from 'react-helmet-async'

import SnakeGame from "./games/SnakeGame";
import MinesweeperGame from "./games/MinesweeperGame";
import useTypedSequence, { isTypingTarget } from "./hooks/useTypedSequence";
import CommandPalette from "./components/CommandPalette";
import { IDENTITY } from "./data/portfolioData";

import './App.css'

function AppContent() {
  const { theme, toggle } = useContext(ThemeContext); 

  const [snakeOpen, setSnakeOpen] = useState(false);
  const [minesweeperOpen, setMinesweeperOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [cliMode, setCliMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('cli') === '1';
  });
  const [gamesPlayed, setGamesPlayed] = useState(() => 
    parseInt(localStorage.getItem('portfolio-games-played') || '0', 10)
  );

  const incrementGamesPlayed = () => {
    setGamesPlayed(p => {
      const next = p + 1;
      localStorage.setItem('portfolio-games-played', String(next));
      return next;
    });
  };

  // Snake opens from either the handle or the Konami code
  const openSnake = () => {
    incrementGamesPlayed();
    setSnakeOpen(true);
  };
  const eggsDisabled = { disabled: snakeOpen || minesweeperOpen || cmdOpen || terminalOpen };

  useTypedSequence([..."walkinguy"], openSnake, eggsDisabled);
  useTypedSequence(
    ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"],
    openSnake,
    eggsDisabled,
  );

  useTypedSequence(["m", "i", "n", "e"], () => {
    incrementGamesPlayed();
    setMinesweeperOpen(true);
  }, { disabled: snakeOpen || minesweeperOpen || cmdOpen || terminalOpen });

  useTypedSequence(["c", "o", "f", "f", "e", "e"], () => {
    if (gamesPlayed >= 3) {
      setTerminalOpen(true);
    }
  }, { disabled: snakeOpen || minesweeperOpen || cmdOpen || terminalOpen });

  useEffect(() => {
    const handler = (e) => {
      if (snakeOpen || minesweeperOpen || terminalOpen) return;
      if (isTypingTarget(e.target)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }

      if (e.key === "/") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [snakeOpen, minesweeperOpen, terminalOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const actions = [
    { label: "Go to Home", action: () => scrollTo("home") },
    { label: "Go to About", action: () => scrollTo("about") },
    { label: "Go to Skills", action: () => scrollTo("skills") },
    { label: "Go to Projects", action: () => scrollTo("projects") },
    { label: "Go to Contact", action: () => scrollTo("connect") },

    {
      label: "Play Snake",
      action: () => {
        incrementGamesPlayed();
        setCmdOpen(false);
        setSnakeOpen(true);
      }
    },

    {
      label: "Play Minesweeper",
      action: () => {
        incrementGamesPlayed();
        setCmdOpen(false);
        setMinesweeperOpen(true);
      }
    },

    {
      label: `Toggle Theme (${theme})`,
      action: () => toggle()
    },

    {
      label: "Open GitHub",
      action: () => window.open(IDENTITY.github, "_blank")
    },

    {
      label: "Open LinkedIn",
      action: () => window.open(IDENTITY.linkedin, "_blank")
    },

    {
      label: "Open Instagram",
      action: () => window.open(IDENTITY.instagram, "_blank")
    },

    {
      label: "Copy Email",
      action: () => navigator.clipboard.writeText(IDENTITY.email)
    },

    {
      label: cliMode ? "Switch to Visual Mode" : "Switch to CLI Mode",
      action: () => {
        setCmdOpen(false);
        setCliMode(m => !m);
      }
    }
  ];

  // CLI Mode — full-screen terminal replaces the visual portfolio
  if (cliMode) {
    return (
      <div className="App">
        <TerminalPortfolio
          onExit={() => setCliMode(false)}
          toggleTheme={toggle}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <NavBar />
      </header>

      {/* CLI mode toggle FAB */}
      <button
        className="cli-toggle-fab"
        onClick={() => setCliMode(true)}
        title="Switch to CLI mode"
        aria-label="Switch to terminal portfolio mode"
      >
        &lt;/&gt;
      </button>

      <main className="main-bg-wrapper">

        {/* Each section carries its own id — no wrapper ids, or the
            anchors resolve to an empty div instead of the section. */}
        <Banner />
        <Marquee />

        <About />
        <Marquee reverse light />

        <Skills />
        <Marquee />

        <Projects />
        <Contact />

      </main>

      <MetricsStrip />
      <footer>
        <Footer />
      </footer>

      <SnakeGame
        open={snakeOpen}
        onClose={() => setSnakeOpen(false)}
      />

      <MinesweeperGame
        open={minesweeperOpen}
        onClose={() => setMinesweeperOpen(false)}
      />

      <TerminalEgg 
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        actions={actions}
      />

      <HiddenThingsSheet gamesPlayed={gamesPlayed} />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;