'use client';

import { memo, useState } from 'react';
import Link from 'next/link';

interface ReviewCardProps {
  id: number;
  tool: string;
  school: string;
  subject: string;
  courseNumber: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

const ReviewCard = memo(function ReviewCard({
  id,
  tool,
  school,
  subject,
  courseNumber,
  rating,
  reviewText,
  createdAt,
}: ReviewCardProps) {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const classLabel = [subject, courseNumber].filter(Boolean).join(' ');
  const date = new Date(createdAt).toLocaleString();

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (userVote === 'up') {
      setUpvotes(Math.max(0, upvotes - 1));
      setUserVote(null);
    } else {
      if (userVote === 'down') setDownvotes(Math.max(0, downvotes - 1));
      setUpvotes(upvotes + 1);
      setUserVote('up');
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (userVote === 'down') {
      setDownvotes(Math.max(0, downvotes - 1));
      setUserVote(null);
    } else {
      if (userVote === 'up') setUpvotes(Math.max(0, upvotes - 1));
      setDownvotes(downvotes + 1);
      setUserVote('down');
    }
  };

  return (
    <Link 
      href={`/reviews/${id}`} 
      className="list-group-item list-group-item-action rounded"
      style={{ textDecoration: 'none' }}
    >
      <div className="d-flex w-100 justify-content-between align-items-start">
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {tool}
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#6c757d', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {school}
          </p>
          {classLabel && (
            <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <strong>Class:</strong> {classLabel}
            </div>
          )}
          <div style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>
            {rating === 1 ? '👎 Not Recommended' : rating === 5 ? '👍 Recommended' : '❓ Neutral'}
          </div>
          <p style={{ marginBottom: '1rem', color: '#495057' }}>
            {reviewText.length > 150 ? reviewText.substring(0, 150) + '...' : reviewText}
          </p>
          <div className="d-flex gap-3 align-items-center" onClick={(e) => e.preventDefault()}>
            <button
              onClick={handleUpvote}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                fontSize: '1.5rem',
                opacity: userVote === 'up' ? 1 : 0.6,
              }}
              title="Agree with this review"
            >
              👍
            </button>
            <small style={{ color: '#6c757d' }}>{upvotes}</small>
            <button
              onClick={handleDownvote}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                fontSize: '1.5rem',
                opacity: userVote === 'down' ? 1 : 0.6,
              }}
              title="Disagree with this review"
            >
              👎
            </button>
            <small style={{ color: '#6c757d' }}>{downvotes}</small>
          </div>
        </div>
        <small style={{ color: '#6c757d', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
          {date}
        </small>
      </div>
    </Link>
  );
});

export default ReviewCard;
