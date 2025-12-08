import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ReviewStars from '@/components/ReviewStars';

export const metadata = {
  title: 'Reviews',
};

// Revalidate every 5 minutes - balance between fresh data and performance
export const revalidate = 300;

type SearchParams = {
  sort?: string;
};

export default async function ReviewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sortValue = searchParams?.sort ?? 'newest';

  // Database-level sorting for better performance
  let orderBy: { createdAt?: 'asc' | 'desc'; rating?: 'asc' | 'desc' } = { createdAt: 'desc' };
  if (sortValue === 'highest') orderBy = { rating: 'desc' };
  else if (sortValue === 'lowest') orderBy = { rating: 'asc' };
  else if (sortValue === 'oldest') orderBy = { createdAt: 'asc' };

  const reviews = await prisma.review.findMany({
    orderBy,
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

  const sortedReviews = reviews;

  const sortOptions = [
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const buildHref = (value: string) => `/reviews?sort=${value}`;

  return (
    <main>
      <div style={{ height: '80px' }} />
      <div className="container py-4 ">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
          <h1 className="mb-0">Student Reviews</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-muted">Sort by:</span>
            <div className="btn-group" role="group" aria-label="Sort reviews">
              {sortOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildHref(opt.value)}
                  className={`btn btn-sm ${sortValue === opt.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={sortValue === opt.value ? { color: 'white' } : {}}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {sortedReviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div className="list-group gap-2">
            {sortedReviews.map((r) => {
              const classLabel = [r.subject, r.courseNumber].filter(Boolean).join(' ');
              return (
                <Link key={r.id} href={`/reviews/${r.id}`} className="list-group-item list-group-item-action rounded">
                  <div className="d-flex w-100 justify-content-between">
                    <h3 className="mb-1 mt-2">
                      {r.tool.name}
                      {' '}
                    </h3>
                    <small className="text-muted">{r.createdAt.toLocaleString()}</small>
                  </div>
                  <div>
                    <h5>{r.school.name}</h5>
                  </div>
                  {classLabel && (
                    <div className="mb-2">
                      <strong>Class:</strong>
                      {' '}
                      {classLabel}
                    </div>
                  )}
                  <p className="mb-2 text-truncate bg-gray-100 p-3 rounded">{r.comment || r.reviewText}</p>
                  <small className="">
                    <ReviewStars rating={r.rating} />
                  </small>
                  <div>
                    {r.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="badge me-2 mb-2"
                        style={{
                          backgroundColor: '#f0f0f0',
                          color: 'black',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3">
                    {(r.user?.email || r.userEmail) && (
                      <>
                        <strong>Posted by:</strong>
                        {' '}
                        {r.user?.email || r.userEmail}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
