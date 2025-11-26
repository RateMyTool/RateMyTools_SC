'use client';

import Image from 'next/image';

interface TopMenuProps {
  title: string;
}

const TopMenu = ({ title }: TopMenuProps) => (
  <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
    <div className="flex items-center justify-between py-2 px-4">
      <div className="flex items-center">
        <Image
          src="/RATEMY.png"
          alt="Rate My Tools Logo"
          width={48}
          height={48}
          className="h-8 w-auto"
        />
        <span className="bg-black text-xl font-formal text-white px-2 py-2 rounded">{title}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium px-4 text-black">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
            }}
            className="text-black hover:underline no-underline bg-transparent border-0 p-0"
          >
            <strong>Log In</strong>
          </button>
        </span>
        <span className="bg-black text-white text-xl font-normal px-3 py-2 rounded">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
            }}
            className="text-white hover:underline no-underline bg-transparent border-0 p-0"
          >
            <strong>Sign Up</strong>
          </button>
        </span>
      </div>
    </div>
  </nav>
);

export default TopMenu;
