import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl }) => {
  return (
    <Col size={12} sm={6} md={4}> 
{/* esko meaning chei bootstrap ko grid system ma ho,jasma 12 unit haru huncha, sm (small) ma 6 unit ra md (medium) ma 4 unit linu parcha vanera ho */}
      <div className="proj-imgbx">
        <img src={imgUrl} />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
        </div>
      </div>
    </Col>
  )
}