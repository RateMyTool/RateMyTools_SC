import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import DeleteReviewButton from '@/components/DeleteReviewButton';
import ReviewStars from '@/components/ReviewStars';

export const metadata = {
  title: 'Review',
};

// Cache review details for 10 minutes - reviews don't change frequently
export const revalidate = 600;

type Params = {
  params: {
    id: string;
  };
};

export default async function ReviewDetailPage({ params }: Params) {
  const id = Number(params.id);
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      school: true,
      tool: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  const session = await getServerSession(authOptions);

  if (!review) {
    return (
      <main>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <h1 className="mb-3">Review Not Found</h1>
          <p className="text-muted">This review does not exist.</p>
          <Link href="/reviews" className="btn btn-sm btn-outline-primary">
            Back to reviews
          </Link>
        </div>
      </main>
    );
  }

  const classLabel = [review.subject, review.courseNumber].filter(Boolean).join(' ');

  // Check if current user is admin
  let isAdmin = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    isAdmin = user?.role === 'ADMIN';
  }

  const isOwner = session?.user?.email === review.user?.email;
  const canDelete = isOwner || isAdmin;

  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ height: '80px' }} />
      <div className="container py-4">
        <h1 className="mb-3">Review Details</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex w-100 justify-content-between align-items-start mb-2">
              <div>
                <h3 className="mb-2">{review.tool.name}</h3>
                <h5 className="mb-2">{review.school.name}</h5>
                {classLabel && (
                  <div className="mb-1">
                    <strong>Class:</strong>
                    {' '}
                    {classLabel}
                  </div>
                )}
              </div>
              <small className="text-muted">{new Date(review.createdAt).toLocaleString()}</small>
            </div>

            <div className="mb-2 d-flex align-items-center gap-2">
              {review.userEmail && (
                <small className="text-muted">
                  — By: {review.userEmail}
                </small>
              )}
            </div>

            <div className="mb-3 bg-gray-100 p-3 rounded">{review.comment || review.reviewText}</div>
            <div><ReviewStars rating={review.rating} /></div>
            {review.tags?.length ? (
              <div>
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge me-2"
                    style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {review.user?.email && (
              <p className="mb-2 mt-5">
                <strong>Posted by:</strong>
                {' '}
                {review.user.email}
              </p>
            )}
            <div className="d-flex gap-2">
              <Link href="/reviews" className="btn btn-sm btn-outline-secondary">
                Back to reviews
              </Link>
              {canDelete && <DeleteReviewButton reviewId={id} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
