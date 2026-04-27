import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/img/logo.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon3 from "../assets/img/nav-icon3.svg";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} sm={6}>
            <img src={logo} alt="Tushar Khatiwada Logo" style={{ width: '120px' }} />
          </Col>
          <Col xs={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              {/* Added aria-labels and specific alt text for SEO */}
              <a href="https://www.linkedin.com/in/tushar-khatiwada/" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">
                <img src={navIcon1} alt="LinkedIn Icon" />
              </a>
              <a href="https://github.com/walkinguy1" target="_blank" rel="noreferrer" aria-label="GitHub Profile">
                <img src={navIcon2} alt="GitHub Icon" />
              </a>
              <a href="https://www.instagram.com/walkinguy/" target="_blank" rel="noreferrer" aria-label="Instagram Profile">
                <img src={navIcon3} alt="Instagram Icon" />
              </a>
            </div>
            <p>© {new Date().getFullYear()}. All Rights Reserved - Tushar Khatiwada</p>
            <span style={{ fontSize: '10px', color: 'var(--text-faint)', opacity: 0.3 }}>{`// try typing 'mine'`}</span>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}