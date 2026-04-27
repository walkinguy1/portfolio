import TrackVisibility from 'react-on-screen';
import { SKILL_TIERS } from '../data/portfolioData';
import 'animate.css';

export const Skills = () => {
  return (
    <section className="skill" id="skills">
      <div className="container">
        <TrackVisibility once>
          {({ isVisible }) => (
            <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>

              <div className="section-header">
                <span className="section-tag">— What I Work With</span>
                <h2>Skills</h2>
                <p>
                  Technologies I've used across web development, machine learning, and beyond —
                  grouped by how often I reach for them, not by arbitrary percentages.
                </p>
              </div>

              <div className="skills-tiers">
                {SKILL_TIERS.map((tier, ti) => (
                  <div
                    key={ti}
                    className={`skill-tier skill-tier--${ti}`}
                    style={{ animationDelay: `${ti * 0.15}s` }}
                  >
                    <div className="skill-tier-head">
                      <span className="skill-tier-index">0{ti + 1}</span>
                      <div>
                        <h5 className="skill-tier-title">{tier.tier}</h5>
                        <p className="skill-tier-blurb">{tier.blurb}</p>
                      </div>
                    </div>

                    <ul className="skill-chip-list" aria-label={`${tier.tier} skills`}>
                      {tier.skills.map((skill, si) => (
                        <li key={si} className="skill-chip">
                          <span className="skill-chip-name">{skill.name}</span>
                          <span className="skill-chip-cat">{skill.category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          )}
        </TrackVisibility>
      </div>
    </section>
  );
};
