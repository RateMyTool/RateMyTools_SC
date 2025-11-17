import { Col, Container, Row, Image } from "react-bootstrap";




const comparePage = () =>
(
    <main>
        <Container id="compare-page" fluid-className="py-3">
            <Row className="align-middle text-center">
                <Col xs={4}>
                    <Image src="logo.png" width="150px" alt="" />
                </Col>

                <Col xs={8} className="d-flex flex-column justify-content-center">
                    <h1>Compare Tools</h1>
                    <p>Compare your tools here (WIP)</p>
                </Col>
            </Row>
        </Container>
    </main>
)