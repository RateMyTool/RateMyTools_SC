"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import StarSingle from '@/components/StarSingleUI';

const availableTags = ['Easy to Use', 'Free', 'Expensive', 'Buggy'];

// Sample schools and tools - in a real app, these would come from the database
const SCHOOLS = [
  { id: 1, name: 'University of Texas at Austin' },
  { id: 2, name: 'Massachusetts Institute of Technology' },
];

const TOOLS = [
  { id: 1, name: 'Canvas' },
  { id: 2, name: 'Brightspace' },
  { id: 3, name: 'Google Classroom' },
];

export default function RateToolForm() {
  const { status } = useSession();

  const [schoolId, setSchoolId] = useState('');
  const [toolId, setToolId] = useState('');
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(availableTags);
  const [newTag, setNewTag] = useState('');
  const [review, setReview] = useState('');

  function toggleTag(tag: string) {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  }

  function addTag(tag?: string) {
    const t = (tag ?? newTag).trim();
    if (!t) return;
    // add to master list if missing
    setAllTags((existing) => (existing.includes(t) ? existing : [...existing, t]));
    // mark as selected if not already
    setTags((existing) => (existing.includes(t) ? existing : [...existing, t]));
    setNewTag('');
  }

  function clearForm() {
    setSchoolId('');
    setToolId('');
    setSubject('');
    setCourseNumber('');
    setRating(0);
    setTags([]);
    setReview('');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'authenticated') {
      // Open the app's auth modal so users can sign in without leaving the page
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
      return;
    }
    const payload = { schoolId, toolId, subject, courseNumber, rating, tags, review };
    // basic client validation
    if (!schoolId || !toolId || !rating || review.trim().length < 10) {
      alert('Please provide a school, tool, rating and a longer review (min 10 chars).');
      return;
    }

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || 'Failed to submit review');
        }
        return res.json();
      })
      .then(() => {
        alert('Review submitted — thank you!');
        clearForm();
        window.location.href = '/reviews';
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        alert('Failed to submit review. Please try again later.');
      });
  }

  return (
    <div className="container d-flex justify-content-center">
      <div className="card w-75 p-4 mb-5 ">
        <form onSubmit={submit}>
          {status === 'unauthenticated' && (
            <div className="alert alert-warning d-flex justify-content-between align-items-center">
              <div>Please sign in to submit a review.</div>
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }))}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Select Your School <span style={{ color: 'red' }}>*</span></label>
            <select
              className="form-control"
              style={{ backgroundColor: schoolId ? 'white' : '#f0f0f0' }}
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
            >
              <option disabled value="">-- Choose a School --</option>
              {SCHOOLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Your Tool <span style={{ color: 'red' }}>*</span></label>
            <select
              className="form-control"
              style={{ backgroundColor: toolId ? 'white' : '#f0f0f0' }}
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
            >
              <option disabled value="">-- Select a tool --</option>
              {TOOLS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6c757d' }}>
              Don&apos;t see your tool? We&apos;ll add it after you submit.
              </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Course Subject</label>
              <input
                className="form-control"
                placeholder="Type a subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Course Number / CRN</label>
              <input className="form-control" placeholder="e.g., CS 101 or 12345" value={courseNumber} onChange={(e) => setCourseNumber(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Overall Rating <span style={{ color: 'red' }}>*</span></label>
            <div className="d-flex gap-2 align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  {StarSingle(star, star <= (hoverRating || rating) ? 1 : 0, 32)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Add Tags (Select all that Apply)</label>
            <div className="d-flex mb-2">
              <input
                className="form-control me-2"
                placeholder="Type a tag and press Enter"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button type="button" className="btn btn-primary" onClick={() => addTag()}>Add</button>
            </div>

            <div>
              {allTags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`btn btn-sm me-2 mb-2 ${tags.includes(t) ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Your Review <span style={{ color: 'red' }}>*</span></label>
            <textarea className="form-control" 
              style={{ backgroundColor: review ? 'white' : '#f0f0f0' }} 
              rows={6} 
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              placeholder="Share your experience and main strengths or weaknesses." 
              />
            <div className="form-text">Minimum 50 characters</div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={clearForm}>Cancel</button>
            <button type="submit" className="btn btn-dark" disabled={status !== 'authenticated'}>
              {status === 'loading' ? 'Loading…' : status === 'authenticated' ? 'Submit Rating' : 'Sign in to Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
