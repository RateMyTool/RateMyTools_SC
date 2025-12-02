import React from 'react';
import { Star } from 'lucide-react';

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

export default function ToolsList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3">
        <h3>Popular Tools at MIT</h3>
        <select
          className="px-3 py-2 border rounded"
          style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
        >
          <option value="relevance">Most Relevant</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="most">Most Reviewed</option>
          <option value="recent">Newest</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tools.map((tool) => (
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
                    <h3 className="mb-0.5">{tool.name}</h3>
                    <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: '#374151' }}>
                    <Star style={{ width: '16px', height: '16px', fill: '#fbbf24', color: '#fbbf24' }} />
                    <span className="text-sm">
                      {tool.totalRatings}
                      {' '}
                      ratings
                    </span>
                  </div>
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
