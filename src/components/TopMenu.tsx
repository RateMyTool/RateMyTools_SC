'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import LogoMain from '@/components/LogoMain';

interface TopMenuProps {
  title: string;
}

const TopMenu = ({ title }: TopMenuProps) => {
  const { data: session, status } = useSession();
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="flex items-center justify-between py-4 px-8">
        {/* Left side: Logo */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center gap-1 no-underline hover:no-underline">
            <LogoMain />
            <span className="bg-black text-xl font-formal text-white px-4 py-2 rounded whitespace-nowrap">
              {title}
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links - Bigger text */}
        <div className="flex items-center justify-center flex-1">
          <Link
            href="/rate"
            className="text-black hover:text-gray-600 hover:underline font-semibold text-lg no-underline whitespace-nowrap px-5"
          >
            Rate a Tool
          </Link>
          <Link
            href="/reviews"
            className="text-black hover:text-gray-600 hover:underline font-semibold text-lg no-underline whitespace-nowrap px-5"
          >
            View Reviews
          </Link>
          <Link
            href="/compare"
            className="text-black hover:text-gray-600 hover:underline font-semibold text-lg no-underline whitespace-nowrap px-5"
          >
            Compare Tools
          </Link>
        </div>

        {/* Right side: Auth buttons */}
        <div className="flex items-center justify-end flex-1">
          {status === 'loading' ? (
            <div className="text-sm text-gray-500">Checking...</div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-800 whitespace-nowrap">
                Signed in as
                {' '}
                <strong>{session.user?.email}</strong>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800 whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                }}
                className="bg-gray-200 text-black hover:bg-gray-300 font-semibold px-4 py-2 rounded whitespace-nowrap"
              >
                <strong>Log In</strong>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
                }}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-semibold whitespace-nowrap"
              >
                <strong>Sign Up</strong>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
