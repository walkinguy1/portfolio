import TrackVisibility from 'react-on-screen';
import 'animate.css';

// Each skill keeps its category (so we can show a small label on the chip),
// and is grouped by proficiency tier instead of an arbitrary percentage.
const SKILL_TIERS = [
  {
    tier: "Currently Using",
    blurb: "My daily drivers — what I reach for on most projects right now.",
    skills: [
      { name: "React",         category: "Frontend" },
      { name: "JavaScript",    category: "Frontend" },
      { name: "HTML & CSS",    category: "Frontend" },
      { name: "Bootstrap",     category: "Frontend" },
      { name: "Python",        category: "Backend & APIs" },
      { name: "Git & GitHub",  category: "Tools" },
      { name: "Pygame",        category: "Tools" },
    ],
  },
  {
    tier: "Comfortable With",
    blurb: "Solid working knowledge — used in real projects, still sharpening.",
    skills: [
      { name: "FastAPI",       category: "Backend & APIs" },
      { name: "REST APIs",     category: "Backend & APIs" },
      { name: "Pandas",        category: "ML & Data" },
      { name: "NumPy",         category: "ML & Data" },
      { name: "Linux / CLI",   category: "Tools" },
    ],
  },
  {
    tier: "Exploring & Learning",
    blurb: "Actively learning — built things with these and going deeper.",
    skills: [
      { name: "SQL",               category: "Backend & APIs" },
      { name: "Scikit-learn",      category: "ML & Data" },
      { name: "Matplotlib",        category: "ML & Data" },
      { name: "Figma / UI Design", category: "Design" },
    ],
  },
];

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
