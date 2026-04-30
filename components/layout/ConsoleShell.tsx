"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/components/providers/ThemeProvider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/assistant", label: "AI Guide", icon: "smart_toy" },
  { href: "/timeline", label: "Timeline", icon: "event_note" },
  { href: "/readiness", label: "Voter Status", icon: "verified_user" },
  { href: "/fact-checker", label: "Fact Checker", icon: "gavel" },
  { href: "/scenario", label: "Scenario Map", icon: "explore" },
];

export function ConsoleShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useThemeContext();

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : "U";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-body-md text-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <nav className="fixed left-0 top-0 bottom-0 z-50 hidden w-72 flex-col border-r border-white/5 bg-slate-950/80 py-6 shadow-2xl backdrop-blur-3xl md:flex">
        <div className="mb-10 px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
            </div>
            <div>
              <h1 className="font-headline-md text-2xl font-black leading-none tracking-tighter text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                ElectOS
              </h1>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                CIVIC PLATFORM
              </p>
            </div>
          </Link>
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300",
                  active
                    ? "border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-white",
                )}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-[11px]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t border-white/5 px-4 pt-6">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300",
              pathname === "/profile"
                ? "border border-primary/20 bg-primary/10 text-primary"
                : "text-on-surface-variant hover:bg-white/5 hover:text-white",
            )}
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            <span className="text-[11px]">My Profile</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300",
              pathname === "/settings"
                ? "border border-primary/20 bg-primary/10 text-primary"
                : "text-on-surface-variant hover:bg-white/5 hover:text-white",
            )}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="text-[11px]">Settings</span>
          </Link>
        </div>
      </nav>

      <header className="fixed top-0 right-0 left-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-slate-950/60 px-4 shadow-lg backdrop-blur-2xl sm:px-6 md:left-72 md:px-10">
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <span className="material-symbols-outlined text-[18px] text-white">account_balance</span>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-on-surface">ElectOS</span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">CURRENT PAGE /</span>
          <span className="text-sm font-black uppercase tracking-widest text-primary">{title}</span>
        </div>

        <div className="ml-auto flex items-center gap-4 sm:gap-6 lg:gap-8">
          <div className="group hidden w-80 items-center rounded-xl border border-outline-variant/20 bg-surface-container-low/60 px-4 py-2 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 lg:flex">
            <span className="material-symbols-outlined mr-3 text-[18px] text-outline-variant transition-colors group-focus-within:text-primary">
              search
            </span>
            <input
              className="h-6 w-full border-none bg-transparent p-0 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
              placeholder="Search voter info..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-3 border-l border-white/5 pl-4 sm:gap-4 sm:pl-6 lg:pl-8">
            <button 
              onClick={toggleTheme}
              className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <button className="relative rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full border border-slate-950 bg-secondary"></span>
            </button>
            <Link href="/profile" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-tr from-primary to-secondary shadow-lg transition-transform group-hover:scale-105">
                <span className="font-headline-md text-[14px] font-black text-white">{userInitials}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-0 flex min-h-screen flex-col pb-24 pt-20 md:ml-72 md:pb-0">
        <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[20%] h-[50%] w-[30%] rounded-full bg-secondary/5 blur-[150px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 p-4 sm:p-6 md:gap-12 md:p-12">
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#00f0ff]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">CALIFORNIA DISTRICT 1</span>
            </div>
            <h2 className="font-display-xl text-4xl font-black leading-none tracking-tighter text-on-surface sm:text-5xl md:text-6xl">
              {title}
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant sm:text-lg">{subtitle}</p>
          </section>

          <div className="w-full">{children}</div>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/90 px-2 py-2 backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-3 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-xl px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em]",
                  active ? "bg-primary/10 text-primary" : "text-on-surface-variant",
                )}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
