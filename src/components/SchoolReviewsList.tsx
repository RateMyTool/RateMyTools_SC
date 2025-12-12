'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  tool: string;
  school: string;
  subject: string;
  courseNumber: string;
  rating: number;
  reviewText: string;
  tags: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  helpfulScore: number;
}

interface SchoolReviewsListProps {
  school: string;
}

export default function SchoolReviewsList({ school }: SchoolReviewsListProps) {
  const router = useRouter();
  const [pageReviews, setPageReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/school/${encodeURIComponent(school)}/reviews?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        setPageReviews(data.reviews || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Error fetching school reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [school, currentPage]);

  // Ensure we clamp current page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [school, sortBy]);

  const sortedReviews = useMemo(() => {
    const list = [...pageReviews];

    switch (sortBy) {
      case 'highest':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        list.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        list.sort((a, b) => b.helpfulScore - a.helpfulScore);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [pageReviews, sortBy]);

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (pageReviews.length === 0) {
    return (
      <div className="p-6 text-center" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <p className="text-gray-600">No reviews for {school} yet.</p>
        <p className="text-sm text-gray-500 mt-2">Be the first to write a review!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-3 flex justify-between items-center">
        <h3>
          Reviews at {school}
        </h3>
        <div style={{ minWidth: '200px' }}>
          <select
            className="w-full px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
            }}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="p-4"
            style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer' }}
            onClick={() => router.push(`/tool/${encodeURIComponent(review.tool)}`)}
          >
            <div className="flex gap-4">
              {/* Rating Badge */}
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center text-white px-4 py-4"
                  style={{ backgroundColor: '#2563eb', borderRadius: '4px', fontSize: '20px', fontWeight: '300' }}
                >
                  {review.rating.toFixed(1)}
                </div>
              </div>

              {/* Review Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold mb-0.5">{review.tool}</p>
                    <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{review.subject} • CRN: {review.courseNumber}</p>
                    <p className="text-sm line-clamp-2">{review.reviewText}</p>
                  </div>
                </div>
                {/* Tags */}
                {review.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1"
                        style={{
                          backgroundColor: '#f0f0f0',
                          color: '#374151',
                          borderRadius: '4px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
              color: currentPage === 1 ? '#9ca3af' : '#000',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
              color: currentPage === totalPages ? '#9ca3af' : '#000',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
