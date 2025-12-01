'use client';

import Image from 'next/image';
import RateMy from '@/RATEMY.png';

interface TopMenuProps {
  title: string;
}

const TopMenu = ({ title }: TopMenuProps) => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="d-flex flex-row items-center justify-content-between py-2 px-4 align-items-stretch">
        <div className="flex items-center">
          <Image
            src={RateMy.src}
            alt="Rate My Tools Logo"
            width={48}
            height={48}
            className="h-8 w-auto align-self-center"
          />
          <span className="text-xl font-formal align-self-center"><strong>ATE MY</strong></span>
          <span className="bg-black text-xl font-formal text-white px-2 py-2 rounded align-self-center">{title}</span>
        </div>
        <div className="items-center h-100 p-2">
          <span className="font-medium px-4 text-black text-end align-self-center">
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
          <span className="bg-black text-white text-xl font-normal px-3 py-2 rounded align-self-center">
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
}

export default TopMenu;
