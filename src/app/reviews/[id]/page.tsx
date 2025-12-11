import prisma from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import DeleteReviewButton from '@/components/DeleteReviewButton';
import ReviewStars from '@/components/ReviewStars';

export const metadata = {
  title: 'Review',
};

// Disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = {
  params: {
    id: string;
  };
};

export default async function ReviewDetailPage({ params }: Params) {
  const id = Number(params.id);
  const session = await getServerSession(authOptions);

  // Fetch review and check admin status in parallel
  const [review, currentUser] = await Promise.all([
    prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        tool: true,
        school: true,
        subject: true,
        courseNumber: true,
        rating: true,
        tags: true,
        reviewText: true,
        userEmail: true,
        createdAt: true,
      },
    }),
    session?.user?.email
      ? prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      })
      : null,
  ]);

  if (!review) {
    return (
      <main style={{ minHeight: '100vh' }}>
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

  const isAdmin = currentUser?.role === 'ADMIN';
  const isOwner = session?.user?.email === review.userEmail;
  const canDelete = isOwner || isAdmin;

  return (
    <main style={{ minHeight: '100vh' }}>
      <div style={{ height: '80px' }} />
      <div className="container py-4">
        <h1 className="mb-2">
          {review.tool}
          {' '}
          —
          {' '}
          {review.school}
        </h1>
        {classLabel && (
          <p className="mb-1">
            <strong>Class:</strong>
            {' '}
            {classLabel}
          </p>
        )}
        <div><ReviewStars rating={review.rating} /></div>
        <p className="mb-1">
          <strong>Tags:</strong>
          {' '}
          {review.tags?.join(', ')}
        </p>
        {review.userEmail && (
          <p className="mb-1">
            <strong>Posted by:</strong>
            {' '}
            {review.userEmail}
          </p>
        )}
        <hr />
        <div className="mb-3">{review.reviewText}</div>
        <small className="text-muted">
          Posted:
          {' '}
          {new Date(review.createdAt).toLocaleString()}
        </small>
        <div className="mt-3 d-flex gap-2">
          <Link href="/reviews" className="btn btn-sm btn-outline-secondary">
            Back to reviews
          </Link>
          {canDelete && <DeleteReviewButton reviewId={id} />}
        </div>
      </div>
    </main>
  );
}
