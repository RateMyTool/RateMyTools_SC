'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

interface TopMenuProps {
  title: string;
}

const TopMenu = ({ title }: TopMenuProps) => {
  const { data: session, status } = useSession();

  return (
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
        <div className="flex items-center">
          {status === 'loading' ? (
            <div className="text-sm text-gray-500">Checking...</div>
          ) : session ? (
            <div className="d-flex align-items-center">
              <div className="text-sm text-gray-800 me-3">Signed in as <strong>{session.user?.email}</strong></div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-outline-secondary btn-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                }}
                className="btn btn-light text-black me-2"
              >
                <strong>Log In</strong>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
                }}
                className="btn btn-dark"
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
