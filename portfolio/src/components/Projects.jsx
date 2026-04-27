import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "../data/portfolioData";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import TrackVisibility from "react-on-screen";
import 'animate.css';

// Map image keys from the data model to actual imports
const IMG_MAP = { projImg1, projImg2, projImg3 };


export const Projects = () => {
  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>

                  <div className="section-header">
                    <span className="section-tag">— What I've Built</span>
                    <h2>Projects</h2>
                    <p>
                      A handful of things I've designed, coded, and shipped — ranging from
                      machine learning experiments to full-stack web apps.
                    </p>
                  </div>

                  <Row className="project-cards-row">
                    {PROJECTS.map((project, index) => (
                      <ProjectCard key={index} {...project} imgUrl={IMG_MAP[project.imgKey]} />
                    ))}
                  </Row>

                  <div className="projects-footer-note">
                    <p>More experiments and works-in-progress live on my GitHub.</p>
                    <a
                      href="https://github.com/walkinguy1"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost-cta"
                    >
                      View All on GitHub ↗
                    </a>
                  </div>

                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};