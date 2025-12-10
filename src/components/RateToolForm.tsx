"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Stars from '@/components/StarsUI';

const availableTags = ['Easy to Use', 'Free', 'Expensive', 'Buggy'];

export default function RateToolForm() {
  const { status } = useSession();

  const [school, setSchool] = useState('');
  const [tool, setTool] = useState('');
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(availableTags);
  const [newTag, setNewTag] = useState('');
  const [review, setReview] = useState('');
  const [allSchools, setAllSchools] = useState<string[]>(['UH Manoa', 'Example University']);
  const [allTools, setAllTools] = useState<string[]>(['Canvas', 'Brightspace', 'Google Classroom']);
  const [allSubjects, setAllSubjects] = useState<string[]>(['CS', 'MATH', 'ENG']);

  function toggleTag(tag: string) {
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  }

  function addTag(tag?: string) {
    const t = (tag ?? newTag).trim();
    if (!t) return;
    setAllTags((existing) => (existing.includes(t) ? existing : [...existing, t]));
    setTags((existing) => (existing.includes(t) ? existing : [...existing, t]));
    setNewTag('');
  }

  function ensureInList(listSetter: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
    const v = value.trim();
    if (!v) return;
    listSetter((existing) => (existing.includes(v) ? existing : [...existing, v]));
  }

  function clearForm() {
    setSchool('');
    setTool('');
    setSubject('');
    setCourseNumber('');
    setRating(0);
    setTags([]);
    setReview('');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'authenticated') {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
      return;
    }
    const payload = { school, tool, subject, courseNumber, rating, tags, review };
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
        console.error(err);
        alert('Failed to submit review. Please try again later.');
      });
  }

  return (
    <div className="container py-3 md:py-5 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card p-4 md:p-6">
          <form onSubmit={submit}>
            {status === 'unauthenticated' && (
              <div className="alert alert-warning flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>Please sign in to submit a review.</div>
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary w-full sm:w-auto"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }))}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}
            
            <div className="mb-3 md:mb-4">
              <label className="form-label text-sm md:text-base">Your School *</label>
              <input
                className="form-control text-sm md:text-base"
                list="schools"
                placeholder="Choose or type a school..."
                value={school}
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

            <div className="mb-3 md:mb-4">
              <label className="form-label text-sm md:text-base">Your Tool *</label>
              <input
                className="form-control text-sm md:text-base"
                list="tools"
                placeholder="Type a tool..."
                value={tool}
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
              <div className="form-text text-xs md:text-sm">Don&apos;t see your tool? Type it.</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="mb-3 md:mb-0">
                <label className="form-label text-sm md:text-base">Course Subject</label>
                <input
                  className="form-control text-sm md:text-base"
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
              <div>
                <label className="form-label text-sm md:text-base">Course Number / CRN</label>
                <input 
                  className="form-control text-sm md:text-base" 
                  placeholder="e.g., CS 101 or 12345" 
                  value={courseNumber} 
                  onChange={(e) => setCourseNumber(e.target.value)} 
                />
              </div>
            </div>

            <div className="mb-3 md:mb-4 mt-3 md:mt-4">
              <label className="form-label text-sm md:text-base">Overall Rating *</label>
              <div className="flex">
                {Stars(rating, window.innerWidth < 640 ? 24 : 32, false, setRating)}
              </div>
            </div>

            <div className="mb-3 md:mb-4">
              <label className="form-label text-sm md:text-base">Add Tags (type and press Enter or click Add)</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  className="form-control flex-1 text-sm md:text-base"
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
                <button 
                  type="button" 
                  className="btn btn-primary w-full sm:w-auto text-sm md:text-base" 
                  onClick={() => addTag()}
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`btn btn-sm text-xs md:text-sm ${tags.includes(t) ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3 md:mb-4">
              <label className="form-label text-sm md:text-base">Your Review *</label>
              <textarea 
                className="form-control text-sm md:text-base" 
                rows={4} 
                value={review} 
                onChange={(e) => setReview(e.target.value)} 
                placeholder="Share your experience and main strengths or weaknesses." 
              />
              <div className="form-text text-xs md:text-sm">Minimum 50 characters</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button 
                type="button" 
                className="btn btn-outline-secondary w-full sm:w-auto text-sm md:text-base order-2 sm:order-1" 
                onClick={clearForm}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-dark w-full sm:w-auto text-sm md:text-base order-1 sm:order-2" 
                disabled={status !== 'authenticated'}
              >
                {status === 'loading' ? 'Loading…' : status === 'authenticated' ? 'Submit Rating' : 'Sign in to Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
