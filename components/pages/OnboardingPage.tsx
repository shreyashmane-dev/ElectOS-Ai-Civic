"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createUserProfile } from "@/lib/firebase/firestore";

export function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState<"first" | "regular">("regular");
  const [birthYear, setBirthYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!user?.uid || birthYear.length !== 4) return;
    
    setIsSubmitting(true);
    try {
      await createUserProfile(user.uid, {
        displayName: user.displayName || "Citizen",
        email: user.email || "",
        votingStatus: selected === "first" ? "First-time Voter" : "Regular Voter",
        location: "California", // Default or gathered elsewhere
        district: "CA-01",     // Default
        onboardingCompleted: true,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding data", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-body-md text-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Dynamic Backgrounds */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]" />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-[20px]">account_balance</span>
            </div>
            <span className="font-headline-md text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
              ElectOS
            </span>
          </div>

          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant font-bold uppercase">WELCOME</span>
              <span className="font-label-caps text-[10px] tracking-widest text-primary font-bold uppercase">STEP 01 OF 03</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest/30">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display-xl text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Welcome to ElectOS.</h2>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-xl leading-relaxed">
              To help you get started, please tell us a little bit about your voting status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setSelected("first")}
              className={`glass-card group rounded-2xl p-8 text-left transition-all duration-500 hover:translate-y-[-4px] relative overflow-hidden ${
                selected === "first" ? 'border-primary/50 bg-primary/5' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {selected === "first" && <div className="specular-highlight" />}
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-outline-variant/30 transition-colors ${
                selected === 'first' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container/40'
              }`}>
                <span className="material-symbols-outlined text-[28px]" style={selected === 'first' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  child_care
                </span>
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">First-time Voter</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                I have never voted before and need to learn how everything works.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelected("regular")}
              className={`glass-card group rounded-2xl p-8 text-left transition-all duration-500 hover:translate-y-[-4px] relative overflow-hidden ${
                selected === "regular" ? 'border-secondary/50 bg-secondary/5' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {selected === "regular" && <div className="specular-highlight" />}
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-outline-variant/30 transition-colors ${
                selected === 'regular' ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-surface-container/40'
              }`}>
                <span className="material-symbols-outlined text-[28px]" style={selected === 'regular' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  how_to_reg
                </span>
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">Regular Voter</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                I have voted in the past and am already registered to vote.
              </p>
            </button>
          </div>

          <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="specular-highlight opacity-30" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-tint/10 flex items-center justify-center border border-surface-tint/20">
                  <span className="material-symbols-outlined text-surface-tint">calendar_month</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">Age Check</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">Confirm you are eligible to vote.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative group w-full md:w-40">
                  <input
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, ""))}
                    placeholder="YYYY"
                    className="w-full bg-surface-container-low/60 rounded-xl border border-outline-variant/30 px-4 py-3 text-lg font-headline-md font-bold text-on-surface outline-none focus:border-primary transition-all text-center tracking-widest"
                    maxLength={4}
                  />
                </div>
                <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-widest whitespace-nowrap">Birth Year</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between pt-10 border-t border-white/5">
          <button 
            type="button" 
            className="font-headline-md text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
            onClick={() => router.back()}
          >
            GO BACK
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={birthYear.length !== 4 || isSubmitting}
            className="group relative px-10 py-4 bg-gradient-to-r from-primary to-primary-fixed-dim rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center gap-3">
              <span className="font-headline-md text-sm font-black text-on-primary uppercase tracking-widest">
                {isSubmitting ? "SAVING..." : "CONTINUE"}
              </span>
              {!isSubmitting && <span className="material-symbols-outlined text-on-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </div>
          </button>
        </footer>
      </main>
    </div>
  );
}
