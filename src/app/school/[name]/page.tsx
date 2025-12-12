import SchoolSideBar from '@/components/SchoolSideBar';
import SchoolReviewsList from '@/components/SchoolReviewsList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = {
  params: {
    name: string;
  };
};

export default function DynamicSchoolPage({ params }: Params) {
  const schoolName = decodeURIComponent(params.name);

  return (
    <main>
      <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
        <div className="mx-auto px-4 py-4" style={{ maxWidth: '1400px' }}>
          <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {schoolName}
          </h1>
          <div className="flex gap-4">
            <div style={{ width: '440px', flexShrink: 0 }}>
              <SchoolSideBar school={schoolName} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <SchoolReviewsList school={schoolName} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
