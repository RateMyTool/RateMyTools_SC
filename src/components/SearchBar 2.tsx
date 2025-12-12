'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Dropdown } from 'react-bootstrap';

interface SearchBarProps {
  searchType: 'school' | 'tool';
  placeholder: string;
}

export default function SearchBar({ searchType, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
        setShowDropdown(data.results?.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
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
    setQuery(item);
    setShowDropdown(false);

    // Navigate to the appropriate page
    if (searchType === 'school') {
      router.push(`/school/${encodeURIComponent(item)}`);
    } else {
      router.push(`/tool/${encodeURIComponent(item)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // If no results, redirect to rate page with pre-filled data
      if (results.length === 0) {
        router.push(`/rate?${searchType}=${encodeURIComponent(query)}`);
      } else {
        // Use first result
        handleSelect(results[0]);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ fontSize: '1rem', padding: '0.75rem' }}
        />
      </Form>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '0.25rem',
            marginTop: '0.25rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {isLoading ? (
            <div className="p-3 text-center text-muted">Searching...</div>
          ) : (
            <>
              {results.map((item) => (
                <div
                  key={item}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
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
              ))}
              <div
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  color: '#6c757d',
                  fontStyle: 'italic',
                }}
              >
                Not here? Submit a review to add it!
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
