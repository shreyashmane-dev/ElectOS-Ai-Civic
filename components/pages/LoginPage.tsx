"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
      console.error("Google sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6 font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient Backgrounds */}
      <div className="pointer-events-none absolute left-[-150px] top-[-150px] h-[600px] w-[600px] rounded-full bg-primary-fixed-dim/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-secondary-fixed-dim/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-container-high/20 blur-[150px]" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="relative overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container/60 shadow-[0_10px_30px_rgba(0,240,255,0.08)] backdrop-blur-[40px]">
          <div className="glass-specular pointer-events-none absolute left-0 top-0 z-0 h-full w-full" />
          <div className="relative z-10 p-10">
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-highest shadow-[0_4px_20px_rgba(0,240,255,0.1)]">
                <span 
                  className="material-symbols-outlined text-[28px] text-primary" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>
              <h1 className="font-display-xl bg-gradient-to-r from-primary to-secondary bg-clip-text pb-1 text-display-xl tracking-tight text-transparent">
                ElectOS
              </h1>
              <p className="font-label-caps mt-2 text-label-caps uppercase tracking-[0.2em] text-on-surface-variant">
                Civic Intelligence
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-error-container/20 p-4 border border-error/30 text-error text-sm text-center">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="group relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="peer font-body-md text-body-md w-full rounded-t-DEFAULT border border-transparent border-b-outline-variant bg-surface-container-low/40 px-4 pb-2 pt-6 text-on-surface outline-none transition-all duration-300 placeholder-transparent focus:border-primary focus:border-b-transparent focus:bg-surface-container focus:ring-1 focus:ring-primary"
                />
                <label
                  htmlFor="email"
                  className="font-body-md text-body-md pointer-events-none absolute left-4 top-4 origin-left text-on-surface-variant transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:-translate-x-1 peer-valid:-translate-y-2.5 peer-valid:scale-[0.8] peer-focus:-translate-x-1 peer-focus:-translate-y-2.5 peer-focus:scale-[0.8] peer-focus:text-primary"
                >
                  Email Address
                </label>
              </div>

              <div className="group relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="peer font-body-md text-body-md w-full rounded-t-DEFAULT border border-transparent border-b-outline-variant bg-surface-container-low/40 px-4 pb-2 pt-6 text-on-surface outline-none transition-all duration-300 placeholder-transparent focus:border-primary focus:border-b-transparent focus:bg-surface-container focus:ring-1 focus:ring-primary"
                />
                <label
                  htmlFor="password"
                  className="font-body-md text-body-md pointer-events-none absolute left-4 top-4 origin-left text-on-surface-variant transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:-translate-x-1 peer-valid:-translate-y-2.5 peer-valid:scale-[0.8] peer-focus:-translate-x-1 peer-focus:-translate-y-2.5 peer-focus:scale-[0.8] peer-focus:text-primary"
                >
                  Password
                </label>
              </div>

              <div className="-mt-2 flex items-center justify-end">
                <Link
                  href="#"
                  className="font-body-md text-body-md text-[14px] text-primary transition-colors hover:text-primary-fixed hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="pulse-glow font-headline-md text-body-md group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-DEFAULT bg-gradient-to-r from-primary-container to-primary-fixed-dim py-3 text-on-primary-container transition-all duration-300 disabled:opacity-50"
              >
                <span className="relative z-10 font-bold">
                  {isLoading ? "Signing in..." : "Log In"}
                </span>
                <span className="material-symbols-outlined relative z-10 text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-outline-variant/50" />
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                OR
              </span>
              <div className="h-[1px] flex-1 bg-outline-variant/50" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="font-headline-md text-body-md flex w-full items-center justify-center gap-3 rounded-DEFAULT border border-outline-variant bg-surface-container-low/50 py-3 text-on-surface transition-all duration-200 hover:border-outline hover:bg-surface-container disabled:opacity-50"
            >
              <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-8 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary transition-colors hover:text-primary-fixed hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
