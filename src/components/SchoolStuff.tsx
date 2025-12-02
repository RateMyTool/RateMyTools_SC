'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import { useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-bootstrap-icons';

  type Tool = {
    id: string
    name: string
    category: string
    rating: number
    ratingsCount: number
    description: string
    tags: string[]
  };

  type SchoolStuffProps = {
    schoolName: string
    location: string
  };

export default function SchoolStuff({
  schoolName = 'Massachusetts Institute of Technology', location = 'Cambridge, MA',
}: SchoolStuffProps) {
  const [subject, setSubject] = useState('All Subjects');
  const [crn, setCrn] = useState('');
  const [sort, setSort] = useState<'Highest Rated' | 'Most Ratings'>('Highest Rated');

  const tools: Tool[] = useMemo(
    () => [
      {
        id: 'vs-code',
        name: 'VS Code',
        category: 'Development Tool',
        rating: 4.5,
        ratingsCount: 247,
        description: 'Lightweight editor with debugging, git, and extensions.',
        tags: ['Documentation', 'Easy', 'Helpful'],
      },
      {
        id: 'github',
        name: 'GitHub',
        category: 'Version Control',
        rating: 4.8,
        ratingsCount: 312,
        description: 'Collaboration platform for hosting and reviewing code.',
        tags: ['Essential', 'Collaboration', 'Standard'],
      },
      {
        id: 'figma',
        name: 'Figma',
        category: 'Design Tool',
        rating: 4.7,
        ratingsCount: 189,
        description: 'Interface design and prototyping for teams in real time.',
        tags: ['Collaborative', 'Intuitive', 'Teams'],
      },
      {
        id: 'slack',
        name: 'Slack',
        category: 'Communication',
        rating: 4.3,
        ratingsCount: 156,
        description: 'Messaging platform with channels, search, and integrations.',
        tags: ['Teams', 'Integrations', 'Notifications'],
      },
      {
        id: 'notion',
        name: 'Notion',
        category: 'Productivity',
        rating: 4.6,
        ratingsCount: 201,
        description: 'Workspace for notes, tasks, and lightweight databases.',
        tags: ['Flexible', 'Templates', 'Databases'],
      },
    ],
    [],
  );

  const sortedTools = useMemo(() => {
    const list = [...tools];
    if (sort === 'Highest Rated') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => b.ratingsCount - a.ratingsCount);
    }
    return list;
  }, [tools, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column */}
          <aside className="md:col-span-4 space-y-6">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <div>
                <Image
                  src="/uhlogo.png"
                  alt="UH Logo"
                  width={100}
                  height={100}
                  className="mb-4"
                />
              </div>
              <div className="text-center">
                MIT {schoolName}
              </div>
              <div className="text-center" style={{ color: 'gray' }}>
                <Icons.GeoAltFill /> HAWAII {location}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-4">
                <div className="rounded bg-gray-100 p-2">
                  <p className="text-xs text-gray-500">Total Tools</p>
                  <p className="font-medium">{tools.length}</p>
                </div>
                <div className="rounded bg-gray-100 p-2">
                  <p className="text-xs text-gray-500">Avg. Rating</p>
                  <p className="font-medium">
                    {(tools.reduce((acc, t) => acc + t.rating, 0) / tools.length).toFixed(2)}
                  </p>
                </div>
                <div className="rounded bg-gray-100 p-2">
                  <p className="text-xs text-gray-500">Total Reviews</p>
                  <p className="font-medium">
                    {tools.reduce((acc, t) => acc + t.ratingsCount, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Filters</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={[
                      'w-full rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      'text-sm',
                    ].join(' ')}
                  >
                    <option>All</option>
                    <option>Computer Science</option>
                    <option>Design</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="crn" className="block text-sm font-medium text-gray-700 mb-1">CRN</label>
                  <input
                    id="crn"
                    type="text"
                    value={crn}
                    onChange={(e) => setCrn(e.target.value)}
                    placeholder="e.g. 12345"
                    className={[
                      'w-full rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      'text-sm',
                    ].join(' ')}
                  />
                </div>
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'Highest Rated' | 'Most Ratings')}
                    className={[
                      'w-full rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      'text-sm',
                    ].join(' ')}
                  >
                    <option>Most Relevant</option>
                    <option>Highest Rated</option>
                    <option>Lowest Rated</option>
                    <option>Most Reviewed</option>
                    <option>Most Recent</option>
                  </select>
                </div>
                <div className="pt-2">
                  <a
                    href="/add"
                    className={[
                      'inline-flex w-full justify-center rounded bg-indigo-600 px-4 py-2',
                      'text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none',
                      'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    ].join(' ')}
                  >
                    Rate a Tool
                  </a>
                </div>
              </form>
            </div>
          </aside>
          {/* Right Column */}
          <section className="md:col-span-8">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Tools</h2>
              {/* Content goes here */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
