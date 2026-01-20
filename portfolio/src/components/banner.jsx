import { Container,  Row, Col } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import headerImg from '../assets/img/header-img.png';
export const Banner = () => {
    return(
        <section className="banner" id="home">
            <Container>
                <Row className = "align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">Welcome to my Portfolio</span>
                        <h1>{"Hi I'm Walkinguy"}<span className='wrap'></span></h1>
                        <p>This is a placeholder for now to have some details to have added later on depending on what will be required so yeah don't give a shit to it at the moment AAAAAAAA</p>
                        <button onClick={() => console.log('connect')}> Let's Connect <ArrowRightCircle size={25}/></button>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                        <img src={headerImg} alt = "Header Img" />
                    </Col>
                </Row>
            </Container>

        </section>
    )
}