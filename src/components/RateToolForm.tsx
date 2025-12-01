"use client";

import React, { useState } from 'react';

const availableTags = ['Easy to Use', 'Free', 'Expensive', 'Buggy'];

export default function RateToolForm() {
  const [school, setSchool] = useState('');
  const [tool, setTool] = useState('');
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(availableTags);
  const [newTag, setNewTag] = useState('');
  const [review, setReview] = useState('');
  // master lists for inputs (allow typing + suggestions)
  const [allSchools, setAllSchools] = useState<string[]>(['UH Manoa', 'Example University']);
  const [allTools, setAllTools] = useState<string[]>(['Canvas', 'Brightspace', 'Google Classroom']);
  const [allSubjects, setAllSubjects] = useState<string[]>(['CS', 'MATH', 'ENG']);

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
    const payload = { school, tool, subject, courseNumber, rating, tags, review };
    // basic client validation
    if (!school || !tool || !rating || review.trim().length < 10) {
      alert('Please provide a school, tool, rating and a longer review (min 10 chars).');
      return;
    }

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        alert('Failed to submit review. Please try again later.');
      });
  }

  return (
    <div className="container py-8 d-flex justify-content-center">
      <div className="card w-75 p-4">
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Your School *</label>
            <input
              className="form-control"
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

          <div className="mb-3">
            <label className="form-label">Your Tool *</label>
            <input
              className="form-control"
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
            <div className="form-text">Don't see your tool? Type it.</div>
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
            <label className="form-label">Overall Rating *</label>
            <div>
              {[1, 2, 3, 4, 5].map((n) => (
                // eslint-disable-next-line react/no-array-index-key
                <button
                  type="button"
                  key={n}
                  className={`btn btn-link p-0 me-2 ${n <= rating ? 'text-warning' : 'text-secondary'}`}
                  onClick={() => setRating(n)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={n <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 .587l3.668 7.431L23.4 9.587l-5.7 5.558L19.335 24 12 19.897 4.665 24l1.635-8.855L.6 9.587l7.732-1.569L12 .587z" />
                  </svg>
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
            <label className="form-label">Your Review *</label>
            <textarea className="form-control" rows={6} value={review} onChange={(e) => setReview(e.target.value)} placeholder="Share your experience with this tool. How did it help you in your coursework? What are its strengths and weaknesses?" />
            <div className="form-text">Minimum 50 characters</div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={clearForm}>Cancel</button>
            <button type="submit" className="btn btn-dark">Submit Rating</button>
          </div>
        </form>
      </div>
    </div>
  );
}
