import prisma from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import DeleteReviewButton from '@/components/DeleteReviewButton';

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
  const review = await prisma.review.findUnique({ where: { id } });
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

  const isOwner = session?.user?.email === review.userEmail;
  const canDelete = isOwner || isAdmin;

  return (
    <main>
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
        <p className="mb-1">
          <strong>Rating:</strong>
          {' '}
          {review.rating}
          {' '}
          / 5
        </p>
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
