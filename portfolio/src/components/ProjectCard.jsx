import { Col } from "react-bootstrap";
import styles from './ProjectCard.module.css';

export const ProjectCard = ({ title, description, imgUrl, tech = [], githubUrl, liveUrl }) => {
  return (
    <Col xs={12} sm={6} md={4} className={styles.projectCardCol}>
      <div className={styles.projCard}>
        <div className={styles.projImgWrap}>
          <img src={imgUrl} alt={title} loading="lazy" />
          <div className={styles.projOverlay}>
            <div className={styles.projOverlayLinks}>
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noreferrer" className={styles.projLink}>
                  GitHub ↗
                </a>
              )}
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className={`${styles.projLink} ${styles.projLinkLive}`}>
                  Live Demo ↗
                </a>
              )}
            </div>
          </div>
        </div>
        <div className={styles.projBody}>
          <h3>{title}</h3>
          <p>{description}</p>
          {tech.length > 0 && (
            <div className={styles.projTechTags}>
              {tech.map((t) => (
                <span key={t} className={styles.techTag}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};