'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addRating } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddRatingSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: { rating: number; comment: string; stuffId: number; userId: number }) => {
  await addRating(data);
  swal('Success', 'Your rating has been submitted', 'success', {
    timer: 2000,
  });
};

interface RateStuffFormProps {
  stuffId: number;
  stuffName: string;
  // eslint-disable-next-line react/require-default-props
  existingRating?: { rating: number; comment: string } | null | undefined;
}

const RateStuffForm = ({ stuffId, stuffName, existingRating = null }: RateStuffFormProps) => {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : 0;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddRatingSchema),
    defaultValues: {
      rating: existingRating?.rating || 5,
      comment: existingRating?.comment || '',
    },
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Col className="text-center">
            <h2>
              Rate:
              {' '}
              {stuffName}
            </h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Rating (1-5 stars)</Form.Label>
                  <select {...register('rating')} className={`form-control ${errors.rating ? 'is-invalid' : ''}`}>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  <div className="invalid-feedback">{errors.rating?.message}</div>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Comment (optional)</Form.Label>
                  <textarea
                    {...register('comment')}
                    className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                    rows={4}
                    placeholder="Share your experience with this tool..."
                  />
                  <div className="invalid-feedback">{errors.comment?.message}</div>
                </Form.Group>
                <input type="hidden" {...register('stuffId')} value={stuffId} />
                <input type="hidden" {...register('userId')} value={currentUserId} />
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        {existingRating ? 'Update Rating' : 'Submit Rating'}
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RateStuffForm;
