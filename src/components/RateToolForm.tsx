"use client";

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import StarSingle from '@/components/StarSingleUI';

const availableTags = ['Easy to Use', 'Free', 'Expensive', 'Buggy'];

export default function RateToolForm() {
  const { status } = useSession();

  const [school, setSchool] = useState('');
  const [tool, setTool] = useState('');
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(availableTags);
  const [newTag, setNewTag] = useState('');
  const [review, setReview] = useState('');
  // master lists for inputs (allow typing + suggestions)
  const [allSchools, setAllSchools] = useState<string[]>(['UH Manoa', 'Example University']);
  const [allTools, setAllTools] = useState<string[]>(['Canvas', 'Brightspace', 'Google Classroom']);
  const [allSubjects, setAllSubjects] = useState<string[]>(['CS', 'MATH', 'ENG']);

  const toggleTag = useCallback((tag: string) => {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  }, []);

  const addTag = useCallback((tag?: string) => {
    const t = (tag ?? newTag).trim();
    if (!t) return;
    // add to master list if missing
    setAllTags((existing) => (existing.includes(t) ? existing : [...existing, t]));
    // mark as selected if not already
    setTags((existing) => (existing.includes(t) ? existing : [...existing, t]));
    setNewTag('');
  }, [newTag]);

  const ensureInList = useCallback((listSetter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    const v = value.trim();
    if (!v) return;
    listSetter((existing) => (existing.includes(v) ? existing : [...existing, v]));
  }, []);

  const clearForm = useCallback(() => {
    setSchool('');
    setTool('');
    setSubject('');
    setCourseNumber('');
    setRating(0);
    setTags([]);
    setReview('');
  }, []);

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      // Open the app's auth modal so users can sign in without leaving the page
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
      return;
    }
    const payload = { school, tool, subject, courseNumber, rating, tags, review };
    // basic client validation
    if (!school || !tool || !rating || review.trim().length < 10) {
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
  }, [school, tool, subject, courseNumber, rating, tags, review, status, clearForm]);

  return (
    <div className="container d-flex justify-content-center" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
      <div className="card w-75 p-4">
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
            <label className="form-label">Your School <span style={{ color: 'red' }}>*</span></label>
            <input
              className="form-control"
              list="schools"
              placeholder="Choose or type a school..."
              value={school}
              style={{ backgroundColor: school ? 'white' : '#f0f0f0' }}
              onChange={(e) => setSchool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  ensureInList(setAllSchools, (e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => ensureInList(setAllSchools, (e.target as HTMLInputElement).value)}
            />
            <datalist id="schools">
              {allSchools.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div className="mb-3">
            <label className="form-label">Your Tool <span style={{ color: 'red' }}>*</span></label>
            <input
              className="form-control"
              list="tools"
              placeholder="Type a tool..."
              value={tool}
              style={{ backgroundColor: tool ? 'white' : '#f0f0f0' }}
              onChange={(e) => setTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  ensureInList(setAllTools, (e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => ensureInList(setAllTools, (e.target as HTMLInputElement).value)}
            />
            <datalist id="tools">
              {allTools.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <div className="form-text">Don&apos;t see your tool? Type it.</div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Course Subject</label>
              <input
                className="form-control"
                list="subjects"
                placeholder="Type a subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    ensureInList(setAllSubjects, (e.target as HTMLInputElement).value);
                  }
                }}
                onBlur={(e) => ensureInList(setAllSubjects, (e.target as HTMLInputElement).value)}
              />
              <datalist id="subjects">
                {allSubjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
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
            <label className="form-label">Add Tags (type and press Enter or click Add)</label>
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
            <textarea 
              className="form-control" 
              rows={6} 
              value={review}
              style={{ backgroundColor: review ? 'white' : '#f0f0f0' }}
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
