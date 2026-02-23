import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl, tech = [], githubUrl, liveUrl }) => {
  return (
    <Col xs={12} sm={6} md={4} className="project-card-col">
      <div className="proj-card">
        <div className="proj-img-wrap">
          <img src={imgUrl} alt={title} loading="lazy" />
          <div className="proj-overlay">
            <div className="proj-overlay-links">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                  GitHub ↗
                </a>
              )}
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="proj-link proj-link--live">
                  Live Demo ↗
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="proj-body">
          <h4>{title}</h4>
          <p>{description}</p>
          {tech.length > 0 && (
            <div className="proj-tech-tags">
              {tech.map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};