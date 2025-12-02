import RateToolForm from '@/components/RateToolForm';
import Link from 'next/link';

export const metadata = {
  title: 'Rate a Tool',
};

export default function RatePage() {
  return (
    <main>
      {/* spacer to offset fixed header only on this page */}
      <div style={{ height: 112 }} />
      <div className="container py-4 d-flex flex-column align-items-center">
        <div className="w-75 mb-3">
          <h2 className="mb-1">Rate a Tool</h2>
          <p className="text-muted mb-0">Share your experience with educational tools to help other students</p>
          <div className="mt-3">
            <Link href="/reviews" className="btn btn-outline-primary btn-sm">View Reviews</Link>
          </div>
        </div>
      </div>
      <RateToolForm />
    </main>
  );
}
