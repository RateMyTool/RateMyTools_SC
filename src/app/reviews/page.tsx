'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  upvotes?: number;
  downvotes?: number;
  helpfulScore?: number;
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

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pageFromUrl);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'mostHelpful' | 'leastHelpful'>('newest');
  const limit = 10;

  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reviews?page=${page}&limit=${limit}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const json = await res.json();
        
        if (!json.reviews || !Array.isArray(json.reviews)) {
          throw new Error('Invalid response format');
        }
        
        setData(json);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page]);

  const sortedReviews = useMemo(() => {
    if (!data || !data.reviews) return [];
    const reviews = [...data.reviews];
    
    switch (sortBy) {
      case 'highest':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviews.sort((a, b) => a.rating - b.rating);
      case 'mostHelpful':
        return reviews.sort((a, b) => (b.helpfulScore || 0) - (a.helpfulScore || 0));
      case 'leastHelpful':
        return reviews.sort((a, b) => (a.helpfulScore || 0) - (b.helpfulScore || 0));
      case 'newest':
      default:
        return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [data, sortBy]);

  const reviewCards = useMemo(() => {
    return sortedReviews.map((r) => (
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
        initialUpvotes={r.upvotes || 0}
        initialDownvotes={r.downvotes || 0}
      />
    ));
  }, [sortedReviews]);

  const handlePageChange = (newPage: number) => {
    router.push(`/reviews?page=${newPage}`);
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <h1 className="mb-3">Error</h1>
          <p className="text-danger">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ height: '80px' }} />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reviews</h1>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="sortSelect" className="mb-0 me-2">Sort by:</label>
            <select
              id="sortSelect"
              className="form-select form-select-sm shadow-sm"
              style={{ width: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="mostHelpful">Most Helpful</option>
              <option value="leastHelpful">Least Helpful</option>
            </select>
          </div>
        </div>
        <div className="list-group shadow-sm">
          {reviewCards}
        </div>

        <nav className="mt-4" aria-label="pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
              >
                First
              </button>
            </li>
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
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
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </li>
            <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={page === pagination.totalPages}
              >
                Last
              </button>
            </li>
          </ul>
          <p className="text-center text-muted">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total reviews)
          </p>
        </nav>
      </div>
    </main>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}><div className="container py-4">Loading...</div></div>}>
      <ReviewsContent />
    </Suspense>
  );
}
