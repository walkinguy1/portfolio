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
import { Cursor } from './components/Cursor.jsx'

import { HelmetProvider } from 'react-helmet-async'

import SnakeGame from "./games/SnakeGame";
import MinesweeperGame from "./games/MinesweeperGame";
import useKonami from "./hooks/useKonami";
import useTypedSequence from "./hooks/useTypedSequence";
import CommandPalette from "./components/CommandPalette";

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function AppContent() {
  const { theme, toggle } = useContext(ThemeContext); 

  const [snakeOpen, setSnakeOpen] = useState(false);
  const [minesweeperOpen, setMinesweeperOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useKonami(() => {
    setSnakeOpen(true);
  }, { disabled: snakeOpen || minesweeperOpen || cmdOpen });

  useTypedSequence(["m", "i", "n", "e"], () => {
    setMinesweeperOpen(true);
  }, { disabled: snakeOpen || minesweeperOpen || cmdOpen });

  useEffect(() => {
    const handler = (e) => {
      if (snakeOpen || minesweeperOpen) return;

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
  }, [snakeOpen, minesweeperOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const actions = [
    { label: "Go to Home", action: () => scrollTo("home") },
    { label: "Go to About", action: () => scrollTo("about") },
    { label: "Go to Skills", action: () => scrollTo("skills") },
    { label: "Go to Projects", action: () => scrollTo("projects") },
    { label: "Go to Contact", action: () => scrollTo("contact") },

    {
      label: "Play Snake",
      action: () => {
        setCmdOpen(false);
        setSnakeOpen(true);
      }
    },

    {
      label: "Play Minesweeper",
      action: () => {
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
      action: () => window.open("https://github.com/yourusername", "_blank")
    },

    {
      label: "Open LinkedIn",
      action: () => window.open("https://linkedin.com/in/yourprofile", "_blank")
    },

    {
      label: "Copy Email",
      action: () => navigator.clipboard.writeText("your@email.com")
    }
  ];

  return (
    <div className="App">
      <Cursor />
      <NavBar />

      <div className="main-bg-wrapper">

        <div id="home"><Banner /></div>
        <Marquee />

        <div id="about"><About /></div>
        <Marquee />

        <div id="skills"><Skills /></div>
        <Marquee />

        <div id="projects"><Projects /></div>
        <div id="contact"><Contact /></div>

      </div>

      <Footer />

      <SnakeGame
        open={snakeOpen}
        onClose={() => setSnakeOpen(false)}
      />

      <MinesweeperGame
        open={minesweeperOpen}
        onClose={() => setMinesweeperOpen(false)}
      />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        actions={actions}
      />
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