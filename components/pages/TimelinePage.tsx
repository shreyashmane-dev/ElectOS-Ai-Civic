"use client";

import { ConsoleShell } from "@/components/layout/ConsoleShell";

const stages = [
  { title: "Registration", state: "COMPLETED", active: false, icon: "how_to_reg", desc: "Voter registration is finished in your area." },
  { title: "Candidates", state: "COMPLETED", active: false, icon: "assignment_ind", desc: "All candidates for the upcoming election are finalized." },
  { title: "Campaign", state: "LIVE NOW", active: true, icon: "campaign", desc: "Candidates are currently sharing their plans and debating." },
  { title: "Voting", state: "NOV 5", active: false, icon: "how_to_vote", desc: "Election day! Polling stations will be open all day." },
  { title: "Counting", state: "NOV 5-8", active: false, icon: "tally", desc: "Votes are being counted and verified for accuracy." },
  { title: "Results", state: "DEC 1", active: false, icon: "verified", desc: "The official final results are announced and confirmed." },
];

export function TimelinePage() {
  return (
    <ConsoleShell
      title="Timeline"
      subtitle="See the full schedule for the current election cycle and track our progress."
    >
      <section className="relative py-20 px-4 overflow-x-auto custom-scrollbar">
        <div className="relative min-w-[1200px] h-[500px]">
          {/* Main Progress Line */}
          <div className="absolute top-[60px] left-[100px] right-[100px] h-[2px] bg-surface-container-high">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary w-[45%] shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
          </div>

          {/* Stages Grid */}
          <div className="absolute inset-0 flex justify-between px-10">
            {stages.map((stage, i) => (
              <div 
                key={i} 
                className={`flex flex-col items-center gap-8 w-56 transition-all duration-500 ${stage.active ? '-translate-y-10 scale-105' : ''}`}
              >
                {/* Node */}
                <div className="relative">
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      stage.active 
                        ? 'bg-secondary text-on-secondary border-white shadow-[0_0_30px_rgba(110,6,208,0.5)] z-20' 
                        : stage.state === 'COMPLETED'
                          ? 'bg-primary-container text-on-primary-container border-primary/30 z-10'
                          : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/20 z-0'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[28px]" style={stage.active || stage.state === 'COMPLETED' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {stage.icon}
                    </span>
                  </div>
                  {stage.active && (
                    <div className="absolute -inset-2 rounded-full border border-secondary/30 animate-ping opacity-50" />
                  )}
                </div>

                {/* Card */}
                <div 
                  className={`glass-card rounded-2xl p-6 flex flex-col gap-3 shadow-xl relative w-full text-center ${
                    stage.active ? 'border-secondary/40' : 'opacity-80'
                  }`}
                >
                  {stage.active && <div className="specular-highlight" />}
                  <div className="flex flex-col gap-1">
                    <h3 className={`font-headline-md text-lg font-bold ${stage.active ? 'text-primary' : 'text-on-surface'}`}>
                      {stage.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      {stage.active && <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />}
                      <span className={`font-label-caps text-[10px] tracking-widest uppercase font-bold ${
                        stage.active ? 'text-secondary' : stage.state === 'COMPLETED' ? 'text-primary' : 'text-on-surface-variant'
                      }`}>
                        {stage.state}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                    {stage.desc}
                  </p>
                  
                  {stage.active && (
                    <button className="mt-2 py-2 px-4 bg-secondary/10 hover:bg-secondary/20 text-secondary text-[11px] font-bold rounded-lg border border-secondary/20 transition-all uppercase tracking-tighter">
                      View News Coverage
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {[
          { label: "Days Until Election", value: "42", icon: "timer" },
          { label: "Voter Turnout Trend", value: "68%", icon: "groups" },
          { label: "System Reliability", value: "99.9%", icon: "verified" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">{stat.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{stat.label}</span>
              <span className="font-headline-md text-2xl font-black text-on-surface">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </ConsoleShell>
  );
}
