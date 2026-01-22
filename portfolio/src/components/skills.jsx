import web from "../assets/img/web.png";
import ml from "../assets/img/ML.png";
import sql from "../assets/img/sql.png";
import game from "../assets/img/gamedev.png";
import python from "../assets/img/python.png";
import uiux from "../assets/img/uiux.png";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../assets/img/color-sharp.png"

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Skills</h2>
                        <p>This is the place to have my "skills" be written in<br></br> let's see in the future</p>
                        <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                            <div className="item">
                                <img src={web} alt="Image" />
                                <h5>Web Development</h5>
                            </div>
                            <div className="item">
                                <img src={uiux} alt="Image" />
                                <h5>UI/UX design</h5>
                            </div>
                            <div className="item">
                                <img src={ml} alt="Image" />
                                <h5>Machine Learning</h5>
                            </div>
                            <div className="item">
                                <img src={sql} alt="Image" />
                                <h5>SQL</h5>
                            </div>
                            <div className="item">
                                <img src={game} alt="Image" />
                                <h5>PyGame Development</h5>
                            </div>
                            <div className="item">
                                <img src={python} alt="Image" />
                                <h5>Python</h5>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  )
}
