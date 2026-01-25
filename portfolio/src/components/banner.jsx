import { Container, Row, Col } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import headerImg from '../assets/img/header-img.png';
import { Helmet } from 'react-helmet-async';

export const Banner = () => {

    const scrollToConnect = () => {
        const contactSection = document.getElementById('connect');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <section className="banner" id="home">
            {/* SEO Metadata Starts Here */}
            <Helmet>
                <title>Tushar Khatiwada | Full Stack Developer & Aspiring Software developer</title>
                <meta name="description" content="Portfolio of Tushar Khatiwada (Walkinguy). Aspiring software developer interested in AI/ML and creative problem solving." />
                <meta name="keywords" content="Tushar Khatiwada, Walkinguy, Portfolio, Software Developer, AI, ML, Nepal" />
                
                {/* Social Media Preview (Open Graph) */}
                <meta property="og:title" content="Tushar Khatiwada Portfolio" />
                <meta property="og:description" content="Aspiring software developer exploring the world of AI/ML." />
                <meta property="og:type" content="website" />
            </Helmet>
            {/* SEO Metadata Ends Here */}

            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">Welcome to my Portfolio</span>
                        <h1>{"Hi I'm Tushar Khatiwada"}<span className='wrap'></span></h1>
                        <p>Also known as Walkinguy in many online spaces, aspiring to be entangled in software development space, which interests also spanning towards AI/ML and overall in general to make it easier for problem solving.</p>
                        
                        {/* Updated button to trigger the scroll */}
                        <button onClick={scrollToConnect}> 
                            Let's Connect <ArrowRightCircle size={25}/>
                        </button>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={headerImg} alt="Tushar Khatiwada - Robotics and AI Header" />
                    </Col>
                </Row>
            </Container>
        </section>
    )
}