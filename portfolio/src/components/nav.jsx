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
  const travelRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    /* The bar hides on scroll-down and reappears on scroll-up. Comparing
       y against the previous y directly made it flicker: momentum
       scrolling, trackpads and fractional device pixels (very common when
       the browser is zoomed) deliver tiny back-and-forth deltas, and every
       sign flip retriggered the 0.32s transform transition.

       Two guards fix it: ignore movements below DIRECTION_THRESHOLD, and
       only record lastScrollY once a move actually clears that threshold,
       so slow drift accumulates instead of being swallowed frame by frame. */
    const DIRECTION_THRESHOLD = 10; // px of sustained travel before we commit
    const HIDE_AFTER = 150;         // don't hide while still near the top

    const update = () => {
      tickingRef.current = false;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastScrollYRef.current;
      // Always track the real position, so the reference can never go stale.
      lastScrollYRef.current = y;

      setScrolled(y > 50);

      if (y <= HIDE_AFTER) {
        travelRef.current = 0;
        setVisible(true);
        return;
      }
      if (delta === 0) return;

      // Accumulate travel in the current direction; a reversal starts a fresh
      // tally. Jitter therefore cancels itself out instead of toggling the bar,
      // while a deliberate scroll clears the threshold within a frame or two.
      if (delta > 0 !== travelRef.current > 0) travelRef.current = 0;
      travelRef.current += delta;

      if (travelRef.current > DIRECTION_THRESHOLD) {
        setVisible(false);
        travelRef.current = 0;
      } else if (travelRef.current < -DIRECTION_THRESHOLD) {
        setVisible(true);
        travelRef.current = 0;
      }
    };

    // rAF-throttle: scroll fires far more often than the screen repaints.
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // No deps needed — refs are always current

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
            <div className={`social-icon ${styles.navSocial}`}>
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
