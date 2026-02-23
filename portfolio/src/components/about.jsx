import { Container, Row, Col } from "react-bootstrap";
import aboutImg from "../assets/img/about-img.png";
import TrackVisibility from 'react-on-screen';
import 'animate.css';

export const About = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="about" id="about">
      <Container>
        <Row className="align-items-center g-5">
          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={`about-img-wrap ${isVisible ? "animate__animated animate__zoomIn" : ""}`}>
                  <div className="about-img-accent" aria-hidden="true" />
                  <img src={aboutImg} alt="About Tushar Khatiwada" loading="lazy" />
                </div>
              )}
            </TrackVisibility>
          </Col>

          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <div className="section-header section-header--left">
                    <span className="section-tag">— Who I Am</span>
                    <h2>About Me</h2>
                  </div>

                  <p className="about-body">
                    I'm a 3rd year Computer Engineering student at Himalaya College of Engineering,
                    Lalitpur. My main interests are web development and machine learning — but I'm
                    genuinely curious about most things in tech and love diving into new areas
                    whenever a good problem comes along.
                  </p>
                  <p className="about-body">
                    Outside of code, you'll find me as <strong>Walkinguy</strong> across online
                    spaces — a handle that kind of captures how I move through learning: one step
                    at a time, persistently.
                  </p>

                  <div className="about-stats">
                    <div className="stat-item">
                      <span className="stat-number">3rd</span>
                      <span className="stat-text">Year CE Student</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">3+</span>
                      <span className="stat-text">Projects Shipped</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">2</span>
                      <span className="stat-text">Core Domains</span>
                    </div>
                  </div>

                  <button className="btn-primary-cta" onClick={scrollToProjects}>
                    See My Work ↓
                  </button>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};