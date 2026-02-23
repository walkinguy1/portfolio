import TrackVisibility from 'react-on-screen';
import 'animate.css';

const SKILL_CATEGORIES = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 80 },
      { name: "JavaScript", level: 75 },
      { name: "HTML & CSS", level: 85 },
      { name: "Bootstrap", level: 80 },
    ],
  },
  {
    category: "Backend & APIs",
    skills: [
      { name: "Python", level: 85 },
      { name: "FastAPI", level: 70 },
      { name: "SQL", level: 65 },
      { name: "REST APIs", level: 72 },
    ],
  },
  {
    category: "ML & Data",
    skills: [
      { name: "Scikit-learn", level: 65 },
      { name: "Pandas", level: 70 },
      { name: "NumPy", level: 68 },
      { name: "Matplotlib", level: 65 },
    ],
  },
  {
    category: "Tools & Other",
    skills: [
      { name: "Git & GitHub", level: 78 },
      { name: "Pygame", level: 75 },
      { name: "Figma / UI Design", level: 60 },
      { name: "Linux / CLI", level: 65 },
    ],
  },
];

export const Skills = () => {
  return (
    <section className="skill" id="skills">
      <div className="container">
        <TrackVisibility>
          {({ isVisible }) => (
            <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>

              <div className="section-header">
                <span className="section-tag">— What I Work With</span>
                <h2>Skills</h2>
                <p>
                  Technologies I've used across web development, machine learning, and beyond —
                  always picking up something new.
                </p>
              </div>

              <div className="skills-grid">
                {SKILL_CATEGORIES.map((cat, ci) => (
                  <div key={ci} className="skill-category-card">
                    <h5 className="skill-cat-title">{cat.category}</h5>
                    <div className="skill-bars">
                      {cat.skills.map((skill, si) => (
                        <div key={si} className="skill-bar-item">
                          <div className="skill-bar-header">
                            <span className="skill-bar-name">{skill.name}</span>
                            <span className="skill-bar-pct">{skill.level}%</span>
                          </div>
                          <div className="skill-bar-track">
                            <div
                              className={`skill-bar-fill ${isVisible ? 'skill-bar-animated' : ''}`}
                              style={{ '--target-width': `${skill.level}%`, animationDelay: `${si * 0.12}s` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
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