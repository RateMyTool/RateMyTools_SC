'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'react-bootstrap-icons';

interface MiddleMenuProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
}

const MiddleMenu: React.FC<MiddleMenuProps> = ({ setTitle, title }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Classes to adjust components from active/inactive status
  const isCollege = title === 'SCHOOLS';
  const searchType = isCollege ? 'school' : 'tool';

  const collegeBtnClasses = [
    'flex items-center rounded px-3 py-2 text-lg font-medium gap-3',
    isCollege ? 'bg-black text-white hover:opacity-90' : 'bg-white text-black hover:bg-gray-100',
  ].join(' ');

  const toolBtnClasses = [
    'flex items-center rounded px-3 py-2 text-lg font-medium gap-3',
    !isCollege ? 'bg-black text-white hover:opacity-90' : 'bg-white text-black hover:bg-gray-100',
  ].join(' ');

  // Search functionality
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${searchType}`,
        );
        const data = await response.json();
        setResults(data.results || []);
        setShowDropdown(true); // Always show dropdown when query is 2+ characters
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowDropdown(true); // Still show dropdown to display "Not here" message
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query, searchType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: string) => {
    setQuery('');
    setShowDropdown(false);

    // Navigate to the appropriate page
    if (isCollege) {
      router.push(`/school/${encodeURIComponent(item)}`);
    } else {
      router.push(`/tool/${encodeURIComponent(item)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // If no results, redirect to rate page
      if (results.length === 0) {
        const param = isCollege ? 'school' : 'tool';
        router.push(`/rate?${param}=${encodeURIComponent(query)}`);
      } else {
        // Use first result
        handleSelect(results[0]);
      }
    }
  };

  return (
    <div className="pt-16">
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/ratemytools-background.jpg')",
        }}
      >
        {/* Overlay Content */}
        <div className="flex flex-col items-center px-4 w-full">
          {/* Buttons */}
          <div className="flex gap-3 mb-10">
            <button
              onClick={() => {
                setTitle('SCHOOLS');
                setQuery('');
                setShowDropdown(false);
              }}
              className={collegeBtnClasses}
              type="button"
            >
              <Icons.Mortarboard />
              Search by College
            </button>
            <button
              onClick={() => {
                setTitle('TOOLS');
                setQuery('');
                setShowDropdown(false);
              }}
              className={toolBtnClasses}
              type="button"
            >
              <Icons.Wrench />
              Search by Tool
            </button>
          </div>

          {/* Text */}
          <h2 className="text-white text-2xl font-semibold mt-4 mb-4">
            {isCollege ? (
              <>
                Enter your
                {' '}
                <strong>school</strong>
                {' '}
                to get started
              </>
            ) : (
              <>
                Find a
                {' '}
                <strong>Tool</strong>
              </>
            )}
          </h2>

          {/* Search Bar with Dropdown */}
          <div className="w-2/5 mt-2" ref={dropdownRef}>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isCollege ? 'Your school' : 'Tool name'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={[
                    'w-full',
                    'rounded-full',
                    'px-5',
                    'py-3',
                    'text-lg',
                    'bg-white',
                    'shadow',
                    'focus:outline-none',
                    'placeholder-gray-500',
                  ].join(' ')}
                />

                {/* Dropdown Results */}
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.75rem',
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : (
                      <>
                        {results.length > 0 ? (
                          results.map((item) => (
                            <div
                              key={item}
                              onClick={() => handleSelect(item)}
                              style={{
                                padding: '0.75rem 1.25rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                color: '#333',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                              }}
                            >
                              {item}
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              padding: '0.75rem 1.25rem',
                              color: '#6c757d',
                              textAlign: 'center',
                            }}
                          >
                            No results found
                          </div>
                        )}
                        <div
                          style={{
                            padding: '0.75rem 1.25rem',
                            fontSize: '0.875rem',
                            color: '#6c757d',
                            fontStyle: 'italic',
                            borderTop: results.length > 0 ? '1px solid #f0f0f0' : 'none',
                          }}
                        >
                          Not here? Rate it to add it!
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Alternative Link */}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setTitle(isCollege ? 'TOOLS' : 'SCHOOLS');
              setQuery('');
              setShowDropdown(false);
            }}
            className="pt-3 text-white text-lg hover:text-gray-200 hover:underline transition no-underline"
          >
            {isCollege ? 'Find Tool by name' : 'Find Tool by school'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiddleMenu;
