'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
<<<<<<< HEAD
import { useParams, useRouter } from 'next/navigation';
=======
import { useParams } from 'next/navigation';
>>>>>>> 94b0ca00261e3669fdfe79b7cc00276a4af97ae1
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Stars from '@/components/StarsUI';
import StarSingle from '@/components/StarSingleUI';

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

<<<<<<< HEAD
type SortKey = 'highest' | 'newest';

// Component for individual review with vote counts display
=======
// Component for individual review with interactive voting
>>>>>>> 94b0ca00261e3669fdfe79b7cc00276a4af97ae1
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
      <Card className="p-4" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s', height: '100%' }}>
        <div className="d-flex" style={{ gap: '1rem' }}>
          {/* Rating Box */}
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: '#2563eb',
                color: '#fff',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              {review.rating.toFixed(1)}
            </div>
          </div>

          {/* Review Content */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#4b5563' }}>{review.school}</span>
              {courseLabel && (
                <>
                  <span style={{ color: '#9ca3af', margin: '0 0.4rem' }}>•</span>
                  <span style={{ color: '#4b5563' }}>{courseLabel}</span>
                </>
              )}
              <span style={{ color: '#9ca3af', margin: '0 0.4rem' }}>•</span>
              <span style={{ color: '#9ca3af' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {review.userEmail && (
                <>
                  <span style={{ color: '#9ca3af', margin: '0 0.4rem' }}>•</span>
                  <span style={{ color: '#6b7280' }}>{review.userEmail}</span>
                </>
              )}
            </div>

            <div className="d-flex flex-wrap" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
              {review.tags.map((tag) => (
                <Badge bg="secondary" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>

            <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              {review.reviewText}
            </p>

<<<<<<< HEAD
            {/* Vote Counts Display Only */}
            <div className="d-flex align-items-center justify-content-end" style={{ gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <span style={{ fontSize: '1.25rem' }}>👍</span>
                <span style={{ fontSize: '1rem' }}>{review.upvotes}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <span style={{ fontSize: '1.25rem' }}>👎</span>
                <span style={{ fontSize: '1rem' }}>{review.downvotes}</span>
=======
            {/* Yellow Emoji Thumbs (same as ReviewCard) */}
            {session ? (
              <div className="d-flex align-items-center justify-content-end gap-3">
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
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-end gap-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '1.5rem' }}>
                  👍 <span style={{ fontSize: '1rem' }}>{upvotes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '1.5rem' }}>
                  👎 <span style={{ fontSize: '1rem' }}>{downvotes}</span>
                </div>
>>>>>>> 94b0ca00261e3669fdfe79b7cc00276a4af97ae1
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function DynamicToolPage() {
  const params = useParams();
  const toolName = decodeURIComponent(params.name as string);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('highest');

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

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // 'highest' by helpfulScore desc, then rating desc, then newest
    const helpfulDiff = (b.helpfulScore ?? 0) - (a.helpfulScore ?? 0);
    if (helpfulDiff !== 0) return helpfulDiff;
    const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}>
      <div className="container py-4">
        <div className="row g-4">
          {/* Left Sidebar - Tool Info */}
          <div className="col-12 col-lg-4">
            <Card className="p-4">
              <div className="text-center mb-4">
                <div
                  style={{
                    width: 96,
                    height: 96,
                    background: '#2563eb',
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
              {/* School Data */}
              <div className="px-4">
                <div style={{ borderTop: '1px solid #f3f6f3ff', paddingTop: '16px' }}>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm" style={{ color: '#2a2c31ff' }}>Total Reviews</span>
                    <span className="text-sm font-medium">{reviews.length}</span>
                  </div>
                 <div className="flex justify-between items-center py-2">
                    <span className="text-sm" style={{ color: '#2a2c31ff' }}>Avg. Rating</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      {overallRating}
                      {Number(overallRating) > 0 && StarSingle(0, 1, 16)}
                    </span>
                  </div>
                </div>
              </div>
              </div>

              {/* Rate This Tool Button */}
              <div className="flex justify-center">
                <Link href={`/rate?tool=${encodeURIComponent(toolName)}`}>
                  <Button
                    className="mt-5 mb-4 text-sm font-medium"
                    style={{
                      backgroundColor: '#000',
                      color: 'white',
                      padding: '10px 80px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Rate this Tool
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content - Reviews */}
          <div className="col-12 col-lg-8">

            <div className="flex items-center justify-between pb-3">
              <h3>
                Student Ratings & Reviews
              </h3>
              <select
                className="px-3 py-2 border rounded"
                style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="highest">Most Helpful</option>
                <option value="newest">Newest</option>
              </select>
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
              
              <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                {sortedReviews.map((review) => (
                  <ReviewWithVoting key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
