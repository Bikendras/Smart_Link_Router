'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { api } from '@/lib/api';
import { isLoggedIn, saveSession } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSecret, setUseSecret] = useState(false);
  const [secret, setSecret] = useState('');

  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard/links');
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = useSecret
        ? await api.loginWithSecret(secret)
        : await api.loginWithEmail(email, password);
      saveSession(res.token, res.user);
      router.push('/dashboard/links');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="rounded-xl bg-white p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-xl font-bold text-brand-900">
          {useSecret ? 'Admin secret login' : 'Log in with Email & Password'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {useSecret
            ? 'Sign in with your admin secret.'
            : 'Welcome back — access your smart links dashboard.'}
        </p>

        {!useSecret ? (
          <>
            <label className="label mt-6" htmlFor="email">
              E-mail address
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />

            <label className="label mt-4" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="input pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>
        ) : (
          <>
            <label className="label mt-6" htmlFor="secret">
              Admin secret
            </label>
            <input
              id="secret"
              type="password"
              className="input"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter admin secret"
              required
            />
          </>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary mt-6 w-full py-3" disabled={loading}>
          {loading ? 'Signing in…' : useSecret ? 'Continue' : 'Log in with Email & Password'}
        </button>

        <button
          type="button"
          onClick={() => {
            setUseSecret((v) => !v);
            setError('');
          }}
          className="mt-3 w-full text-center text-sm text-brand-600 hover:underline"
        >
          {useSecret ? '← Use email & password instead' : 'Or log in with admin secret'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/dashboard/signup" className="font-semibold text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
