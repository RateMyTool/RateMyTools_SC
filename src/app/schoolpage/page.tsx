import SchoolStuff from '@/components/SchoolStuff';

export default function SchoolPage() {
  return (
    <main>
      {/* spacer to offset fixed header only on this page */}
      <div style={{ height: 112 }} />
      <div className="container py-4 d-flex flex-column align-items-center">
        <SchoolStuff schoolName="" location="" />
      </div>
    </main>
  );
}
