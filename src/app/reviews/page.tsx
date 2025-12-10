'use client';

import { useState, useEffect, useMemo } from 'react';
import ReviewCard from '@/components/ReviewCard';

interface Review {
  id: number;
  tool: string;
  school: string;
  subject: string | null;
  courseNumber: string | null;
  rating: number;
  review: string | null;
  createdAt: string;
}

interface ApiResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(null);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reviews?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setLoading(false);
      });
  }, [page]);

  const reviewCards = useMemo(() => {
    if (!data?.reviews) return [];
    return data.reviews.map(review => (
      <ReviewCard
        key={review.id}
        id={review.id}
        tool={review.tool}
        school={review.school}
        subject={review.subject || ''}
        courseNumber={review.courseNumber || ''}
        rating={review.rating}
        reviewText={review.review || ''}
        createdAt={review.createdAt}
      />
    ));
  }, [data?.reviews]);

  if (loading) {
    return (
      <main>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <h1>Student Reviews</h1>
          <p>Loading reviews...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div style={{ height: '80px' }} />
      <div className="container py-4">
        <h1 className="mb-4">Student Reviews</h1>
        
        {!data || !data.reviews || data.reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <>
            <div className="list-group gap-2 mb-4">
              {reviewCards}
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  First
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </div>

              <span className="text-muted">
                Page {data.page} of {data.totalPages} ({data.total} total reviews)
              </span>

              <div>
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                  disabled={page >= data.totalPages}
                >
                  Next
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPage(data.totalPages)}
                  disabled={page >= data.totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
