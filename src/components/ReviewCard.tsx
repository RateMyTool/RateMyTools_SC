'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import { Badge } from 'react-bootstrap';
import ReviewStars from './ReviewStars';

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
  tags?: string[];
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
  tags = [],
}: ReviewCardProps) {
  const classLabel = [subject, courseNumber].filter(Boolean).join(' ');
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
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
      <div className="d-flex w-100 justify-content-between align-items-start" style={{ marginTop: '4px'}}>
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
        <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
          <div><ReviewStars rating={rating} /></div>
          {tags && tags.length > 0 && (
            <div className="d-flex flex-wrap" style={{ gap: '0.3rem' }}>
              {tags.map((tag) => (
                <Badge bg="secondary" key={tag} style={{ fontSize: '0.75rem' }}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
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
      </div>
    </Link>
  );
});

export default ReviewCard;
