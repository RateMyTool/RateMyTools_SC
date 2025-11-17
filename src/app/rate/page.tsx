import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table } from 'react-bootstrap';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

/** Render a list of stuff available for rating. */
const RatePage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : 0;

  // Get all stuff items with their ratings
  const stuff = await prisma.stuff.findMany({
    include: {
      ratings: {
        where: {
          userId: currentUserId,
        },
      },
    },
  });

  return (
    <main>
      <Container id="rate" fluid className="py-3">
        <Row>
          <Col>
            <h1>Rate Tools</h1>
            <p>Click on a tool to rate it or update your existing rating.</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Condition</th>
                  <th>Owner</th>
                  <th>Your Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stuff.map((item) => {
                  const userRating = item.ratings.length > 0 ? item.ratings[0] : null;
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.condition}</td>
                      <td>{item.owner}</td>
                      <td>
                        {userRating ? (
                          <span>
                            {'⭐'.repeat(userRating.rating)}
                            {' '}
                            (
                            {userRating.rating}
                            /5)
                          </span>
                        ) : (
                          <span className="text-muted">Not rated yet</span>
                        )}
                      </td>
                      <td>
                        <Link href={`/rate/${item.id}`} className="btn btn-primary btn-sm">
                          {userRating ? 'Update Rating' : 'Rate'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default RatePage;
