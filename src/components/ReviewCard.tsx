import Link from 'next/link';
import { memo } from 'react';

interface ReviewCardProps {
  id: number;
  tool: string;
  school: string;
  subject: string | null;
  courseNumber: string | null;
  rating: number;
  reviewText: string;
  createdAt: string;
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
}: ReviewCardProps) {
  const classLabel = [subject, courseNumber].filter(Boolean).join(' ');

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
      <small className="text-muted">
        Rating:
        {' '}
        {rating}
        {' '}
        / 5
      </small>
    </Link>
  );
});

export default ReviewCard;
