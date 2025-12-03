'use client';

import TopMenu from '@/components/TopMenu';
import MiddleMenu from '@/components/MiddleMenu';
import FooterMenu from '@/components/FooterMenu';
import { useState } from 'react';
// ComparePage import removed (unused)

  /** The Home page. */
export default function Home() {
  const [title, setTitle] = useState('TOOLS');
  return (
    <main>
      <TopMenu title={title} />
      <MiddleMenu title={title} setTitle={setTitle} />
      <FooterMenu />
    </main>
  );
}//  {ComparePage()}

  /** The Home page. */
  /*
  const Home = () => {
    //return ComparePage()
    return (
      <main>
        <Container id="landing-page" fluid className="py-3">
          <Row className="align-middle text-center">
            <Col xs={4}>
              <Image src="next.svg" width="150px" alt="" />
            </Col>

            <Col xs={8} className="d-flex flex-column justify-content-center">
              <h1>Welcome to this template</h1>
              <p>Now get to work and modify this app!</p>
            </Col>
          </Row>
        </Container>
      </main>
    )
  }; */
