import { useCallback, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS, IDENTITY } from "../data/portfolioData";
import { Reveal } from './Reveal';
import InfiniteMenu from './InfiniteMenu';
import useMediaQuery from '../hooks/useMediaQuery';
import styles from './Projects.module.css';

const MENU_ITEMS = PROJECTS.map(project => ({
  image: '',
  link: project.liveUrl || project.githubUrl,
  title: project.title,
  description: project.description,
  tech: project.tech,
  linkLabel: project.liveUrl ? 'Visit site' : 'View source',
}));

// A WebGL globe running a 60fps loop is work a phone shouldn't do, so this
// gates mounting rather than visibility — `pointer: fine` excludes touch tablets.
const DESKTOP_QUERY = '(min-width: 1024px) and (pointer: fine)';

// InfiniteMenu throws without a WebGL2 context.
const HAS_WEBGL2 =
  typeof document !== 'undefined' &&
  (() => {
    try {
      return !!document.createElement('canvas').getContext('webgl2');
    } catch {
      return false;
    }
  })();

const GLOBE_PREF_KEY = 'portfolio-projects-globe';

export const Projects = () => {
  const [globeFailed, setGlobeFailed] = useState(false);
  const [globeOn, setGlobeOn] = useState(
    () => localStorage.getItem(GLOBE_PREF_KEY) === '1'
  );

  const handleGlobeError = useCallback(() => setGlobeFailed(true), []);

  useEffect(() => {
    localStorage.setItem(GLOBE_PREF_KEY, globeOn ? '1' : '0');
  }, [globeOn]);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const canGlobe  = isDesktop && HAS_WEBGL2 && !globeFailed;
  const showGlobe = canGlobe && globeOn;

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
                  Things I've built — some finished, some still moving. Each one
                  links to its source.
                </p>

                {canGlobe && (
                  <button
                    type="button"
                    className={styles.globeToggle}
                    onClick={() => setGlobeOn(v => !v)}
                    aria-pressed={globeOn}
                  >
                    {globeOn ? 'View as cards' : 'View as globe'}
                  </button>
                )}
              </div>

              {showGlobe ? (
                <div className={styles.projectOrbit}>
                  <InfiniteMenu items={MENU_ITEMS} onError={handleGlobeError} />
                </div>
              ) : (
                <Row className={styles.cardsRow}>
                  {PROJECTS.map(project => (
                    <ProjectCard key={project.slug} {...project} />
                  ))}
                </Row>
              )}

              <div className={styles.footerNote}>
                <p>More experiments and works-in-progress live on my GitHub.</p>
                <a
                  href={IDENTITY.github}
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
