'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Stars from '@/components/StarsUI';

interface Review {
  id: number;
  rating: number;
  school: string;
  subject?: string;
  courseNumber?: string;
  createdAt: string;
  reviewText: string;
  tags: string[];
  userEmail?: string;
  upvotes: number;
  downvotes: number;
  helpfulScore: number;
}

function ReviewWithVoting({ review }: { review: Review }) {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(review.upvotes);
  const [downvotes, setDownvotes] = useState(review.downvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const courseLabel = [review.subject, review.courseNumber]
    .filter(Boolean)
    .join(' ');

  const handleVote = async (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session || isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(userVote === voteType ? null : voteType);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div onClick={() => window.location.href = `/reviews/${review.id}`} style={{ cursor: 'pointer' }}>
      <div 
        className="p-4" 
        style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: '12px',
          cursor: 'pointer', 
          transition: 'box-shadow 0.2s'
        }}
      >
        <div className="d-flex" style={{ gap: '1rem' }}>
          {/* Rating Box - Changed to Blue to match school page */}
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: '#2563eb',
                color: '#fff',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 300,
              }}
            >
              {review.rating.toFixed(1)}
            </div>
          </div>

          {/* Review Content */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: '#4b5563' }}>{review.school}</span>
              {courseLabel && (
                <>
                  <span style={{ color: '#9ca3af' }}>•</span>
                  <span style={{ color: '#4b5563' }}>{courseLabel}</span>
                </>
              )}
              <span style={{ color: '#9ca3af' }}>•</span>
              <span style={{ color: '#9ca3af' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {review.userEmail && (
                <>
                  <span style={{ color: '#9ca3af' }}>•</span>
                  <span style={{ color: '#6b7280' }}>{review.userEmail}</span>
                </>
              )}
              <span style={{ color: '#9ca3af' }}>•</span>
              <div className="d-flex align-items-center gap-1">
                <span style={{ fontSize: '1rem' }}>⭐</span>
                <span style={{ color: '#4b5563', fontSize: '0.85rem' }}>{review.rating}</span>
              </div>
            </div>

            <div className="d-flex flex-wrap" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full text-sm"
                  style={{ backgroundColor: '#6c757d', color: 'white', fontSize: '0.875rem', borderRadius: '9999px' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              {review.reviewText}
            </p>

            {/* Yellow Emoji Thumbs */}
            <div className="d-flex align-items-center justify-content-end gap-3">
              {session ? (
                <>
                  <button
                    onClick={(e) => handleVote('up', e)}
                    className="btn btn-link p-0 text-decoration-none"
                    style={{ opacity: userVote === 'up' ? 1 : 0.5, fontSize: '1.5rem' }}
                    disabled={isVoting}
                  >
                    👍 <span style={{ fontSize: '1rem' }}>{upvotes}</span>
                  </button>
                  <button
                    onClick={(e) => handleVote('down', e)}
                    className="btn btn-link p-0 text-decoration-none"
                    style={{ opacity: userVote === 'down' ? 1 : 0.5, fontSize: '1.5rem' }}
                    disabled={isVoting}
                  >
                    👎 <span style={{ fontSize: '1rem' }}>{downvotes}</span>
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '1.5rem' }}>
                    👍 <span style={{ fontSize: '1rem' }}>{upvotes}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '1.5rem' }}>
                    👎 <span style={{ fontSize: '1rem' }}>{downvotes}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DynamicToolPage() {
  const params = useParams();
  const toolName = decodeURIComponent(params.name as string);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/tool/${encodeURIComponent(toolName)}`);
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [toolName]);

  const overallRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return reviews.slice(startIndex, startIndex + itemsPerPage);
  }, [reviews, currentPage]);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [toolName]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}>
        <div className="container py-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px', paddingBottom: '96px' }}>
      <div className="container" style={{ paddingTop: '16px', paddingBottom: '96px' }}>
        <div className="row g-4">
          {/* Left Sidebar - Tool Info */}
          <div className="col-12 col-lg-4">
            <Card className="p-4">
              <div className="text-center mb-4">
                <div
                  style={{
                    width: 96,
                    height: 96,
                    background: '#e5e7eb',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                  }}
                >
                  🔧
                </div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{toolName}</h1>
                <p className="text-muted">Educational Tool</p>
              </div>

              <hr />
              <div className="text-center">
                <div style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {overallRating}
                </div>
                <div className="d-flex justify-content-center mb-2" style={{ gap: '0.25rem' }}>
                  {Stars(Number(overallRating), 48, true, null!)}
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Overall Quality Based on
                  {' '}
                  {reviews.length}
                  {' '}
                  {reviews.length === 1 ? 'rating' : 'ratings'}
                </p>
              </div>

              <Link href={`/rate?tool=${encodeURIComponent(toolName)}`}>
                <Button className="w-100 mt-3">Rate This Tool</Button>
              </Link>
            </Card>
          </div>

          {/* Main Content - Reviews */}
          <div className="col-12 col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
              <h2 style={{ fontSize: '1.5rem' }}>Student Ratings & Reviews</h2>
            </div>

            {reviews.length === 0 ? (
              <Card className="p-4">
                <p className="text-muted text-center mb-0">
                  No reviews yet. Be the first to review
                  {' '}
                  {toolName}
                  !
                </p>
              </Card>
            ) : (
              <>
                <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                  {paginatedReviews.map((review) => (
                    <ReviewWithVoting key={review.id} review={review} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded"
                      style={{
                        backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                        borderColor: '#d1d5db',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded"
                      style={{
                        backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                        borderColor: '#d1d5db',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
