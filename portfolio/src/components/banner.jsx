import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import headerImg from '../assets/img/header-img.png';
import { Helmet } from 'react-helmet-async';

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
        // Still typing — add next character
        timeout = setTimeout(() => {
          setDisplayed(currentRole.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        }, 80);
      } else {
        // Fully typed — pause then start deleting
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (charIndex > 0) {
        // Still deleting — remove last character
        timeout = setTimeout(() => {
          setDisplayed(currentRole.slice(0, charIndex - 1));
          setCharIndex(c => c - 1);
        }, 45);
      } else {
        // Fully deleted — defer state reset to avoid synchronous setState in effect
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex(i => (i + 1) % ROLES.length);
        }, 0);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const scrollToConnect = () => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="banner" id="home">
      <Helmet>
        <title>Tushar Khatiwada | Full Stack Developer</title>
        <meta name="description" content="Portfolio of Tushar Khatiwada — CS student, web developer and ML enthusiast from Kathmandu, Nepal." />
        <meta property="og:title" content="Tushar Khatiwada Portfolio" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="banner-glow banner-glow--1" aria-hidden="true" />
      <div className="banner-glow banner-glow--2" aria-hidden="true" />

      {/* Bright accent bar top */}
      <div className="banner-accent-bar" aria-hidden="true" />

      <Container className="banner-container">
        <Row className="align-items-center banner-row">
          <Col xs={12} md={6} xl={7} className="banner-text-col">

            <div className="banner-eyebrow">
              <span className="eyebrow-dot" />
              Kathmandu, Nepal
            </div>

            <h1 className="banner-headline">
              <span className="headline-hi">Hi, I'm</span>
              <span className="headline-name">
                <AnimatedName text="Tushar" delay={0.1} />
                <br />
                <AnimatedName text="Khatiwada" delay={0.4} />
              </span>
            </h1>

            <div className="banner-role-wrapper" aria-live="polite" aria-label={`Role: ${displayed}`}>
              <span className="role-bracket" aria-hidden="true">[</span>
              <span className="banner-role-type">
                {displayed}
                <span className="cursor-blink" aria-hidden="true">_</span>
              </span>
              <span className="role-bracket" aria-hidden="true">]</span>
            </div>

            <p className="banner-desc">
              Also known as <strong>Walkinguy</strong> — weaving together web, ML,
              and whatever interesting problem lands on my desk next.
            </p>

            <div className="banner-cta-row">
              <button className="btn-primary-cta" onClick={scrollToConnect}>
                Let's Connect <span className="cta-arrow" aria-hidden="true">→</span>
              </button>
              <a
                href="https://github.com/walkinguy1"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-cta"
              >
                GitHub ↗
              </a>
            </div>

          </Col>

          <Col xs={12} md={6} xl={5} className="banner-img-col">
            <div className="banner-img-wrapper">
              <div className="img-frame-corner img-frame-corner--tl" aria-hidden="true" />
              <div className="img-frame-corner img-frame-corner--tr" aria-hidden="true" />
              <div className="img-frame-corner img-frame-corner--bl" aria-hidden="true" />
              <div className="img-frame-corner img-frame-corner--br" aria-hidden="true" />
              <img src={headerImg} alt="Tushar Khatiwada" loading="eager" />
            </div>
          </Col>
        </Row>

        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-line" />
          <span>scroll</span>
        </div>
      </Container>
    </section>
  );
};
