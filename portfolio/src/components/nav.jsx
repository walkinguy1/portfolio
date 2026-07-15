import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect, useRef } from 'react';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import logo from '../assets/img/logo.png';
import { ThemeSwitch } from './Themeswitch';
import styles from './nav.module.css';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled]     = useState(false);
  const [visible, setVisible]       = useState(true);
  // Use ref to avoid stale closure in scroll handler
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setVisible(!(y > lastScrollYRef.current && y > 150));
      lastScrollYRef.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // No deps needed — ref is always current

  const scrollToConnect = () =>
    document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Navbar
      expand="lg"
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${visible ? styles.navVisible : styles.navHidden}`}
    >
      <Container>
        <Navbar.Brand href="#home" className={styles.navbarBrand}>
          <img src={logo} alt="Walkinguy logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles.navbarToggler}>
          <span className={styles.navbarTogglerIcon}>
            <span /><span /><span />
          </span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav" className={styles.navbarCollapse}>
          <Nav className={styles.meAuto}>
            {['home','about','skills','projects'].map(link => (
              <Nav.Link
                key={link}
                href={`#${link}`}
                className={`${styles.navbarLink} ${activeLink === link ? styles.active : ''}`}
                onClick={() => setActiveLink(link)}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </Nav.Link>
            ))}
          </Nav>

          <span className={styles.navbarText}>
            <div className={styles.socialIcon}>
              <a href="https://www.linkedin.com/in/tushar-khatiwada/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={navIcon1} alt="LinkedIn" /></a>
              <a href="https://github.com/walkinguy1"                  target="_blank" rel="noreferrer" aria-label="GitHub"><img src={navIcon2} alt="GitHub" /></a>
              <a href="https://www.instagram.com/walkinguy/"           target="_blank" rel="noreferrer" aria-label="Instagram"><img src={navIcon3} alt="Instagram" /></a>
            </div>

            <ThemeSwitch />

            <button className={styles.vvd} onClick={scrollToConnect}>
              <span>Let's Connect</span>
            </button>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
