import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import headerImg from '../assets/img/header-img.png';
import { Helmet } from 'react-helmet-async';
import { ParticleCanvas } from './ParticleCanvas';
import styles from './banner.module.css';

const ROLES = ['Full Stack Dev', 'ML Enthusiast', 'Problem Solver', 'CS Student'];

const AnimatedName = ({ text, delay = 0 }) => (
  <span className="anim-word">
    {text.split('').map((char, i) => (
      <span key={i} className="anim-char" style={{ animationDelay: `${delay + i * 0.04}s` }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </span>
);

export const Banner = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout;
    if (!isDeleting) {
      if (charIndex < currentRole.length) {
        timeout = setTimeout(() => { setDisplayed(currentRole.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => { setDisplayed(currentRole.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }, 45);
      } else {
        timeout = setTimeout(() => { setIsDeleting(false); setRoleIndex(i => (i + 1) % ROLES.length); }, 0);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const scrollToConnect = () =>
    document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className={styles.banner} id="home">
      <Helmet>
        <title>Tushar Khatiwada | Full Stack Developer</title>
        <meta name="description" content="Portfolio of Tushar Khatiwada — CS student, web developer and ML enthusiast from Kathmandu, Nepal." />
        <meta property="og:title" content="Tushar Khatiwada Portfolio" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Particle field — absolute inside banner, scoped to this section */}
      <ParticleCanvas />

      <div className={`${styles.bannerGlow} ${styles.bannerGlow1}`} aria-hidden="true" />
      <div className={`${styles.bannerGlow} ${styles.bannerGlow2}`} aria-hidden="true" />
      <div className={styles.bannerAccentBar} aria-hidden="true" />

      <Container className={styles.bannerContainer}>
        <Row className="align-items-center banner-row">
          <Col xs={12} md={6} xl={7} className="banner-text-col">
            <div className={styles.bannerEyebrow}><span className={styles.eyebrowDot} />Kathmandu, Nepal</div>
            <div className={styles.availabilityPill} role="status" aria-live="polite">
              <span className={styles.availabilityDot} />
              <span>Open to internships &amp; freelance</span>
            </div>
            <h1 className={styles.bannerHeadline}>
              <span className={styles.headlineHi}>Hi, I'm</span>
              <span className={styles.headlineName}>
                <AnimatedName text="Tushar" delay={0.1} />
                <br />
                <AnimatedName text="Khatiwada" delay={0.4} />
              </span>
            </h1>
            <div className={styles.bannerRoleWrapper} aria-live="polite">
              <span className={styles.roleBracket} aria-hidden="true">[</span>
              <span className={styles.bannerRoleType}>{displayed}<span className={styles.cursorBlink} aria-hidden="true">_</span></span>
              <span className={styles.roleBracket} aria-hidden="true">]</span>
            </div>
            <p className={styles.bannerDesc}>
              Also known as <strong>Walkinguy</strong>. I build web apps and machine
              learning tools, mostly with React, Django and Python.
            </p>
            <div className={styles.bannerCtaRow}>
              <button className="btn-primary-cta" onClick={scrollToConnect}>
                Let's Connect <span className="cta-arrow" aria-hidden="true">→</span>
              </button>
              <a href="https://github.com/walkinguy1" target="_blank" rel="noreferrer" className="btn-outline-cta">
                GitHub ↗
              </a>
            </div>
          </Col>
          <Col xs={12} md={6} xl={5} className={styles.bannerImgCol}>
            <div className={styles.bannerImgWrapper}>
              <div className={`${styles.imgFrameCorner} ${styles.imgFrameCornerTl}`} aria-hidden="true" />
              <div className={`${styles.imgFrameCorner} ${styles.imgFrameCornerTr}`} aria-hidden="true" />
              <div className={`${styles.imgFrameCorner} ${styles.imgFrameCornerBl}`} aria-hidden="true" />
              <div className={`${styles.imgFrameCorner} ${styles.imgFrameCornerBr}`} aria-hidden="true" />
              <img src={headerImg} alt="Tushar Khatiwada" loading="eager" />
            </div>
          </Col>
        </Row>
        <div className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollLine} /><span>scroll</span>
        </div>
      </Container>
    </section>
  );
};