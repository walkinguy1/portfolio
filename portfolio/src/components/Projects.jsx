import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import TrackVisibility from "react-on-screen";
import 'animate.css';

const PROJECTS = [
  {
    title: "Car Price Prediction Model",
    description: "ML model that predicts car prices based on features like brand, mileage, fuel type, and age using regression techniques in Python.",
    tech: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    imgUrl: projImg1,
    githubUrl: "https://github.com/walkinguy1",
    liveUrl: null,
  },
  {
    title: "PyGame Mini-Game Library",
    description: "A collection of classic mini-games — Snake, Pong, Breakout — built from scratch using Python's Pygame library with custom game logic.",
    tech: ["Python", "Pygame", "OOP"],
    imgUrl: projImg2,
    githubUrl: "https://github.com/walkinguy1",
    liveUrl: null,
  },
  {
    title: "Food Ordering Website",
    description: "Full-stack food ordering platform with user authentication, cart management, and order tracking — powered by React on the frontend and FastAPI on the backend.",
    tech: ["React", "FastAPI", "Python", "SQL"],
    imgUrl: projImg3,
    githubUrl: "https://github.com/walkinguy1",
    liveUrl: null,
  },
];

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
                      <ProjectCard key={index} {...project} />
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