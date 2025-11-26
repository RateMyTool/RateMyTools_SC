'use client';

import Link from 'next/link';
import React from 'react';
import * as Icons from 'react-bootstrap-icons';

interface MiddleMenuProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
}

const MiddleMenu: React.FC<MiddleMenuProps> = ({ setTitle, title }) => {
  // Classes to adjust components from active/inactive status
  const isCollege = title === 'SCHOOLS';
  const collegeBtnClasses = [
    'flex items-center rounded px-3 py-2 text-lg font-medium gap-3',
    isCollege ? 'bg-black text-white hover:opacity-90' : 'bg-white text-black hover:bg-gray-100',
  ].join(' ');
  const toolBtnClasses = [
    'flex items-center rounded px-3 py-2 text-lg font-medium gap-3',
    !isCollege ? 'bg-black text-white hover:opacity-90' : 'bg-white text-black hover:bg-gray-100',
  ].join(' ');
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
              onClick={() => setTitle('SCHOOLS')}
              className={collegeBtnClasses}
              type="button"
            >
              <Icons.Mortarboard />
              Search by College
            </button>
            <button
              onClick={() => setTitle('TOOLS')}
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

          {/* Search Bar */}
          <div className="w-2/5 mt-2">
            <div className="relative">
              {/* Left icon inside input */}
              <input
                type="text"
                placeholder={isCollege ? 'Your school' : 'Tool name'}
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
            </div>
          </div>

          {/* Alternative Link */}
          <Link
            href="/"
            className="pt-3 text-white text-lg hover:text-gray-200 hover:underline transition no-underline"
          >
            {isCollege ? 'Find Tool by school' : 'Find Tool by name'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiddleMenu;
