'use client';

import Stars from '@/components/StarsUI';

/* 
 * Props for ReviewStars component
 * Functions as the stars in the reviews listing page, nonclickable and smaller size
 */

interface ReviewStarsProps {
  rating: number;
}

export default function ReviewStars({ rating }: ReviewStarsProps) {
  return (
    <>
      <style>{`
        #ratedTool-Stars {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin: 0 !important;
          padding: 0 !important;
        }
        #ratedTool-Stars .row {
          margin: 0 !important;
        }
        #ratedTool-Stars .flex {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin: 0;
          padding: 0;
        }
        #ratedTool-Stars button.btn-link {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1;
          vertical-align: middle;
        }
      `}</style>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          margin: 0,
          padding: 0,
          marginBottom: '0.5rem',
        }}
      >
        {Stars(rating, 20, true, null!)}
      </div>
    </>
  );
}
