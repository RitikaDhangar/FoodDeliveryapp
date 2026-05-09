import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-2 fixed-bottom">
      <Container>
        <Row className="align-items-center text-center text-md-start">

          <Col md={6}>
            <h5 className="mb-2 mb-md-0">
              Ritika Dhangar
            </h5>
          </Col>

          <Col md={6} className="text-md-end">
            <a
              href="https://github.com/RitikaDhangar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light text-decoration-none me-4"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/ritika-dhangar-59208721b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light text-decoration-none"
            >
              LinkedIn
            </a>
          </Col>

        </Row>
      </Container>
    </footer>
  );
};

export default Footer;