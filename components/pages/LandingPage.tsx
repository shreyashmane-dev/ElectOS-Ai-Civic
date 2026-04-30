"use client";

import Link from "next/link";

const featureCards = [
  {
    title: "AI Voting Guide",
    description: "Get personalized voting information for your area. Ask any question and get clear, simple answers.",
    icon: "smart_toy",
    color: "text-primary"
  },
  {
    title: "Fact Checker",
    description: "Check any news story or message to see if it's true. Stay informed with verified facts.",
    icon: "gavel",
    color: "text-secondary"
  },
  {
    title: "Scenario Map",
    description: "Find out what to do if you move, lose your ID, or miss a deadline. Be prepared for anything.",
    icon: "explore",
    color: "text-tertiary"
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background font-body-md text-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      {/* Dynamic Backgrounds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-primary-fixed-dim/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-secondary-fixed-dim/5 blur-[150px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] h-[30vw] w-[30vw] rounded-full bg-surface-tint/5 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-slate-950/40 px-10 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span className="material-symbols-outlined text-white text-[18px]">account_balance</span>
          </div>
          <span className="font-headline-md text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
            ElectOS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#features">FEATURES</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">HOW IT WORKS</a>
          <Link href="/login" className="font-label-caps text-label-caps text-primary hover:text-primary-fixed transition-colors">LOGIN</Link>
          <Link
            href="/signup"
            className="pulse-button font-headline-md text-sm font-bold bg-primary text-on-primary px-8 py-3 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            GET STARTED
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-32 text-center overflow-hidden">
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[800px] h-[800px] rounded-full border border-primary/20 animate-spin-slow" />
            <div className="absolute w-[600px] h-[600px] rounded-full border border-secondary/10 animate-reverse-spin-slow" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">verified</span>
              <span className="font-label-caps text-[10px] tracking-widest text-primary font-bold uppercase">2024 Election Guide is Live</span>
            </div>
            
            <h1 className="font-display-xl text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 bg-gradient-to-br from-white via-on-surface to-primary-fixed bg-clip-text text-transparent">
              Voting Made <br /> Simple for Everyone.
            </h1>
            
            <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
              Get clear answers to your voting questions, check facts, and stay prepared for election day. We're here to help you navigate the process with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/signup"
                className="group relative px-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.25)] hover:shadow-[0_0_60px_rgba(0,240,255,0.4)] transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <span className="font-headline-md text-lg font-black text-on-primary uppercase tracking-widest">GET STARTED NOW</span>
                  <span className="material-symbols-outlined text-on-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
              <button className="px-8 py-5 rounded-2xl border border-outline-variant/30 hover:bg-white/5 transition-all font-headline-md text-sm font-bold text-on-surface uppercase tracking-widest">
                LEARN MORE
              </button>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="features" className="py-32 px-10 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center text-center gap-4 mb-20">
            <span className="font-label-caps text-label-caps text-primary">OUR TOOLS</span>
            <h2 className="font-headline-md text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Everything you need.</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((f, i) => (
              <div key={i} className="glass-card group p-10 rounded-3xl flex flex-col gap-6 hover:translate-y-[-10px] transition-all duration-500 relative overflow-hidden">
                <div className="specular-highlight" />
                <div className={`w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/30 group-hover:border-primary/50 transition-colors shadow-lg`}>
                  <span className={`material-symbols-outlined ${f.color} text-[32px]`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {f.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-headline-md text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    {f.description}
                  </p>
                </div>
                <div className="mt-auto pt-6 border-t border-outline-variant/10">
                  <span className="font-label-caps text-[11px] text-primary tracking-widest uppercase font-bold group-hover:translate-x-2 transition-transform inline-block">READY TO USE</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Neural Analysis Section */}
        <section id="how-it-works" className="py-32 bg-slate-950/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col gap-8">
              <span className="font-label-caps text-label-caps text-secondary">FACT CHECKER</span>
              <h2 className="font-headline-md text-4xl md:text-6xl font-black text-on-surface tracking-tighter leading-[1.1]">
                Stop Fake News <br /> in its tracks.
              </h2>
              <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
                Our AI cross-checks any claim against official sources to help you spot misinformation before it spreads.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "Clear true or false results",
                  "Links to official sources",
                  "Easy-to-understand explanations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                      <span className="material-symbols-outlined text-secondary text-[14px]">done</span>
                    </div>
                    <span className="font-headline-md text-sm font-bold text-on-surface uppercase tracking-wider">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass-card rounded-[40px] p-1 shadow-2xl relative z-10 overflow-hidden aspect-video group">
                <div className="absolute inset-0 bg-gradient-to-tr from-error/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="bg-background w-full h-full rounded-[39px] flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                   <div className="flex flex-col items-center gap-4 animate-pulse">
                     <span className="material-symbols-outlined text-error text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                     <span className="font-display-xl text-3xl font-black text-error">CHECKING NEWS...</span>
                   </div>
                </div>
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-secondary/20 blur-[80px] rounded-full z-0" />
              <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-primary/20 blur-[100px] rounded-full z-0" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/60 pt-24 pb-12 px-10 backdrop-blur-3xl relative z-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-white">account_balance</span>
              </div>
              <span className="font-headline-md text-3xl font-black text-on-surface tracking-tighter">ElectOS</span>
            </div>
            <p className="font-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Making voting and civic participation easy and accessible for everyone.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <span className="font-label-caps text-label-caps text-primary">PAGES</span>
            <ul className="flex flex-col gap-4 font-headline-md text-sm font-medium">
              <li><Link href="/dashboard" className="text-on-surface-variant hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/assistant" className="text-on-surface-variant hover:text-white transition-colors">AI Guide</Link></li>
              <li><Link href="/fact-checker" className="text-on-surface-variant hover:text-white transition-colors">Fact Checker</Link></li>
              <li><Link href="/timeline" className="text-on-surface-variant hover:text-white transition-colors">Timeline</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <span className="font-label-caps text-label-caps text-secondary">SUPPORT</span>
            <ul className="flex flex-col gap-4 font-headline-md text-sm font-medium">
              <li><span className="text-on-surface-variant">Help Center</span></li>
              <li><span className="text-on-surface-variant">Voting Rules</span></li>
              <li><span className="text-on-surface-variant">Contact Us</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5 font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant uppercase font-bold">
          <span>© 2024 ElectOS CIVIC SYSTEMS.</span>
          <div className="flex items-center gap-6">
            <span>PRIVACY</span>
            <span>TERMS</span>
            <div className="flex items-center gap-2 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00f0ff]" />
              SYSTEM ACTIVE
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin-slow {
          animation: reverse-spin-slow 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
