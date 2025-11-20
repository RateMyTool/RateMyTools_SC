'use client';

import React from 'react';

const openAuthModal = (mode: 'login' | 'signup') => {
  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
};

const AuthLinks: React.FC = () => (
  <>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        openAuthModal('login');
      }}
      className="text-gray-700 hover:text-gray-900 font-medium"
    >
      Log In
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        openAuthModal('signup');
      }}
      className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 font-medium"
    >
      Sign Up
    </button>
  </>
);

export default AuthLinks;
