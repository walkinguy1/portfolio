import { Container, Row, Col } from "react-bootstrap";
import aboutImg from "../assets/img/about-img.png";
import { Reveal } from './Reveal';
import styles from './about.module.css';

export const About = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.about} id="about">
      <Container>
        <Row className="align-items-center g-5">
          <Col xs={12} md={6}>
            <Reveal className={styles.aboutImgWrap} animation="reveal-zoom">
              <div className={styles.aboutImgAccent} aria-hidden="true" />
              <img src={aboutImg} alt="Tushar Khatiwada" loading="lazy" />
            </Reveal>
          </Col>

          <Col xs={12} md={6}>
            <Reveal>
              <div className="section-header section-header--left">
                <span className="section-tag">— Who I Am</span>
                <h2>About Me</h2>
              </div>

              <p className={styles.aboutBody}>
                I'm a 3rd year Computer Engineering student at Himalaya College of Engineering,
                Lalitpur. My main interests are web development and machine learning — but I'm
                genuinely curious about most things in tech and love diving into new areas
                whenever a good problem comes along.
              </p>
              <p className={styles.aboutBody}>
                Outside of code, you'll find me as <strong>Walkinguy</strong> across online
                spaces — a handle that kind of captures how I move through learning: one step
                at a time, persistently.
              </p>

              <div className={styles.aboutStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>3rd</span>
                  <span className={styles.statText}>Year Computer Engineering Student</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>9+</span>
                  <span className={styles.statText}>Projects Shipped</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>2</span>
                  <span className={styles.statText}>Core Domains</span>
                </div>
              </div>

              <div className={styles.aboutCtaRow}>
                <button className="btn-primary-cta" onClick={scrollToProjects}>
                  See My Work ↓
                </button>
                <a
                  href="https://github.com/walkinguy1"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-cta"
                  aria-label="View GitHub profile"
                >
                  GitHub ↗
                </a>
              </div>
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
