'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState, useEffect } from 'react';
import { MapPin, School } from 'lucide-react';
import { useRouter } from 'next/navigation';

import StarSingle from '@/components/StarSingleUI';

interface SchoolSideBarProps {
  school: string;
}

interface SchoolStats {
  totalTools: number;
  totalReviews: number;
  avgRating: number;
}

export default function SchoolSideBar({ school }: SchoolSideBarProps) {
  const router = useRouter();
  const [stats, setStats] = useState<SchoolStats>({
    totalTools: 0,
    totalReviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/school/${encodeURIComponent(school)}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching school stats:', error);
      }
    };

    fetchStats();
  }, [school]);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* School Info Card */}
      <div className="p-6" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        {/* Top-left column: School logo, name, location, data, and "Rate A Tool" button */}
        <div className="text-center mb-6 py-4 px-4">

          {/* School Logo */}
          <div
            className="mx-auto mb-3 flex items-center justify-center"
            style={{ width: '96px', height: '96px', backgroundColor: '#2563eb', borderRadius: '50%' }}
          >
            <School style={{ width: '48px', height: '48px', color: 'white' }} />
          </div>

          {/* School Name */}
          <h3 className="mb-2" style={{ fontWeight: '400' }}>{school}</h3>
          <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#4f545eff' }}>
            <MapPin style={{ width: '18px', height: '18px' }} />
            <span>University</span>
          </div>
        </div>

        {/* School Data */}
        <div className="px-4" style={{ paddingTop: '16px' }}>
          <div style={{ borderTop: '1px solid #f3f6f3ff', paddingTop: '16px' }}>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: '#2a2c31ff' }}>Total Tools</span>
              <span className="text-sm font-medium">{stats.totalTools}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: '#2a2c31ff' }}>Total Reviews</span>
              <span className="text-sm font-medium">{stats.totalReviews}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: '#2a2c31ff' }}>Avg. Rating</span>
              <span className="text-sm font-medium flex items-center gap-1">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
                {stats.avgRating > 0 && StarSingle(0, 1, 16)}
              </span>
            </div>
          </div>
        </div>

        {/* Rate A Tool Button */}
        <div className="flex justify-center px-4">
          <button
            type="button"
            className="mt-5 mb-4 text-sm font-medium"
            onClick={() => router.push(`/rate?school=${encodeURIComponent(school)}`)}
            style={{
              backgroundColor: '#000',
              color: 'white',
              padding: '10px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              width: '75%',
            }}
          >
            Rate a Tool
          </button>
        </div>
      </div>
    </aside>
  );
}
