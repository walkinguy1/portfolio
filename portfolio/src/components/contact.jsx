import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TrackVisibility from 'react-on-screen';
import 'animate.css';

export const Contact = () => {
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  };
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send Message');
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
    setFormDetails({ ...formDetails, [category]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");
    let response = await fetch("https://formspree.io/f/xgoakojy", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(formDetails),
    });
    setButtonText("Send Message");
    if (response.ok) {
      setFormDetails(formInitialDetails);
      setStatus({ success: true, message: 'Message sent! I\'ll get back to you soon.' });
    } else {
      setStatus({ success: false, message: 'Something went wrong — please try again.' });
    }
  };

  return (
    <section className="contact" id="connect">
      <Container>
        <TrackVisibility>
          {({ isVisible }) => (
            <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>

              {/* Section header */}
              <div className="section-header">
                <span className="section-tag">— Let's Talk</span>
                <h2>Get In Touch</h2>
                <p>Have a project in mind, want to collaborate, or just want to say hi? My inbox is open.</p>
              </div>

              {/* Contact card */}
              <div className="contact-card">
                {/* Left info panel */}
                <div className="contact-info">
                  <h3>Let's build<br />something together</h3>
                  <p>I'm currently open to internships, freelance work, and interesting side projects. Don't hesitate to reach out.</p>

                  <div className="contact-links">
                    <a href="https://www.linkedin.com/in/tushar-khatiwada/" target="_blank" rel="noreferrer" className="contact-social-link">
                      <span className="contact-social-icon">in</span>
                      <span>LinkedIn</span>
                    </a>
                    <a href="https://github.com/walkinguy1" target="_blank" rel="noreferrer" className="contact-social-link">
                      <span className="contact-social-icon">gh</span>
                      <span>GitHub</span>
                    </a>
                    <a href="https://www.instagram.com/walkinguy/" target="_blank" rel="noreferrer" className="contact-social-link">
                      <span className="contact-social-icon">ig</span>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Right form panel */}
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={formDetails.firstName}
                        placeholder="Tushar"
                        onChange={(e) => onFormUpdate('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={formDetails.lastName}
                        placeholder="Khatiwada"
                        onChange={(e) => onFormUpdate('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={formDetails.email}
                      placeholder="you@example.com"
                      onChange={(e) => onFormUpdate('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      rows="5"
                      value={formDetails.message}
                      placeholder="Tell me what you're working on..."
                      onChange={(e) => onFormUpdate('message', e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-cta contact-submit">
                    <span>{buttonText}</span>
                    {buttonText === 'Send Message' && <span className="submit-arrow">→</span>}
                  </button>

                  {status.message && (
                    <p className={`form-status ${status.success ? 'form-status--success' : 'form-status--error'}`}>
                      {status.message}
                    </p>
                  )}
                </form>
              </div>

            </div>
          )}
        </TrackVisibility>
      </Container>
    </section>
  );
};