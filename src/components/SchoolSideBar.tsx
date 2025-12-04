'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { MapPin, School } from 'lucide-react';
import { useRouter } from 'next/navigation';

import StarSingle from '@/components/StarSingleUI';

export default function SchoolSideBar() {
  const router = useRouter();
  const [subject, setSubject] = useState('all');
  const [crn, setCrn] = useState('');

  const handleClear = () => {
    setSubject('all');
    setCrn('');
  };

  const handleApply = () => {
    console.log('Applying filters:', { subject, crn });
  };

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

          {/* School Name and Location */}
          <h3 className="mb-2" style={{ fontWeight: '400' }}>Massachusetts Institute of Technology</h3>
          <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#4f545eff' }}>
            <MapPin style={{ width: '18px', height: '18px' }} />
            <span>Cambridge, MA</span>
          </div>
        </div>

        {/* School Data */}
        <div className="px-4" style={{ paddingTop: '16px' }}>
          <div style={{ borderTop: '1px solid #f3f6f3ff', paddingTop: '16px' }}>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: '#2a2c31ff' }}>Total Tools</span>
              <span className="text-sm font-medium">127</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: '#2a2c31ff' }}>Total Reviews</span>
              <span className="text-sm font-medium">3,248</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: '#2a2c31ff' }}>Avg. Rating</span>
              <span className="text-sm font-medium flex items-center gap-1">
                4.5
                {StarSingle(0, 1, 16)}
              </span>
            </div>
          </div>
        </div>

        {/* Rate A Tool Button */}
        <div className="flex justify-center px-4">
          {/* Routing to Rate page to be implemented */}
          <button
            type="button"
            className="mt-5 mb-4 text-sm font-medium"
            onClick={() => router.push('/')}
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

      {/* Filters Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>

        {/* Filters Header */}
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#6b7280' }}>
            <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-medium text-sm">Filters</span>
        </div>

        {/* Filter Options: General Subject */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="subject" className="block text-sm mb-2 mt-2" style={{ color: '#374151' }}>
              General Subject
            </label>
            <select
              id="subject"
              className="w-full px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Subjects</option>
              <option value="math">Math</option>
              <option value="language">Language</option>
              <option value="cs">Computer Science</option>
            </select>
          </div>

          {/* Filter Options: Course Reference Number (CRN) */}
          <div className="mt-2">
            <label htmlFor="crn" className="block text-sm mb-2" style={{ color: '#374151' }}>
              Course Reference Number (CRN)
            </label>
            <input
              id="crn"
              type="text"
              placeholder="e.g., 12345"
              className="w-full px-3 py-2 text-sm"
              value={crn}
              onChange={(e) => setCrn(e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="flex-1 py-2 text-sm font-medium"
              onClick={handleClear}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-sm font-medium"
              onClick={handleApply}
              style={{
                backgroundColor: '#000',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
