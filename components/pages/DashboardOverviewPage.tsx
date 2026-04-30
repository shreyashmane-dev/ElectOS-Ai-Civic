"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/lib/firebase/firestore";

export function DashboardOverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
        }
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const firstName = profile.displayName 
    ? profile.displayName.split(" ")[0] 
    : user?.displayName 
      ? user.displayName.split(" ")[0] 
      : "there";

  if (loading) return (
    <ConsoleShell title="Loading Dashboard..." subtitle="">
      <div className="flex items-center justify-center h-64 animate-pulse text-primary font-bold">
        SYNCHRONIZING CIVIC DATA...
      </div>
    </ConsoleShell>
  );

  return (
    <ConsoleShell
      title={`Hi, ${firstName}.`}
      subtitle="Here's a quick look at your current voting status and upcoming events."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Readiness */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-xl min-h-[400px]">
            <div className="specular-highlight" />
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
              <h3 className="font-headline-md text-xl font-bold text-on-surface tracking-tight">Voting Readiness</h3>
            </div>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - 0.85)}
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  style={{ filter: "drop-shadow(0 0 8px rgba(0, 219, 233, 0.5))" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display-xl text-5xl font-black text-on-surface">85%</span>
                <span className="font-label-caps text-[10px] text-primary tracking-[0.2em] mt-1">READY</span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant max-w-[240px]">
              You're <span className="text-primary font-bold">mostly ready</span> for the next election. Just 2 more simple steps to go.
            </p>
            
            {!profile.onboardingCompleted && (
              <Link href="/onboarding" className="w-full py-3 bg-primary text-on-primary hover:opacity-90 rounded-xl font-headline-md text-sm font-bold shadow-lg text-center transition-all">
                Complete Setup
              </Link>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">how_to_reg</span>
                </div>
                <div className="px-2 py-1 bg-tertiary/10 rounded text-[10px] font-bold text-tertiary tracking-widest uppercase">Verified</div>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-sm text-on-surface-variant">Registration</span>
                <span className="font-headline-md text-3xl font-black text-on-surface mt-1">DONE</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center border border-error/20">
                  <span className="material-symbols-outlined text-error text-[20px]">event_busy</span>
                </div>
                <div className="px-2 py-1 bg-error/10 rounded text-[10px] font-bold text-error tracking-widest uppercase">Urgent</div>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-sm text-on-surface-variant">Next Deadline</span>
                <span className="font-headline-md text-3xl font-black text-on-surface mt-1">3 DAYS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant ml-2">QUICK ACTIONS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/fact-checker" className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:bg-surface-container-high/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[28px]">gavel</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md font-bold text-on-surface text-lg">Fact Checker</span>
                  <span className="font-body-md text-sm text-on-surface-variant">Check any news story</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant ml-auto group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>

              <Link href="/assistant" className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:bg-surface-container-high/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-[28px]">smart_toy</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md font-bold text-on-surface text-lg">AI Guide</span>
                  <span className="font-body-md text-sm text-on-surface-variant">Ask any voting question</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant ml-auto group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>

              <Link href="/timeline" className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:bg-surface-container-high/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors">
                  <span className="material-symbols-outlined text-tertiary text-[28px]">event_note</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md font-bold text-on-surface text-lg">Timeline</span>
                  <span className="font-body-md text-sm text-on-surface-variant">See important dates</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant ml-auto group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>

              <Link href="/readiness" className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:bg-surface-container-high/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-surface-tint/10 flex items-center justify-center group-hover:bg-surface-tint/20 transition-colors">
                  <span className="material-symbols-outlined text-surface-tint text-[28px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md font-bold text-on-surface text-lg">My Status</span>
                  <span className="font-body-md text-sm text-on-surface-variant">Check your readiness</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant ml-auto group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}
