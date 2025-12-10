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

  const isCollege = title === 'SCHOOLS';
  const searchType = isCollege ? 'school' : 'tool';

  const collegeBtnClasses = [
    'flex items-center rounded px-3 py-2 text-sm md:text-lg font-medium gap-2 md:gap-3',
    isCollege ? 'bg-black text-white hover:opacity-90' : 'bg-white text-black hover:bg-gray-100',
  ].join(' ');

  const toolBtnClasses = [
    'flex items-center rounded px-3 py-2 text-sm md:text-lg font-medium gap-2 md:gap-3',
    !isCollege ? 'bg-black text-white hover:opacity-90' : 'bg-white text-black hover:bg-gray-100',
  ].join(' ');

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
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowDropdown(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query, searchType]);

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

    if (isCollege) {
      router.push(`/school/${encodeURIComponent(item)}`);
    } else {
      router.push(`/tool/${encodeURIComponent(item)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (results.length === 0) {
        const param = isCollege ? 'school' : 'tool';
        router.push(`/rate?${param}=${encodeURIComponent(query)}`);
      } else {
        handleSelect(results[0]);
      }
    }
  };

  return (
    <div className="pt-14 md:pt-16">
      <div
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/ratemytools-background.jpg')",
        }}
      >
        <div className="flex flex-col items-center w-full max-w-3xl">
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10 w-full sm:w-auto">
            <button
              onClick={() => {
                setTitle('SCHOOLS');
                setQuery('');
                setShowDropdown(false);
              }}
              className={collegeBtnClasses}
              type="button"
            >
              <Icons.Mortarboard size={20} />
              <span className="whitespace-nowrap">Search by College</span>
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
              <Icons.Wrench size={20} />
              <span className="whitespace-nowrap">Search by Tool</span>
            </button>
          </div>

          {/* Text */}
          <h2 className="text-white text-xl md:text-2xl font-semibold mt-2 md:mt-4 mb-3 md:mb-4 text-center px-4">
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
          <div className="w-full md:w-4/5 lg:w-3/5 mt-2 px-4 sm:px-0" ref={dropdownRef}>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isCollege ? 'Your school' : 'Tool name'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full px-4 md:px-5 py-2 md:py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />

                {/* Dropdown Results */}
                {showDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl mt-2 shadow-lg z-50 max-h-80 overflow-y-auto"
                  >
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500 text-sm md:text-base">Searching...</div>
                    ) : (
                      <>
                        {results.length > 0 ? (
                          results.map((item) => (
                            <div
                              key={item}
                              onClick={() => handleSelect(item)}
                              className="px-4 py-3 cursor-pointer border-b border-gray-100 text-gray-800 hover:bg-gray-50 text-sm md:text-base"
                            >
                              {item}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-gray-500 text-sm md:text-base">
                            No results found
                          </div>
                        )}
                        <div className="px-4 py-3 text-xs md:text-sm text-gray-500 italic border-t border-gray-100">
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
            className="pt-3 text-white text-base md:text-lg hover:text-gray-200 hover:underline transition no-underline"
          >
            {isCollege ? 'Find Tool by name' : 'Find Tool by school'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiddleMenu;
