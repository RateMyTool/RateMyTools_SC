import TopMenu from '@/components/TopMenu';
import SchoolSideBar from '@/components/SchoolSideBar';
import ToolsList from '@/components/ToolsList';

export default function SchoolPage() {
  return (
    <main>
      <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
        <TopMenu title="TOOLS" />
        <div style={{ height: '80px' }} />
        <div className="mx-auto px-4 py-4" style={{ maxWidth: '1400px' }}>
          <div className="flex gap-4">
            <div style={{ width: '440px', flexShrink: 0 }}>
              <SchoolSideBar />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ToolsList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
