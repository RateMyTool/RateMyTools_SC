"use client";

import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { signIn } from 'next-auth/react';

type Mode = 'login' | 'signup';

interface Props {
  show: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

const AuthModal: React.FC<Props> = ({ show, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [autoFocusRef, setAutoFocusRef] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    // Ensure the modal mounts into document.body on the client so it's centered
    if (typeof document !== 'undefined') setContainer(document.body);
    // focus email input when modal opens
    if (show && autoFocusRef) {
      autoFocusRef.focus();
    }
  }, [initialMode, show]);

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);
    // result can be undefined in some cases
    // @ts-ignore
    if (result?.ok) {
      onClose();
      // reload to update session UI
      window.location.reload();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleGoogle = async () => {
    // This will redirect to the Google sign in flow
    await signIn('google');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setLoading(false);
      if (resp.ok) {
        // Auto sign-in after successful registration
        const r = await signIn('credentials', { redirect: false, email, password });
        // @ts-ignore
        if (r?.ok) {
          onClose();
          window.location.reload();
        } else {
          setError('Registration succeeded but automatic sign-in failed. Try signing in.');
        }
      } else {
        const body = await resp.json().catch(() => null);
        setError(body?.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Registration failed');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered container={container}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'login' ? 'Login' : 'Sign Up'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {mode === 'login' ? (
          <Form onSubmit={handleSignIn}>
            <div className="d-grid gap-2 mb-3">
              <Button variant="light" onClick={handleGoogle} className="text-start">
                <strong>Google</strong>
                <div className="small">Login with Google</div>
              </Button>
            </div>

            <div className="text-center mb-2">Or login with email</div>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control ref={(el) => el && setAutoFocusRef(el)} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <div className="mb-3 text-end">
              <button type="button" className="btn btn-link p-0" onClick={() => (window.location.href = '/auth/change-password')}>Forgot Password?</button>
            </div>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Continue'}
              </Button>
            </div>

            <div className="mt-3 text-center">
              Don't have an account? <button type="button" className="btn btn-link p-0" onClick={() => setMode('signup')}>Sign Up</button>
            </div>
          </Form>
        ) : (
          <Form onSubmit={handleSignUp}>
            <div className="d-grid gap-2 mb-3">
              <Button variant="light" onClick={handleGoogle} className="text-start">
                <strong>Google</strong>
                <div className="small">Sign up with Google</div>
              </Button>
            </div>

            <div className="text-center mb-2">Or sign up with email</div>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control ref={(el) => el && setAutoFocusRef(el)} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Continue'}
              </Button>
            </div>

            <div className="mt-3 text-center">
              Already have an account? <button type="button" className="btn btn-link p-0" onClick={() => setMode('login')}>Login</button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
