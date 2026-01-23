import { Container, Row, Col } from "react-bootstrap";
import aboutImg from "../assets/img/about-img.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const About = () => {
  return (
    <section className="about" id="about">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <img className={isVisible ? "animate__animated animate__zoomIn" : ""} src={aboutImg} alt="About Me"/>
              }
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <h2>About Me</h2>
                <p>Currently a Computer Engineering Student in TU, Himalaya College of Engineering, Chysal, Lalitpur who's interested in web-development and machine learning in particular but always open to exploring and understanding more options</p>
                <div className="about-stats">
                    <div className="stat-item">
                        <span className="stat-number">3rd Year</span>
                        <span className="stat-text">Computer Engineering Student</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">4+</span>
                        <span className="stat-text">Projects Completed</span>
                    </div>
                </div>
                <button onClick={() => console.log('connect')}>Learn More</button>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}