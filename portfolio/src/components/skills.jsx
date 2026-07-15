import TrackVisibility from 'react-on-screen';
import { SKILL_TIERS } from '../data/portfolioData';
import 'animate.css';
import styles from './skills.module.css';

export const Skills = () => {
  return (
    <section className={styles.skill} id="skills">
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

              <div className={styles.skillsTiers}>
                {SKILL_TIERS.map((tier, ti) => (
                  <div
                    key={ti}
                    className={`${styles.skillTier} ${styles[`skillTier${ti}`]}`}
                    style={{ animationDelay: `${ti * 0.15}s` }}
                  >
                    <div className={styles.skillTierHead}>
                      <span className={styles.skillTierIndex}>0{ti + 1}</span>
                      <div>
                        <h5 className={styles.skillTierTitle}>{tier.tier}</h5>
                        <p className={styles.skillTierBlurb}>{tier.blurb}</p>
                      </div>
                    </div>

                    <ul className={styles.skillChipList} aria-label={`${tier.tier} skills`}>
                      {tier.skills.map((skill, si) => (
                        <li key={si} className={styles.skillChip}>
                          <span className={styles.skillChipName}>{skill.name}</span>
                          <span className={styles.skillChipCat}>{skill.category}</span>
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
