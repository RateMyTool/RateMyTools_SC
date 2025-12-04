'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import StarSingle from '@/components/StarSingleUI';

const tools = [
  {
    id: 1,
    name: 'VS Code',
    category: 'Development Tool',
    rating: 4.5,
    totalRatings: 247,
    description: 'A powerful, lightweight code editor with built-in support for debugging and version control.'
    + ' A powerful, lightweight code editor with built-in support for debugging and version control.'
    + ' A powerful, lightweight code editor with built-in support for debugging and version control.',
    tags: ['Great Documentation', 'Easy to Use', 'Helpful'],
  },
  {
    id: 2,
    name: 'GitHub',
    category: 'Version Control',
    rating: 4.8,
    totalRatings: 312,
    description: 'Platform for version control and collaboration. Essential for team projects.',
    tags: ['Essential', 'Collaboration', 'Industry Standard'],
  },
  {
    id: 3,
    name: 'Figma',
    category: 'Design Tool',
    rating: 4.7,
    totalRatings: 189,
    description: 'Collaborative interface design tool with powerful prototyping features.',
    tags: ['Collaborative', 'Intuitive', 'Great for Teams'],
  },
  {
    id: 4,
    name: 'Slack',
    category: 'Communication',
    rating: 4.3,
    totalRatings: 156,
    description: 'Team communication platform for messaging and file sharing.',
    tags: ['Good for Teams', 'Integrations', 'Notifications'],
  },
  {
    id: 5,
    name: 'Notion',
    category: 'Productivity',
    rating: 4.6,
    totalRatings: 201,
    description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    tags: ['Versatile', 'Customizable', 'Great for Organization'],
  },
];

type SortKey = 'relevance' | 'highest' | 'lowest' | 'most' | 'recent';

export default function ToolsList() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortKey>('relevance');

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
      case 'recent':
        // No real dates yet; use id DESC as a stand‑in for "newest".
        list.sort((a, b) => b.id - a.id);
        break;
      case 'relevance':
      default:
        // Keep original order for now; could plug in a relevance score later.
        break;
    }

    return list;
  }, [sortBy]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3">
        <h3>Popular Tools at MIT</h3>
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
          <option value="recent">Newest</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedTools.map((tool) => (
          <div
            key={tool.id}
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
                  {tool.rating}
                </div>
              </div>

              {/* Tool Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      type="button"
                      className="mb-0.5 text-left"
                      onClick={() => router.push(`/tool/${tool.id}`)}
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
                    <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{tool.category}</p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tool/${tool.id}/ratings`);
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
    </div>
  );
}
