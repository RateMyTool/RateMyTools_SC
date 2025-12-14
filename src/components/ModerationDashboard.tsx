'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Tab, Tabs, Card, Modal, Form } from 'react-bootstrap';

interface Review {
  id: number;
  tool: string;
  school: string;
  subject: string | null;
  courseNumber: string | null;
  rating: number;
  reviewText: string;
  tags: string[];
  userEmail: string | null;
  createdAt: string;
  moderationStatus: string;
  moderationReason: string | null;
  flaggedCategories: string[];
}

export default function ModerationDashboard() {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [rejectedReviews, setRejectedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [pendingRes, rejectedRes] = await Promise.all([
        fetch('/api/admin/moderation?status=PENDING'),
        fetch('/api/admin/moderation?status=REJECTED'),
      ]);

      if (!pendingRes.ok || !rejectedRes.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const pendingData = await pendingRes.json();
      const rejectedData = await rejectedRes.json();

      setPendingReviews(pendingData.reviews || []);
      setRejectedReviews(rejectedData.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (reviewId: number) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, approved: true }),
      });

      if (!res.ok) throw new Error('Failed to approve review');

      await fetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (review: Review) => {
    setSelectedReview(review);
    setRejectReason('');
    setShowModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedReview) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: selectedReview.id,
          approved: false,
          reason: rejectReason || 'Rejected by admin',
        }),
      });

      if (!res.ok) throw new Error('Failed to reject review');

      setShowModal(false);
      await fetchReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ReviewTable = ({ reviews, showActions }: { reviews: Review[]; showActions: boolean }) => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tool</th>
          <th>School</th>
          <th>Course</th>
          <th>Rating</th>
          <th>Review</th>
          <th>User</th>
          <th>Date</th>
          <th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {reviews.length === 0 ? (
          <tr>
            <td colSpan={showActions ? 10 : 9} className="text-center py-4">
              No reviews found
            </td>
          </tr>
        ) : (
          reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td><strong>{review.tool}</strong></td>
              <td>{review.school}</td>
              <td>{review.subject} {review.courseNumber}</td>
              <td className="text-warning">{renderStars(review.rating)}</td>
              <td style={{ maxWidth: '300px' }}>
                <div className="text-truncate" title={review.reviewText}>
                  {review.reviewText}
                </div>
                {review.flaggedCategories && review.flaggedCategories.length > 0 && (
                  <div className="mt-1">
                    {review.flaggedCategories.map((cat) => (
                      <Badge key={cat} bg="danger" className="me-1">{cat}</Badge>
                    ))}
                  </div>
                )}
              </td>
              <td>{review.userEmail || 'Anonymous'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{formatDate(review.createdAt)}</td>
              <td>
                <Badge bg={
                  review.moderationStatus === 'APPROVED' ? 'success' :
                  review.moderationStatus === 'REJECTED' ? 'danger' :
                  review.moderationStatus === 'FLAGGED' ? 'warning' : 'secondary'
                }>
                  {review.moderationStatus}
                </Badge>
                {review.moderationReason && (
                  <div className="small text-muted mt-1">{review.moderationReason}</div>
                )}
              </td>
              {showActions && (
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleApprove(review.id)}
                      disabled={actionLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRejectClick(review)}
                      disabled={actionLoading}
                    >
                      Reject
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Moderation Dashboard</h1>
          <p className="text-muted">Review and moderate user-submitted reviews</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{pendingReviews.length}</h3>
              <Card.Text>Pending Reviews</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-danger">{rejectedReviews.length}</h3>
              <Card.Text>Rejected Reviews</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="pending" className="mb-3">
        <Tab eventKey="pending" title={`Pending (${pendingReviews.length})`}>
          <ReviewTable reviews={pendingReviews} showActions={true} />
        </Tab>
        <Tab eventKey="rejected" title={`Rejected (${rejectedReviews.length})`}>
          <ReviewTable reviews={rejectedReviews} showActions={true} />
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <>
              <p><strong>Review:</strong> {selectedReview.reviewText}</p>
              <Form.Group>
                <Form.Label>Reason for rejection (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectConfirm} disabled={actionLoading}>
            {actionLoading ? 'Rejecting...' : 'Reject Review'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
