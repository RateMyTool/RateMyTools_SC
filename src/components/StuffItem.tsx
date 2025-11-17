import { Stuff } from '@prisma/client';
import Link from 'next/link';

interface StuffWithRatings extends Stuff {
  // eslint-disable-next-line react/require-default-props
  ratings?: Array<{ rating: number }> | undefined;
}

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const StuffItem = ({ name, quantity, condition, id, ratings = undefined }: StuffWithRatings) => {
  // Calculate average rating if ratings exist
  let avgRating = null;
  if (ratings && ratings.length > 0) {
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    avgRating = (sum / ratings.length).toFixed(1);
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{quantity}</td>
      <td>{condition}</td>
      <td>
        {avgRating ? (
          <span>
            {'⭐'.repeat(Math.round(parseFloat(avgRating)))}
            {' '}
            (
            {avgRating}
            )
          </span>
        ) : (
          <span className="text-muted">No ratings</span>
        )}
      </td>
      <td>
        <Link href={`/edit/${id}`}>Edit</Link>
      </td>
    </tr>
  );
};

export default StuffItem;
