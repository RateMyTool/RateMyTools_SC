import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Reviews',
};

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main>
      <div style={{ height: 112 }} />
      <div className="container py-4">
        <h1 className="mb-3">Reviews</h1>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div className="list-group">
            {reviews.map((r) => {
              const classLabel = [r.subject, r.courseNumber].filter(Boolean).join(' ');
              return (
                <Link key={r.id} href={`/reviews/${r.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{r.tool} — {r.school}</h5>
                    <small className="text-muted">{new Date(r.createdAt).toLocaleString()}</small>
                  </div>
                  {classLabel && <div className="mb-1"><strong>Class:</strong> {classLabel}</div>}
                  <p className="mb-1 text-truncate">{r.reviewText}</p>
                  <small className="text-muted">Rating: {r.rating} / 5 — Tags: {r.tags?.join(', ')}</small>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
