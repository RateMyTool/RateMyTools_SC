import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-normal">RATE MY</span>
              <span className="ml-2 bg-black text-white px-3 py-1 text-xl font-normal">
                TOOLS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200')",
        }}
      >
        <div className="flex flex-col items-center justify-center px-4 w-full">
          {/* Search Type Tabs */}
          <div className="flex space-x-4 mb-12">
            <button className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Search by College</span>
            </button>
            <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Search by Tool</span>
            </button>
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-5xl md:text-6xl font-bold text-center mb-10 max-w-4xl px-4">
            Enter your school to get started
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-3xl mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Your school"
                className="w-full pl-16 pr-6 py-5 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-lg"
              />
            </div>
          </div>

          {/* Alternative Link */}
          <Link
            href="/tools"
            className="text-white underline text-lg hover:text-gray-200 transition"
          >
            I'd like to look up a tool by name
          </Link>
        </div>
      </div>
    </div>
  );
}
