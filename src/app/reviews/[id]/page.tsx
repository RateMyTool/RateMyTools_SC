'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from 'react-bootstrap';
import DeleteReviewButton from '@/components/DeleteReviewButton';
import ReviewStars from '@/components/ReviewStars';

interface Review {
  id: number;
  tool: string;
  school: string;
  subject?: string;
  courseNumber?: string;
  rating: number;
  tags: string[];
  reviewText: string;
  userEmail?: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export default function ReviewDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const id = Number(params.id);
  const fromPage = searchParams.get('from') || '1';

  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewResponse = await fetch(`/api/reviews/${id}`);
        
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          setReview(reviewData);
          setUpvotes(reviewData.upvotes || 0);
          setDownvotes(reviewData.downvotes || 0);
        }

        if (session?.user?.email) {
          const userResponse = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setIsAdmin(userData.role === 'ADMIN');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, session]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/reviews/${id}/vote`, {
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

  if (isLoading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ height: '80px' }} />
        <div className="container py-4">
          <h1 className="mb-3">Review Not Found</h1>
          <p className="text-muted">This review does not exist.</p>
          <Link href={`/reviews?page=${fromPage}`} className="btn btn-sm btn-outline-primary">
            Back to Reviews
          </Link>
        </div>
      </main>
    );
  }

  const classLabel = [review.subject, review.courseNumber].filter(Boolean).join(' ');
  const isOwner = session?.user?.email === review.userEmail;
  const canDelete = isOwner || isAdmin;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ height: '80px' }} />
      <div className="container py-4">
        <div className="card p-4 shadow-sm" style={{ backgroundColor: 'white', borderRadius: '12px' }}>
          <h1 className="mb-2">
            {review.tool} — {review.school}
          </h1>
          {classLabel && (
            <p className="mb-1">
              <strong>Class:</strong> {classLabel}
            </p>
          )}
          <div className="mb-2"><ReviewStars rating={review.rating} /></div>
          {review.tags && review.tags.length > 0 && (
            <div className="d-flex flex-wrap mb-3" style={{ gap: '0.5rem' }}>
              {review.tags.map((tag) => (
                <Badge bg="secondary" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {review.userEmail && (
            <p className="mb-1">
              <strong>Posted by:</strong> {review.userEmail}
            </p>
          )}
          <hr />
          <div className="mb-3">{review.reviewText}</div>
          <small className="text-muted">
            Posted: {new Date(review.createdAt).toLocaleString()}
          </small>

          <hr className="mt-4 mb-3" />
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Was this review helpful?</h5>
            <div className="d-flex gap-3">
              <button
                onClick={() => handleVote('up')}
                className="btn btn-link p-0 text-decoration-none"
                style={{ opacity: userVote === 'up' ? 1 : 0.5, fontSize: '1.5rem' }}
                disabled={isVoting}
              >
                👍 <span style={{ fontSize: '1rem' }}>{upvotes}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                className="btn btn-link p-0 text-decoration-none"
                style={{ opacity: userVote === 'down' ? 1 : 0.5, fontSize: '1.5rem' }}
                disabled={isVoting}
              >
                👎 <span style={{ fontSize: '1rem' }}>{downvotes}</span>
              </button>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Link href={`/reviews?page=${fromPage}`} className="btn btn-sm btn-outline-secondary">
              ← Back to Reviews (Page {fromPage})
            </Link>
            {canDelete && <DeleteReviewButton reviewId={id} />}
          </div>
        </div>
      </div>
    </main>
  );
}
