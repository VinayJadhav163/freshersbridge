'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Key, ShieldCheck, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginAdminAction } from '@/app/admin/actions';

export default function AdminLoginGate() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAdminAction(password);
      if (res.success && res.token) {
        // Also save to localStorage for fallback client action headers
        localStorage.setItem('freshersbridge_admin_key', res.token);
        router.refresh();
      } else {
        setError(res.error || 'Invalid Admin Password. Access Denied.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mx-auto text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Admin Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Protected area. Please authenticate to manage jobs, categories & newsletters.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Admin Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-border flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
