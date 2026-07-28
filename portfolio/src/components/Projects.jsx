import { useCallback, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "../data/portfolioData";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import { Reveal } from './Reveal';
import InfiniteMenu from './InfiniteMenu';
import styles from './Projects.module.css';

// Map image keys from the data model to actual imports
const IMG_MAP = { projImg1, projImg2, projImg3 };

// Module scope keeps the identity stable — InfiniteMenu tears down and
// rebuilds its whole WebGL scene whenever `items` changes identity.
const MENU_ITEMS = PROJECTS.map(project => ({
  image: IMG_MAP[project.imgKey],
  link: project.liveUrl || project.githubUrl,
  title: project.title,
  // The overlay has room for a line, not the full card copy
  description: `${project.description.split('. ')[0]}.`,
}));

// The component throws without a WebGL2 context; fall back to the cards alone.
const HAS_WEBGL2 =
  typeof document !== 'undefined' &&
  (() => {
    try {
      return !!document.createElement('canvas').getContext('webgl2');
    } catch {
      return false;
    }
  })();


export const Projects = () => {
  // If WebGL setup fails on a visitor's machine, drop the globe and its
  // reserved height — the cards below are the real content anyway.
  const [globeFailed, setGlobeFailed] = useState(false);
  const handleGlobeError = useCallback(() => setGlobeFailed(true), []);

  return (
    <section className={styles.project} id="projects">
      <Container>
        <Row>
          <Col xs={12}>
            <Reveal>

              <div className="section-header">
                <span className="section-tag">— What I've Built</span>
                <h2>Projects</h2>
                <p>
                  A handful of things I've designed, coded, and shipped — ranging from
                  machine learning experiments to full-stack web apps.
                </p>
              </div>

              {HAS_WEBGL2 && !globeFailed && (
                <div className={styles.projectOrbit}>
                  <InfiniteMenu items={MENU_ITEMS} onError={handleGlobeError} />
                </div>
              )}

              <Row className={styles.projectCardsRow}>
                {PROJECTS.map((project, index) => (
                  <ProjectCard key={index} {...project} imgUrl={IMG_MAP[project.imgKey]} />
                ))}
              </Row>

              <div className={styles.projectsFooterNote}>
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

            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
};