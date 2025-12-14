'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarSingle from '@/components/StarSingleUI';

interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
  upvotes?: number;
  downvotes?: number;
}

type SortKey = 'relevance' | 'highest' | 'lowest' | 'most' | 'recent';

interface ToolsListProps {
  school: string;
}

export default function ToolsList({ school }: ToolsListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState<SortKey>('relevance');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      case 'relevance':
      default:
        break;
    }

    return list;
  }, [tools, sortBy]);

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
      <div className="flex items-center justify-between mb-6 pb-3">
        <h3>
          Popular Tools at
          {' '}
          {school}
        </h3>
        <select
          className="px-3 py-2 border rounded"
          style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
        >
          <option value="relevance">Most Relevant</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="most">Most Reviewed</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedTools.map((tool) => (
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
                  <div className="flex items-center gap-1">
                    {StarSingle(0, 1, 16)}
                    <span className="text-sm">
                      {tool.totalRatings}
                      {' '}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-3" style={{ color: '#374151' }}>{tool.description}</p>

                {/* Tags and Voting */}
                <div className="flex justify-between items-center">
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

                  {/* Yellow Emoji Thumbs */}
                  <div className="flex items-center gap-3 ml-3">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: session ? 1 : 0.5, fontSize: '1.5rem' }}>
                      👍 <span style={{ fontSize: '1rem' }}>{tool.upvotes || 0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: session ? 1 : 0.5, fontSize: '1.5rem' }}>
                      👎 <span style={{ fontSize: '1rem' }}>{tool.downvotes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
