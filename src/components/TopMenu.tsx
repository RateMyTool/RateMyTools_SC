'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import LogoMain from '@/components/LogoMain';

interface TopMenuProps {
  title: string;
}

const TopMenu = ({ title }: TopMenuProps) => {
  const { data: session, status } = useSession();
  const navRef = useRef<HTMLElement | null>(null);

  {/* Hide/show navbar on scroll */}
  useEffect(() => {
    const navbar = navRef.current;
    if (!navbar || typeof window === 'undefined') return undefined;

    // Smooth transform-based hide/show
    const HIDE_AFTER = 50; // don't hide until scrolled this far from top
    const DELTA = 6; // minimum change to react

    let lastY = window.pageYOffset || 0;
    let ticking = false;

    // initialize performant transform animation
    navbar.style.willChange = 'transform';
    navbar.style.transform = 'translateY(0)';
    navbar.style.transition = 'transform 320ms cubic-bezier(0.2, 0, 0, 1)';

    function updateForScroll(currentY: number) {
      if (Math.abs(currentY - lastY) < DELTA) return;

      if (currentY > lastY && currentY > HIDE_AFTER) {
        // scrolling down -> hide
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // scrolling up -> show
        navbar.style.transform = 'translateY(0)';
      }

      lastY = currentY;
    }

    function handleScroll() {
      const currentY = window.pageYOffset || 0;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateForScroll(currentY);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="navbar" ref={navRef} className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="flex items-center justify-between py-4 px-8">
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-8">
        {/* Left side: Logo */}
        <div className="flex items-center w-1/4">
          <Link href="/" className="flex items-center gap-1 no-underline hover:no-underline">
            <LogoMain />
            <span className="bg-black text-xl font-formal text-white px-4 py-2 rounded whitespace-nowrap">
            <span className="bg-black text-base md:text-xl font-formal text-white px-2 md:px-4 py-1 md:py-2 rounded whitespace-nowrap">
              {title}
            </span>
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center w-1/2">
          <Link
            href="/rate"
            className="text-black hover:text-gray-600 hover:underline font-semibold text-base lg:text-lg no-underline whitespace-nowrap px-3 lg:px-5"
          >
            Rate a Tool
          </Link>
          <Link
            href="/reviews"
            className="text-black hover:text-gray-600 hover:underline font-semibold text-base lg:text-lg no-underline whitespace-nowrap px-3 lg:px-5"
          >
            View Reviews
          </Link>
          <Link
            href="/compare"
            className="text-black hover:text-gray-600 hover:underline font-semibold text-base lg:text-lg no-underline whitespace-nowrap px-3 lg:px-5"
          >
            Compare Tools
          </Link>
        </div>

        {/* Desktop Auth Buttons - Right aligned */}
        <div className="hidden md:flex items-center justify-end w-1/4">
          {status === 'loading' ? (
            <div className="text-sm text-gray-500">Checking...</div>
          ) : session ? (
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="text-xs lg:text-sm text-gray-800 whitespace-nowrap hidden lg:block">
                Signed in as
                {' '}
                <strong>{session.user?.email}</strong>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-black text-white font-semibold px-3 lg:px-4 py-2 rounded hover:bg-gray-800 whitespace-nowrap text-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                }}
                className="bg-gray-200 text-black hover:bg-gray-300 font-semibold px-3 lg:px-4 py-2 rounded whitespace-nowrap text-sm"
              >
                <strong>Log In</strong>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
                }}
                className="bg-black text-white px-3 lg:px-4 py-2 rounded hover:bg-gray-800 font-semibold whitespace-nowrap text-sm"
              >
                <strong>Sign Up</strong>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 mobile-menu-enter">
          <div className="px-4 py-3 space-y-3">
            {/* Navigation Links */}
            <Link
              href="/rate"
              className="block text-black hover:text-gray-600 font-semibold py-2 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rate a Tool
            </Link>
            <Link
              href="/reviews"
              className="block text-black hover:text-gray-600 font-semibold py-2 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              View Reviews
            </Link>
            <Link
              href="/compare"
              className="block text-black hover:text-gray-600 font-semibold py-2 no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare Tools
            </Link>

            {/* Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {status === 'loading' ? (
                <div className="text-sm text-gray-500">Checking...</div>
              ) : session ? (
                <>
                  <div className="text-sm text-gray-800 mb-3">
                    Signed in as
                    {' '}
                    <strong>{session.user?.email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                    }}
                    className="w-full bg-gray-200 text-black hover:bg-gray-300 font-semibold px-4 py-2 rounded"
                  >
                    <strong>Log In</strong>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'signup' } }));
                    }}
                    className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-semibold"
                  >
                    <strong>Sign Up</strong>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopMenu;
