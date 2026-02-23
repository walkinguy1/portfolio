import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import logo from '../assets/img/logo.png';
import { ThemeSwitch } from './Themeswitch';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled]     = useState(false);
  const [visible, setVisible]       = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setVisible(!(y > lastScrollY && y > 150));
      setLastScrollY(y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToConnect = () =>
    document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Navbar
      expand="lg"
      className={`${scrolled ? 'scrolled' : ''} ${visible ? 'nav-visible' : 'nav-hidden'}`}
    >
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Walkinguy logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon">
            <span /><span /><span />
          </span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {['home','about','skills','projects'].map(link => (
              <Nav.Link
                key={link}
                href={`#${link}`}
                className={activeLink === link ? 'active navbar-link' : 'navbar-link'}
                onClick={() => setActiveLink(link)}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </Nav.Link>
            ))}
          </Nav>

          <span className="navbar-text">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/tushar-khatiwada/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={navIcon1} alt="LinkedIn" /></a>
              <a href="https://github.com/walkinguy1"                  target="_blank" rel="noreferrer" aria-label="GitHub"><img src={navIcon2} alt="GitHub" /></a>
              <a href="https://www.instagram.com/walkinguy/"           target="_blank" rel="noreferrer" aria-label="Instagram"><img src={navIcon3} alt="Instagram" /></a>
            </div>

            <ThemeSwitch />

            <button className="vvd" onClick={scrollToConnect}>
              <span>Let's Connect</span>
            </button>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};