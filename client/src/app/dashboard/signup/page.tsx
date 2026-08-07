'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { api } from '@/lib/api';
import { isLoggedIn, saveSession } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard/links');
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.signup(email, password, name);
      saveSession(res.token, res.user);
      router.push('/dashboard/links');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="One Link" subtitle="Multiple Destinations">
      <form onSubmit={onSubmit} className="rounded-xl bg-white p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-xl font-bold text-brand-900">
          Sign up with Email & Password
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create your free account and start building smart links.
        </p>

        <label className="label mt-6" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />

        <label className="label mt-4" htmlFor="email">
          E-mail address *
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
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPass ? 'text' : 'password'}
            className="input pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            minLength={6}
            autoComplete="new-password"
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

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary mt-6 w-full py-3" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up with Email & Password'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/dashboard/login" className="font-semibold text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
