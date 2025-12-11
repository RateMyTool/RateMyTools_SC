'use client';

import Link from 'next/link';
import { memo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ReviewCardProps {
  id: number;
  tool: string;
  school: string;
  subject: string | null;
  courseNumber: string | null;
  rating: number;
  reviewText: string;
  createdAt: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
}

// Memoize the card component to prevent unnecessary re-renders
const ReviewCard = memo(function ReviewCard({
  id,
  tool,
  school,
  subject,
  courseNumber,
  rating,
  reviewText,
  createdAt,
  initialUpvotes = 0,
  initialDownvotes = 0,
}: ReviewCardProps) {
  const classLabel = [subject, courseNumber].filter(Boolean).join(' ');
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    if (!session || isVoting) return;

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
        // Toggle off if same vote, otherwise set new vote
        setUserVote(userVote === voteType ? null : voteType);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Link href={`/reviews/${id}`} className="list-group-item list-group-item-action">
      <div className="d-flex w-100 justify-content-between align-items-start">
        <div className="flex-grow-1">
          <h3 className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {tool}
          </h3>
          <p className="mb-2" style={{ fontSize: '0.95rem', color: '#666', fontWeight: 'bold' }}>
            {school}
          </p>
          {classLabel && (
            <div className="mb-2">
              <strong>Class:</strong>
              {' '}
              {classLabel}
            </div>
          )}
        </div>
        <small className="text-muted" style={{ whiteSpace: 'nowrap', marginLeft: '1rem' }}>
          {new Date(createdAt).toLocaleString()}
        </small>
      </div>
      <p className="mb-1 text-truncate">{reviewText}</p>
      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Rating:
          {' '}
          {rating}
          {' '}
          / 5
        </small>
        {session && (
          <div className="d-flex gap-3">
            <button
              onClick={(e) => handleVote('up', e)}
              className="btn btn-link p-0 text-decoration-none"
              style={{ opacity: userVote === 'up' ? 1 : 0.5, fontSize: '1.5rem' }}
              disabled={isVoting}
            >
              👍
              {' '}
              <span style={{ fontSize: '1rem' }}>{upvotes}</span>
            </button>
            <button
              onClick={(e) => handleVote('down', e)}
              className="btn btn-link p-0 text-decoration-none"
              style={{ opacity: userVote === 'down' ? 1 : 0.5, fontSize: '1.5rem' }}
              disabled={isVoting}
            >
              👎
              {' '}
              <span style={{ fontSize: '1rem' }}>{downvotes}</span>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
});

export default ReviewCard;
