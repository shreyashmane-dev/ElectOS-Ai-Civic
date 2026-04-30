"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createUserProfile } from "@/lib/firebase/firestore";

export function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Initialize Firestore Profile
      await createUserProfile(userCredential.user.uid, {
        displayName: name,
        email: email,
        onboardingCompleted: false,
        location: "California",
        district: "CA-01",
        votingStatus: "Not set"
      });

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background font-body-md text-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary-container/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[30%] w-[30%] rounded-full bg-secondary-container/10 blur-[100px]" />
      </div>

      {/* Main Signup Canvas */}
      <div className="relative z-10 mx-auto w-full max-w-md px-4">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display-xl mb-2 bg-gradient-to-r from-primary-fixed to-secondary-fixed bg-clip-text text-display-xl text-transparent">
            ElectOS
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Civic Intelligence</p>
        </div>

        {/* Glass Card Container */}
        <div className="glass-card relative rounded-xl p-8 shadow-2xl">
          <div className="specular-highlight" />
          <div className="mb-6">
            <h2 className="font-headline-md mb-1 text-headline-md text-on-surface">Create Account</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Join the future of civic engagement.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-error-container/20 p-4 border border-error/30 text-error text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div>
              <label className="font-label-caps mb-2 block text-label-caps text-on-surface-variant" htmlFor="fullName">
                FULL NAME
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  person
                </span>
                <input
                  className="font-body-md w-full rounded-t border-b border-outline-variant bg-surface-container-low px-4 py-3 pl-10 pr-4 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container focus:ring-0"
                  id="fullName"
                  placeholder="Jane Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="font-label-caps mb-2 block text-label-caps text-on-surface-variant" htmlFor="email">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  mail
                </span>
                <input
                  className="font-body-md w-full rounded-t border-b border-outline-variant bg-surface-container-low px-4 py-3 pl-10 pr-4 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container focus:ring-0"
                  id="email"
                  placeholder="jane@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="font-label-caps mb-2 block text-label-caps text-on-surface-variant" htmlFor="password">
                PASSWORD
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  lock
                </span>
                <input
                  className="font-body-md w-full rounded-t border-b border-outline-variant bg-surface-container-low px-4 py-3 pl-10 pr-10 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container focus:ring-0"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant transition-colors hover:text-on-surface"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <p className="font-body-md mt-1 text-sm text-on-surface-variant">Must be at least 8 characters.</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="font-label-caps mb-2 block text-label-caps text-on-surface-variant" htmlFor="confirmPassword">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  lock_reset
                </span>
                <input
                  className="font-body-md w-full rounded-t border-b border-outline-variant bg-surface-container-low px-4 py-3 pl-10 pr-10 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container focus:ring-0"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* CTA Button */}
            <button
              className="group relative mt-8 w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary-container to-secondary-container p-[1px] disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-container to-secondary-container opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20"></span>
              <div className="relative flex items-center justify-center gap-2 rounded-lg bg-surface px-6 py-3 transition-colors group-hover:bg-surface-container-low">
                <span className="font-headline-md text-headline-md text-lg text-primary-container">
                  {isLoading ? "Creating..." : "Create Account"}
                </span>
                <span className="material-symbols-outlined text-primary-container">arrow_forward</span>
              </div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link
                className="text-primary-container underline underline-offset-4 decoration-primary-container/30 transition-colors hover:text-primary-fixed hover:decoration-primary-fixed"
                href="/login"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
