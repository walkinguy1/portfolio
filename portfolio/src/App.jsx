import { Container } from 'react-bootstrap'
import './App.css'
import { NavBar } from './components/nav.jsx'
import { Banner } from './components/banner.jsx'
import { About } from './components/about.jsx';
import { Skills } from './components/skills.jsx'
import { Projects } from './components/Projects.jsx'
import { Contact } from './components/contact.jsx';
import { Footer } from './components/footer.jsx'
import { HelmetProvider } from 'react-helmet-async';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <NavBar />
        <div className="main-bg-wrapper">
          <Banner />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </div>
        
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App
