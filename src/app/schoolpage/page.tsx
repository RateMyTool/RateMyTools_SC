import SchoolStuff from '@/components/SchoolStuff';

export const metadata = {
  title: 'Rate a Tool',
};

export default function SchoolPage() {
  return (
    <main>
      {/* spacer to offset fixed header only on this page */}
      <div style={{ height: 112 }} />
      <div className="container py-4 d-flex flex-column align-items-center">
        <h1 className="mb-4">Rate a Tool</h1>
      </div>
      <SchoolStuff />
    </main>
  );
}
