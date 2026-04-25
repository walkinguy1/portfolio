import { useState, useEffect } from "react";

import { ThemeProvider }  from './Themecontext'
import { NavBar }         from './components/nav.jsx'
import { Banner }         from './components/banner.jsx'
import { About }          from './components/about.jsx'
import { Skills }         from './components/skills.jsx'
import { Projects }       from './components/Projects.jsx'
import { Contact }        from './components/contact.jsx'
import { Footer }         from './components/footer.jsx'
import { Marquee }        from './components/Marquee.jsx'
import { Cursor }         from './components/Cursor.jsx'

import { HelmetProvider } from 'react-helmet-async'

import SnakeGame from "./games/SnakeGame";
import useKonami from "./hooks/useKonami";
import CommandPalette from "./components/CommandPalette";

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  // Snake state
  const [snakeOpen, setSnakeOpen] = useState(false);

  // Command palette state
  const [cmdOpen, setCmdOpen] = useState(false);

  // Konami trigger
  useKonami(() => {
    setSnakeOpen(true);
  });

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e) => {
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
  }, []);

  // Scroll helper
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Command actions
  const actions = [
    { label: "Go to Home", action: () => scrollTo("home") },
    { label: "Go to About", action: () => scrollTo("about") },
    { label: "Go to Skills", action: () => scrollTo("skills") },
    { label: "Go to Projects", action: () => scrollTo("projects") },
    { label: "Go to Contact", action: () => scrollTo("contact") },

    { label: "Play Snake", action: () => setSnakeOpen(true) },

    {
      label: "Toggle Theme",
      action: () => {
        document.documentElement.classList.toggle("dark");
      }
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
    <HelmetProvider>
      <ThemeProvider>
        <div className="App">

          <Cursor />

          <NavBar />

          <div className="main-bg-wrapper">

            <div id="home">
              <Banner />
            </div>

            <Marquee />

            <div id="about">
              <About />
            </div>

            <Marquee />

            <div id="skills">
              <Skills />
            </div>

            <Marquee />

            <div id="projects">
              <Projects />
            </div>

            <div id="contact">
              <Contact />
            </div>

          </div>

          <Footer />

          {/* Snake Game */}
          <SnakeGame
            open={snakeOpen}
            onClose={() => setSnakeOpen(false)}
          />

          {/* Command Palette */}
          <CommandPalette
            open={cmdOpen}
            onClose={() => setCmdOpen(false)}
            actions={actions}
          />

        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;