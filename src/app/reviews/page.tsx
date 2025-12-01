import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Reviews',
};

export default async function ReviewsPage() {
  // Debug: log which DB URL the server process sees (helps diagnose masked Vercel envs)
  // eslint-disable-next-line no-console
  console.log('ENV DATABASE_URL:', process.env.DATABASE_URL);
  // eslint-disable-next-line no-console
  console.log('ENV POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL);
  // eslint-disable-next-line no-console
  console.log('ENV POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING);

  // Debug: inspect prisma runtime shape
  // eslint-disable-next-line no-console
  try { console.log('prisma keys:', Object.keys(prisma || {})); } catch (e) { console.log('prisma inspect error', e); }
  try {
    // eslint-disable-next-line no-console
    console.log('prisma models:', Object.keys((prisma as any)._runtimeDataModel?.model || (prisma as any)._runtimeDataModel?.models || {}));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('prisma models inspect error', e);
  }

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
            {reviews.map((r) => (
              <div key={r.id} className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{r.tool} — {r.school}</h5>
                  <small className="text-muted">{new Date(r.createdAt).toLocaleString()}</small>
                </div>
                <p className="mb-1">{r.reviewText}</p>
                <small className="text-muted">Rating: {r.rating} / 5 — Tags: {r.tags?.join(', ')}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
