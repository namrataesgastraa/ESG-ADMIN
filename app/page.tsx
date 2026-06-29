'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loginThunk } from '@/lib/store/slices/authSlice';
/* ─────────────────────────────────────────
  ESG Astraa — Login Page
  Brand: Raleway · #232234 · #7516EA · #F16B86 · #FFFFFF
  Tone: Institutional authority. Zero noise.
───────────────────────────────────────── */

function ButterflyMark({ className = '' }: { className?: string }) {
  /* Six geometric ellipses — geometry only, no fills */
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="20" ry="7" stroke="currentColor" strokeWidth="1.2" transform="rotate(0 32 32)" />
      <ellipse cx="32" cy="32" rx="20" ry="7" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="20" ry="7" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 32 32)" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen font-raleway antialiased bg-[#232234] flex">
      {/* ── LEFT: Geometric brand panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden px-16 py-14">
        {/* Layered ellipse geometry — pure CSS, brand-faithful */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large background rings */}
          <svg
            className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.06] w-[700px] h-[700px]"
            viewBox="0 0 64 64"
            fill="none"
          >
            <ellipse cx="32" cy="32" rx="20" ry="7" stroke="white" strokeWidth="0.3" transform="rotate(0 32 32)" />
            <ellipse cx="32" cy="32" rx="20" ry="7" stroke="white" strokeWidth="0.3" transform="rotate(60 32 32)" />
            <ellipse cx="32" cy="32" rx="20" ry="7" stroke="white" strokeWidth="0.3" transform="rotate(120 32 32)" />
          </svg>
          {/* Smaller ghost rings top-left */}
          <svg className="absolute -left-20 -top-20 opacity-[0.04] w-[400px] h-[400px]" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="32" rx="20" ry="7" stroke="white" strokeWidth="0.3" transform="rotate(0 32 32)" />
            <ellipse cx="32" cy="32" rx="20" ry="7" stroke="white" strokeWidth="0.3" transform="rotate(60 32 32)" />
            <ellipse cx="32" cy="32" rx="20" ry="7" stroke="white" strokeWidth="0.3" transform="rotate(120 32 32)" />
          </svg>
          {/* Subtle gradient veil */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7516EA]/8 via-transparent to-[#F16B86]/5" />
        </div>

        {/* Top: Wordmark */}
        <div className="relative z-10 flex items-center gap-3">
          <ButterflyMark className="w-8 h-8 text-white" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">ESG</span>
            <span className="text-lg font-bold text-white tracking-wide">Astraa</span>
          </div>
        </div>

        {/* Centre: Brand statement */}
        <div className="relative z-10 max-w-xs">
          {/* Brand signature line — mandatory per guidelines */}
          <div className="w-[2px] h-10 bg-gradient-to-b from-[#7516EA] to-[#F16B86] mb-8" />
          <h1 className="text-[2.6rem] font-bold leading-[1.08] tracking-tight text-white">
            Transforming
            <br />
            Business.
            <br />
            <span className="text-white/40 font-light">
              Sustaining the
              <br />
              Future.
            </span>
          </h1>
          <p className="mt-8 text-sm font-light text-white/35 leading-relaxed max-w-[240px]">
            AI-driven ESG compliance — turning regulatory obligation into competitive advantage.
          </p>
        </div>

        {/* Bottom: Compliance tags */}
        <div className="relative z-10 flex gap-6">
          {['Intelligence', 'Compliance', 'Assurance'].map(word => (
            <div key={word} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#7516EA]" />
              <span className="text-[10px] font-semibold tracking-[0.18em] text-white/30 uppercase">{word}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Login form — white, clean, minimal ── */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="lg:hidden flex items-center gap-3 px-8 pt-10 pb-0">
          <ButterflyMark className="w-7 h-7 text-[#232234]" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#232234]/40 uppercase">ESG</span>
            <span className="text-base font-bold text-[#232234] tracking-wide">Astraa</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-10 lg:px-20">
          <div className="w-full max-w-[360px]">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#7516EA] uppercase mb-6">Management Portal</p>

            <h2 className="text-[2rem] font-bold text-[#232234] leading-tight mb-1">Sign in</h2>
            <p className="text-sm text-[#232234] font-light mb-10">Access your ESG intelligence dashboard.</p>
            <form onSubmit={handleSubmit}>
              <div className="space-y-7">
                {/* Email field */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`block text-[10px] font-bold tracking-[0.22em] uppercase mb-2 transition-colors duration-200 ${
                      focused === 'email' ? 'text-[#7516EA]' : 'text-[#232234]'
                    }`}
                  >
                    Email Address
                  </label>

                  <div
                    className={`flex items-center bg-white border rounded-[4px] px-4 py-3 transition-all duration-300 ${
                      focused === 'email'
                        ? 'border-[#7516EA] shadow-[0_0_0_2px_rgba(117,22,234,0.08)]'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      suppressHydrationWarning
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      autoComplete="email"
                      placeholder="your@organisation.com"
                      className="w-full text-sm font-medium text-[#232234] placeholder:text-[#232234]/25 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <label
                      htmlFor="password"
                      className={`text-[10px] font-bold tracking-[0.22em] uppercase transition-colors duration-200 ${
                        focused === 'password' ? 'text-[#7516EA]' : 'text-[#232234]'
                      }`}
                    >
                      Password
                    </label>
                  </div>

                  <div
                    className={`flex items-center bg-white border rounded-[4px] px-4 py-3 transition-all duration-300 ${
                      focused === 'password'
                        ? 'border-[#7516EA] shadow-[0_0_0_2px_rgba(117,22,234,0.08)]'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      suppressHydrationWarning
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className="w-full text-sm font-medium text-[#232234] placeholder:text-[#232234]/25 outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 px-4 py-3 bg-[#F16B86]/10 border border-[#F16B86]/30 rounded-[4px]">
                  <p className="text-[11px] font-semibold text-[#F16B86] tracking-wide">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-10 space-y-3">
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-[14px] bg-[#232234] text-white text-[11px]
        font-bold tracking-[0.28em] uppercase rounded-[3px] overflow-hidden
        transition-all duration-300 hover:bg-[#7516EA] active:scale-[0.99]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#232234]"
                >
                  <span className="relative z-10">
                    {loading ? 'Authenticating...' : 'Continue'}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-[#232234]/30 flex justify-between items-center">
              <span className="text-[9px] font-semibold tracking-[0.25em] text-#232234 uppercase">
                Presented by OneConnectX
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
