<div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column */}
          <aside className="md:col-span-4 space-y-6">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-semibold mb-1">{schoolName}</h1>
              <p className="text-sm text-gray-600 mb-4">{location}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
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
            <div className="rounded-lg border bg-white p-5 shadow-sm gap-4">
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
                  <Link
                    href="/add"
                    className={[
                      'inline-flex w-full justify-center rounded bg-indigo-600 px-4 py-2',
                      'text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none',
                      'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    ].join(' ')}
                  >
                    Rate a Tool
                  </Link>
                </div>
              </form>
            </div>
          </aside>
          {/* Right Column */}
          <section className="md:col-span-8 space-y-4">
            {sortedTools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-lg border bg-white p-5 shadow-sm hover:border-indigo-400 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Link href={`/tools/${tool.id}`}>{tool.name}</Link>
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{tool.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {tool.rating.toFixed(1)}
                      {' '}
                      / 5
                    </p>
                    <p className="text-xs text-gray-500">
                      {tool.ratingsCount}
                      {' '}
                      ratings
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {sortedTools.length === 0 && (
            <p className="text-sm text-gray-600">No tools match your filters.</p>
            )}
          </section>
        </div>
      </div>
    </div>
    