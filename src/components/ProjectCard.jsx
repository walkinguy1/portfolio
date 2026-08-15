import { Col } from "react-bootstrap";
import styles from './ProjectCard.module.css';

// Fixed vocabulary — keep in sync with portfolioData.js.
const STATUS_LABEL = {
  'shipped':           'Shipped',
  'working-prototype': 'Working prototype',
  'in-progress':       'In progress',
  'paused':            'Paused',
};

export const ProjectCard = ({
  title, description, tech = [], githubUrl, liveUrl,
  status, builtFor, year, role, screenshot,
}) => {
  const meta = [builtFor, year].filter(Boolean).join(' · ');

  return (
    <Col xs={12} sm={6} lg={4} className={styles.cardCol}>
      <article className={styles.card}>
        {screenshot && (
          <img className={styles.shot} src={screenshot} alt={`${title} screenshot`} loading="lazy" />
        )}

        <header className={styles.head}>
          <h3 className={styles.title}>{title}</h3>
          {status && (
            <span className={styles.badge}>{STATUS_LABEL[status] ?? status}</span>
          )}
        </header>

        {meta && <p className={styles.meta}>{meta}</p>}

        <p className={styles.body}>{description}</p>

        {/* Only set on team projects where the repo isn't mine — saying so is
            the difference between crediting a team and implying solo work. */}
        {role && <p className={styles.role}>{role}</p>}

        {tech.length > 0 && (
          <ul className={styles.tech} aria-label={`${title} tech stack`}>
            {tech.map(t => <li key={t}>{t}</li>)}
          </ul>
        )}

        <footer className={styles.links}>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className={styles.link}>
              View source ↗
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className={`${styles.link} ${styles.linkLive}`}>
              Live demo ↗
            </a>
          )}
        </footer>
      </article>
    </Col>
  );
};
