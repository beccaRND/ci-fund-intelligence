'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const VALID_PASSWORD = 'cifund2024';
const STORAGE_KEY = 'ci-fund-auth';

export default function LoginGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setAuthed(true);
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === VALID_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthed(true);
    } else {
      setError('Incorrect password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  if (checking) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-ci-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo block */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-ci-green mx-auto mb-4 flex items-center justify-center shadow-md">
            <span
              className="text-white font-bold text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              CI
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-ci-charcoal"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Fund Intelligence
          </h1>
          <p className="text-ci-gray-500 text-sm mt-1">
            Regenerative Fund for Nature
          </p>
        </div>

        {/* Login card */}
        <div
          className={`bg-ci-white rounded-[var(--radius-lg)] shadow-md p-8 ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-ci-green" />
            <h2
              className="text-lg font-semibold text-ci-charcoal"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ci-gray-700 mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                autoFocus
                className="w-full px-4 py-3 pr-12 rounded-[var(--radius-md)] border border-ci-gray-300 bg-ci-cream text-ci-charcoal placeholder:text-ci-gray-500/60 focus:outline-none focus:ring-2 focus:ring-ci-green/30 focus:border-ci-green transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ci-gray-500 hover:text-ci-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-status-gap">{error}</p>
            )}

            <button
              type="submit"
              className="w-full mt-6 px-4 py-3 bg-ci-green text-white font-semibold rounded-[var(--radius-md)] hover:bg-ci-green-dark transition-colors shadow-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-ci-gray-500 mt-6">
            Access restricted to authorized fund partners.
          </p>
        </div>

        <p className="text-center text-xs text-ci-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Conservation International
        </p>
      </div>
    </div>
  );
}
