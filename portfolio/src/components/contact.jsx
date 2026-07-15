import { useState, useCallback } from "react";
import { IDENTITY } from "../data/portfolioData";
import { Container } from "react-bootstrap";
import TrackVisibility from 'react-on-screen';
import 'animate.css';

const FORM_INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
  website: '' // Honeypot field
};

// Simple throttle to prevent rapid submissions
const THROTTLE_MS = 30000; // 30 seconds

export const Contact = () => {
  const [formDetails, setFormDetails] = useState(FORM_INITIAL);
  const [buttonText, setButtonText] = useState('Send Message');
  const [status, setStatus] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  const onFormUpdate = useCallback((field, value) => {
    setFormDetails(prev => ({ ...prev, [field]: value }));
    // Clear status message when user starts typing again
    if (status.message) setStatus({});
  }, [status.message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    // Check throttle
    const now = Date.now();
    if (now - lastSubmissionTime < THROTTLE_MS) {
      const remaining = Math.ceil((THROTTLE_MS - (now - lastSubmissionTime)) / 1000);
      setStatus({ success: false, message: `Please wait ${remaining} seconds before sending another message.` });
      return;
    }

    // Check honeypot - if filled, it's a bot
    if (formDetails.website) {
      setStatus({ success: true, message: "Message sent! I'll get back to you soon." });
      setFormDetails(FORM_INITIAL);
      return;
    }

    setIsSending(true);
    setButtonText("Sending...");
    setStatus({});

    try {
      const response = await fetch("https://formspree.io/f/xgoakojy", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          firstName: formDetails.firstName,
          lastName: formDetails.lastName,
          email: formDetails.email,
          message: formDetails.message,
        }),
      });

      if (response.ok) {
        setFormDetails(FORM_INITIAL);
        setLastSubmissionTime(Date.now());
        setStatus({ success: true, message: "Message sent! I'll get back to you soon." });
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus({
          success: false,
          message: data?.errors?.[0]?.message || 'Something went wrong — please try again.',
        });
      }
    } catch {
      setStatus({ success: false, message: 'Network error — please check your connection and try again.' });
    } finally {
      setButtonText("Send Message");
      setIsSending(false);
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
                    <a href={IDENTITY.linkedin} target="_blank" rel="noreferrer" className="contact-social-link">
                      <span className="contact-social-icon" aria-hidden="true">in</span>
                      <span>LinkedIn</span>
                    </a>
                    <a href={IDENTITY.github} target="_blank" rel="noreferrer" className="contact-social-link">
                      <span className="contact-social-icon" aria-hidden="true">gh</span>
                      <span>GitHub</span>
                    </a>
                    <a href={IDENTITY.instagram} target="_blank" rel="noreferrer" className="contact-social-link">
                      <span className="contact-social-icon" aria-hidden="true">ig</span>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Right form panel */}
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        value={formDetails.firstName}
                        placeholder="Tushar"
                        onChange={(e) => onFormUpdate('firstName', e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        value={formDetails.lastName}
                        placeholder="Khatiwada"
                        onChange={(e) => onFormUpdate('lastName', e.target.value)}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formDetails.email}
                      placeholder="you@example.com"
                      onChange={(e) => onFormUpdate('email', e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formDetails.message}
                      placeholder="Tell me what you're working on..."
                      onChange={(e) => onFormUpdate('message', e.target.value)}
                      required
                    />
                  </div>

                  {/* Honeypot field - hidden from users, visible to bots */}
                  <input
                    type="text"
                    name="website"
                    value={formDetails.website}
                    onChange={(e) => onFormUpdate('website', e.target.value)}
                    style={{ position: 'absolute', left: '-5000px' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <button
                    type="submit"
                    className="btn-primary-cta contact-submit"
                    disabled={isSending}
                    aria-busy={isSending}
                  >
                    <span>{buttonText}</span>
                    {!isSending && <span className="submit-arrow" aria-hidden="true">→</span>}
                  </button>

                  {status.message && (
                    <p
                      role="status"
                      aria-live="polite"
                      className={`form-status ${status.success ? 'form-status--success' : 'form-status--error'}`}
                    >
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
