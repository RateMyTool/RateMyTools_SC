'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import ReviewCard from '@/components/ReviewCard';

interface Review {
  id: number;
  tool: string;
  school: string;
  subject: string | null;
  courseNumber: string | null;
  rating: number;
  reviewText: string;
  createdAt: string;
}

interface PaginationData {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ReviewsPage() {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reviews?page=${page}&limit=${limit}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page]);

  // Memoize the review list to prevent re-rendering if data is unchanged
  const reviewCards = useMemo(() => {
    if (!data) return null;
    return data.reviews.map((r) => (
      <ReviewCard
        key={r.id}
        id={r.id}
        tool={r.tool}
        school={r.school}
        subject={r.subject}
        courseNumber={r.courseNumber}
        rating={r.rating}
        reviewText={r.reviewText}
        createdAt={r.createdAt}
      />
    ));
  }, [data?.reviews]);

  if (loading) {
    return (
      <main>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <main>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <h1 className="mb-3">Reviews</h1>
          <p className="text-muted">No reviews yet.</p>
        </div>
      </main>
    );
  }

  const { pagination } = data;

  return (
    <main>
      <div style={{ height: '80px' }} />
      <div className="container py-4">
        <h1 className="mb-3">Reviews</h1>
        <div className="list-group">
          {reviewCards}
        </div>

        {/* Pagination Controls */}
        <nav className="mt-4" aria-label="pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                First
              </button>
            </li>
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, page - 2) + i;
              if (pageNum > pagination.totalPages) return null;
              return (
                <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </li>
            <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(pagination.totalPages)}
                disabled={page === pagination.totalPages}
              >
                Last
              </button>
            </li>
          </ul>
          <p className="text-center text-muted">
            Page
            {' '}
            {pagination.page}
            {' '}
            of
            {' '}
            {pagination.totalPages}
            {' '}
            (
            {pagination.total}
            {' '}
            total reviews)
          </p>
        </nav>
      </div>
    </main>
  );
}
