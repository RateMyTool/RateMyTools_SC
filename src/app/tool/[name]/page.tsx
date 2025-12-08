'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useParams } from 'next/navigation';
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
}

export default function DynamicToolPage() {
  const params = useParams();
  const toolName = decodeURIComponent(params.name as string);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/tool/${encodeURIComponent(toolName)}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setReviews(data.reviews || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [toolName]);

  const overallRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  // Skeleton loader
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}>
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <Card className="p-4 animate-pulse">
                <div style={{ height: 96, backgroundColor: '#e5e7eb', borderRadius: '50%', marginBottom: '1rem' }} />
                <div style={{ height: 24, backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ height: 16, backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
              </Card>
            </div>
            <div className="col-12 col-lg-8">
              <div style={{ height: 200, backgroundColor: '#e5e7eb', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}>
        <div className="container py-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: '80px' }}>
      <div className="container py-4">
        <div className="row g-4">
          {/* Tool summary */}
          <div className="col-12 col-lg-4">
            <Card className="p-4 h-100">
              <div className="text-center mb-3">
                <div style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {toolName}
                </div>
                <p className="text-muted mb-0">Educational Tool</p>
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
              <h2 style={{ fontSize: '1.5rem' }}>Student Reviews</h2>
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
                {reviews.map((review) => {
                  const courseLabel = [review.subject, review.courseNumber]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <Card key={review.id} className="p-4">
                      <div className="d-flex" style={{ gap: '1rem' }}>
                        {/* Rating Box */}
                        <div style={{ flexShrink: 0 }}>
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              background: '#16a34a',
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
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
