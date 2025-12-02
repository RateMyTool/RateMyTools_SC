'use client';

/* eslint-disable react/jsx-indent, react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-bracket-location, react/jsx-indent-props, react/jsx-closing-tag-location */

import { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Star, HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';

// Static sample reviews (could later be fetched from DB by tool slug)
interface Review {
  id: number;
  rating: number;
  university: string;
  course: string;
  date: string;
  comment: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

export default function ToolPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      rating: 5.0,
      university: 'Massachusetts Institute of Technology',
      course: 'CS 101',
      date: 'May 15th, 2024',
      comment:
        'Amazing tool! Really helped me understand the concepts. The interface is intuitive and the '
        + 'documentation is clear. Would definitely recommend to anyone starting out.',
      helpful: 24,
      notHelpful: 2,
      tags: ['Great Documentation', 'Easy to Use'],
    },
    {
      id: 2,
      rating: 4.0,
      university: 'Stanford University',
      course: 'CS 250',
      date: 'April 3rd, 2024',
      comment:
        'Good tool overall but has a steep learning curve. Once you get past the initial setup, '
        + 'it becomes much easier to work with. Support community is very active.',
      helpful: 18,
      notHelpful: 5,
      tags: ['Tough Learning Curve', 'Good Support'],
    },
    {
      id: 3,
      rating: 3.5,
      university: 'Harvard University',
      course: 'CS 301',
      date: 'March 21st, 2024',
      comment:
        'It works but there are better alternatives out there. Documentation could be improved. '
        + 'Some features feel outdated.',
      helpful: 12,
      notHelpful: 8,
      tags: ['Okay', 'Needs Updates'],
    },
  ]);

  // Temporary overall rating calc
  const overallRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleHelpful = (id: number, type: 'helpful' | 'notHelpful') => {
    setReviews((prev: Review[]) => prev.map((r: Review) => (r.id === id ? { ...r, [type]: r[type] + 1 } : r)));
  };

  const sorted = reviews; // Placeholder for sort logic when select changes

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>VS Code</h1>
                <p className="text-muted">Development Tool</p>
              </div>

              <hr />
              <div className="mb-4">
                <p style={{ color: '#374151', fontSize: '0.9rem' }}>
                  A powerful, lightweight code editor with built-in support for debugging, syntax highlighting, and
                  version control. Perfect for web development and general programming.
                </p>
                <a
                  href="https://code.visualstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}
                >
                  https://code.visualstudio.com
                </a>
              </div>

              <hr />
              <div className="text-center">
                <div style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '0.5rem' }}>{overallRating}</div>
                <div className="d-flex justify-content-center mb-2" style={{ gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      className={star <= Math.round(Number(overallRating)) ? 'text-warning' : 'text-secondary'}
                      style={star <= Math.round(Number(overallRating)) ? { fill: '#facc15' } : {}}
                    />
                  ))}
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Overall Quality Based on
                  {' '}
                  {reviews.length}
                  {' '}
                  ratings
                </p>
              </div>

              <Button className="w-100 mt-3">Rate This Tool</Button>
            </Card>
          </div>

          {/* Main Content - Reviews */}
          <div className="col-12 col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
              <h2 style={{ fontSize: '1.5rem' }}>Student Ratings & Reviews</h2>
              <select className="form-select" style={{ maxWidth: 220 }} aria-label="Sort reviews">
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
                <option>Most Recent</option>
                <option>Most Helpful</option>
              </select>
            </div>

            <div className="d-flex flex-column" style={{ gap: '1rem' }}>
              {sorted.map((review) => (
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
                        <span style={{ color: '#4b5563' }}>{review.university}</span>
                        <span style={{ color: '#9ca3af', margin: '0 0.4rem' }}>•</span>
                        <span style={{ color: '#4b5563' }}>{review.course}</span>
                        <span style={{ color: '#9ca3af', margin: '0 0.4rem' }}>•</span>
                        <span style={{ color: '#9ca3af' }}>{review.date}</span>
                      </div>

                      <div className="d-flex flex-wrap" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {review.tags.map((tag) => (
                          <Badge bg="secondary" key={tag}>
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{review.comment}</p>

                      <div className="d-flex align-items-center" style={{ gap: '1rem', fontSize: '0.8rem' }}>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleHelpful(review.id, 'helpful')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <HandThumbsUp size={16} />
                          {' '}
                          Helpful
                          {' ('}
                          {review.helpful}
                          )
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleHelpful(review.id, 'notHelpful')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <HandThumbsDown size={16} />
                          {' '}
                          Not Helpful
                          {' ('}
                          {review.notHelpful}
                          )
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-4">
              <Button variant="outline-secondary">Load More Ratings</Button>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
}
