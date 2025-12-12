'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteReviewButtonProps {
  reviewId: number;
}

export default function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      router.push('/reviews');
      router.refresh();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-sm btn-danger"
    >
      {isDeleting ? 'Deleting...' : 'Delete Review'}
    </button>
  );
}
