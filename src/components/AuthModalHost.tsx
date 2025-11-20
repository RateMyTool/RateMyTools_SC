'use client';

import React, { useEffect, useState } from 'react';
import AuthModal from '@/components/AuthModal';

const AuthModalHost: React.FC = () => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as { mode?: 'login' | 'signup' } | undefined;
      setMode(detail?.mode || 'login');
      setShow(true);
    };
    window.addEventListener('open-auth-modal', handler as EventListener);
    return () => window.removeEventListener('open-auth-modal', handler as EventListener);
  }, []);

  return <AuthModal show={show} onClose={() => setShow(false)} initialMode={mode} />;
};

export default AuthModalHost;
