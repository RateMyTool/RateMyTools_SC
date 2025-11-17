import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import RateStuffForm from '@/components/RateStuffForm';

export default async function RateStuffPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const id = parseInt(params.id, 10);
  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : 0;

  // Get the stuff item
  const stuff = await prisma.stuff.findUnique({
    where: { id },
  });

  if (!stuff) {
    return (
      <main>
        <Container className="py-3">
          <Row>
            <Col>
              <h2>Tool not found</h2>
              <p>The tool you are trying to rate does not exist.</p>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  // Check if user has already rated this item
  const existingRating = await prisma.rating.findUnique({
    where: {
      stuffId_userId: {
        stuffId: id,
        userId: currentUserId,
      },
    },
  });

  return (
    <main>
      <RateStuffForm
        stuffId={stuff.id}
        stuffName={stuff.name}
        existingRating={existingRating}
      />
    </main>
  );
}
