import { useCallback, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "../data/portfolioData";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import { Reveal } from './Reveal';
import InfiniteMenu from './InfiniteMenu';
import useMediaQuery from '../hooks/useMediaQuery';
import styles from './Projects.module.css';

// Map image keys from the data model to actual imports
const IMG_MAP = { projImg1, projImg2, projImg3 };

// Module scope keeps the identity stable — InfiniteMenu tears down and
// rebuilds its whole WebGL scene whenever `items` changes identity.
const MENU_ITEMS = PROJECTS.map(project => ({
  image: IMG_MAP[project.imgKey],
  link: project.liveUrl || project.githubUrl,
  title: project.title,
  description: project.description,
  tech: project.tech,
  linkLabel: project.liveUrl ? 'Visit site' : 'View source',
}));

// Mouse-driven screens only. A WebGL globe running a 60fps render loop is
// exactly the work a phone shouldn't be doing, so this gates mounting rather
// than visibility — `pointer: fine` keeps it off touch tablets too.
const DESKTOP_QUERY = '(min-width: 1024px) and (pointer: fine)';

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
  // If WebGL setup fails on a visitor's machine, fall back to the card list.
  const [globeFailed, setGlobeFailed] = useState(false);
  const handleGlobeError = useCallback(() => setGlobeFailed(true), []);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const showGlobe = isDesktop && HAS_WEBGL2 && !globeFailed;

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

              {showGlobe ? (
                <>
                  <div className={styles.projectOrbit}>
                    <InfiniteMenu items={MENU_ITEMS} onError={handleGlobeError} />
                  </div>

                  {/* The globe is a canvas — invisible to crawlers and screen
                      readers. Same content, off-screen, so neither loses it. */}
                  <ul className={styles.projectsSrList}>
                    {PROJECTS.map(project => (
                      <li key={project.slug}>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <p>Built with: {project.tech.join(', ')}.</p>
                        <a href={project.liveUrl || project.githubUrl}>
                          {project.liveUrl ? `Visit ${project.title}` : `${project.title} source on GitHub`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Row className={styles.projectCardsRow}>
                  {PROJECTS.map(project => (
                    <ProjectCard key={project.slug} {...project} imgUrl={IMG_MAP[project.imgKey]} />
                  ))}
                </Row>
              )}

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