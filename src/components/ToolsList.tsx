'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import StarSingle from '@/components/StarSingleUI';

interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
}

interface ToolsListProps {
  school: string;
}

export default function ToolsList({ school }: ToolsListProps) {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('lowest');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`/api/school/${encodeURIComponent(school)}/tools`);
        const data = await response.json();
        setTools(data.tools || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, [school]);

  const sortedTools = useMemo(() => {
    const list = [...tools];
    
    switch (sortBy) {
      case 'highest':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        list.sort((a, b) => a.rating - b.rating);
        break;
      case 'most':
        list.sort((a, b) => b.totalRatings - a.totalRatings);
        break;
      default:
        list.sort((a, b) => a.rating - b.rating);
    }
    
    return list;
  }, [tools]);

  // Paginate the tools
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTools.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTools, currentPage]);

  const totalPages = Math.ceil(sortedTools.length / itemsPerPage);

  if (isLoading) {
    return <div>Loading tools...</div>;
  }

  if (tools.length === 0) {
    return (
      <div className="p-6 text-center" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <p className="text-gray-600">No tools reviewed for {school} yet.</p>
        <p className="text-sm text-gray-500 mt-2">Be the first to rate a tool!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-3 flex justify-between items-center">
        <h3>
          Tools at {school}
        </h3>
        <div style={{ minWidth: '200px' }}>
          <select
            className="w-full px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
            }}
          >
            <option value="lowest">Lowest Rated</option>
            <option value="highest">Highest Rated</option>
            <option value="most">Most Reviewed</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {paginatedTools.map((tool) => (
          <div
            key={tool.name}
            className="p-4"
            style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px' }}
          >
            <div className="flex gap-4">
              {/* Rating Badge */}
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-center text-white px-4 py-4"
                  style={{ backgroundColor: '#2563eb', borderRadius: '4px', fontSize: '20px', fontWeight: '300' }}
                >
                  {tool.rating.toFixed(1)}
                </div>
              </div>

              {/* Tool Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      type="button"
                      className="mb-0.5 text-left"
                      onClick={() => router.push(`/tool/${encodeURIComponent(tool.name)}`)}
                      style={{
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                      }}
                    >
                      {tool.name}
                    </button>
                    <p className="text-sm mb-2" style={{ color: '#6b7280' }}>Educational Tool</p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tool/${encodeURIComponent(tool.name)}`);
                    }}
                    style={{ color: '#374151', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  >
                    {StarSingle(0, 1, 16)}
                    <span className="text-sm">
                      {tool.totalRatings}
                      {' '}
                    </span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm mb-3" style={{ color: '#374151' }}>{tool.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-sm"
                      style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded"
            style={{
              backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
              borderColor: '#d1d5db',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded"
            style={{
              backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
              borderColor: '#d1d5db',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
