'use client';

import { FormEvent, useEffect, useState } from 'react';
import { PageLoader } from '@/components/Skeleton';
import { api, AuthUser } from '@/lib/api';
import { saveSession, getToken } from '@/lib/auth';

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((res) => {
        if (cancelled) return;
        setUser(res.data);
        setName(res.data.name || '');
        setEmail(res.data.email);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErr('');
    try {
      const res = await api.updateProfile({ name, email });
      setUser(res.data);
      saveSession(getToken(), res.data);
      setMsg('Profile updated');
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setErr('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setMsg('Password changed');
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Password change failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-bold text-brand-900">Account Settings</h1>
      <p className="mb-6 text-sm text-gray-500">Update your name, email, and password.</p>

      {msg && <p className="mb-4 text-sm text-green-700">{msg}</p>}
      {err && <p className="mb-4 text-sm text-red-600">{err}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-brand-800">Account details</h2>
          <p className="text-xs text-gray-400">
            Role: <span className="font-medium text-brand-700">{user?.role || 'user'}</span>
          </p>
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Update account info'}
          </button>
        </form>

        <form onSubmit={savePassword} className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-brand-800">Login security</h2>
          <p className="text-sm text-gray-500">Change your password.</p>
          <div>
            <label className="label">Current password</label>
            <input
              className="input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">New password</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Change password'}
          </button>
        </form>
      </div>
    </>
  );
}
