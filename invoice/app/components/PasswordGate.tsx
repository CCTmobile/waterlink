"use client";

import React, { useState, useEffect } from "react";
import { Droplets, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const CORRECT_PASSWORD = "*7436645Water&634723";
const STORAGE_KEY = "wl_auth";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setAuthenticated(true);
      }
    } catch {
      // sessionStorage unavailable
    }
    setLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  // Don't render anything until we've checked sessionStorage (prevents flash)
  if (!loaded) return null;

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040b18] via-[#0a1628] to-[#071232] px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#0284c7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#c8953c]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0ea5e9]/3 rounded-full blur-[100px]" />
      </div>

      <div
        className={`relative w-full max-w-md ${shaking ? "animate-shake" : ""}`}
      >
        {/* Card */}
        <div className="relative bg-[#0c1a30]/80 backdrop-blur-xl border border-[#1e3a5f]/50 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Gold top accent line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#c8953c] to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Logo / Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative h-20 w-20 rounded-full border-2 border-[#8d661b] p-1 bg-gradient-to-br from-[#fff4d1] via-[#c8953c] to-[#7c5415] shadow-lg shadow-[#c8953c]/20 mb-4">
                <div className="h-full w-full rounded-full bg-[#082046] flex flex-col items-center justify-center text-[#dfb76c] border border-[#f5d77f]">
                  <Droplets className="h-5 w-5 text-[#f5d77f] mb-0.5" />
                  <span className="font-serif font-black text-lg tracking-tighter leading-none text-[#fff3d1]">
                    WL
                  </span>
                </div>
              </div>
              <h1 className="font-serif text-xl font-bold text-white tracking-tight text-center">
                WaterLinks Document Studio
              </h1>
              <p className="text-[#7a9cc6] text-sm mt-1.5 text-center">
                Authorised personnel access only
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="gate-password"
                  className="flex items-center gap-2 text-xs font-semibold text-[#7a9cc6] uppercase tracking-wider mb-2"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Access Password
                </label>
                <div className="relative">
                  <input
                    id="gate-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    placeholder="Enter password"
                    autoFocus
                    autoComplete="off"
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-[#071232] border-2 text-white placeholder-[#3a5070] font-mono text-sm outline-none transition-all duration-200 ${
                      error
                        ? "border-red-500/70 focus:border-red-400"
                        : "border-[#1e3a5f]/60 focus:border-[#0284c7]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6a90] hover:text-[#7a9cc6] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-red-400 text-xs font-medium flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0369a1] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0ea5e9] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#0284c7]/20 transition-all duration-200 hover:shadow-[#0284c7]/30 active:scale-[0.98]"
              >
                Authenticate
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-[#3a5070] text-[10px] mt-6 font-mono">
              WaterLinks Borehole Services · Secure Portal
            </p>
          </div>
        </div>
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-6px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(6px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
