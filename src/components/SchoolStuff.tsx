'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import { useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gray-50 d-flex">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Left Column */}
          <Col>
            <Col>
              <Image
                src="/uhlogo.png"
                alt="UH Logo"
                width={100}
                height={100}
                className="mb-4"
              />
            </Col>
            <Col>
              MIT
              HAWAII
              {schoolName}
              {location}
            </Col>
          </Col>
        </div>
      </div>
    </div>
  );
}
