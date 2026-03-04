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
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <div className="App">
          <Cursor />
          <NavBar />
          <div className="main-bg-wrapper">
            <Banner />
            <Marquee />
            <About />
            <Marquee />
            <Skills />
            <Marquee />
            <Projects />
            <Contact />
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;