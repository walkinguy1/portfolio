import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import logo from '../assets/img/logo.png';

export const NavBar = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                setVisible(false); 
            } else {
                setVisible(true); 
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    // Function to handle smooth scroll to contact
    const scrollToConnect = () => {
        const contactSection = document.getElementById('connect');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <Navbar expand="lg" className={`${scrolled ? "scrolled" : ""} ${visible ? "nav-visible" : "nav-hidden"}`}>
            <Container>
                <Navbar.Brand href="#home">
                    <img src={logo} alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Changed class to me-auto to push social icons to the right */}
                    <Nav className="me-auto">
                        <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
                        <Nav.Link href="#about" className={activeLink === 'about' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('about')}>About</Nav.Link>
                        <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
                        <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
                    </Nav>
                    <span className='navbar-text'>
                        <div className='social-icon'>
                            <a href='https://www.linkedin.com/in/tushar-khatiwada/' target="_blank" rel="noreferrer"><img src={navIcon1} alt="" /></a>
                            <a href='https://github.com/walkinguy1' target="_blank" rel="noreferrer"><img src={navIcon2} alt="" /></a>
                            <a href='https://www.instagram.com/walkinguy/' target="_blank" rel="noreferrer"><img src={navIcon3} alt="" /></a>
                        </div>
                        <button className='vvd' onClick={scrollToConnect}><span>Let’s Connect</span></button>
                    </span>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}