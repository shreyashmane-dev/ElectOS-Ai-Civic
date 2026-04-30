"use client";

import { useState, useEffect } from "react";
import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile, UserProfile } from "@/lib/firebase/firestore";

export function ProfileSettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    darkTheme: true,
    notifications: true,
    telemetry: false
  });

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
        } else {
          // Initialize if not found
          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            location: "San Francisco, CA",
            district: "CA-01",
            votingStatus: "Active"
          });
        }
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const userInitials = profile.displayName
    ? profile.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
    : user?.email ? user.email[0].toUpperCase() : "U";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSave = async () => {
    if (user?.uid) {
      try {
        await updateUserProfile(user.uid, profile);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update profile", error);
        alert("Error saving profile. Please try again.");
      }
    }
  };

  if (loading) return (
    <ConsoleShell title="Loading..." subtitle="">
      <div className="flex items-center justify-center h-64 animate-pulse text-primary font-bold">
        LOADING YOUR PROFILE...
      </div>
    </ConsoleShell>
  );

  return (
    <ConsoleShell
      title="My Profile"
      subtitle="Manage your personal information and app settings."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left - Identity Card */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-3xl p-10 flex flex-col items-center text-center gap-6 relative overflow-hidden">
            <div className="specular-highlight" />
            <div className="relative group">
              <div className="w-32 h-32 rounded-full p-1 border-2 border-primary/30 group-hover:border-primary transition-colors">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-black text-white shadow-xl">
                  {userInitials}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {isEditing ? (
                <input 
                  className="font-headline-md text-2xl font-black text-center bg-surface-container-low border border-primary/30 rounded-xl px-4 py-2 outline-none focus:border-primary transition-all text-on-surface"
                  value={profile.displayName}
                  onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                />
              ) : (
                <h3 className="font-headline-md text-3xl font-black text-on-surface">{profile.displayName || "Guest User"}</h3>
              )}
              <p className="font-body-md text-on-surface-variant">{profile.email}</p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="px-4 py-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="font-label-caps text-[10px] text-primary tracking-widest font-bold uppercase">REGISTERED VOTER</span>
              </div>
              <div className="px-4 py-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
                {isEditing ? (
                  <input 
                    className="font-label-caps text-[10px] bg-transparent border-b border-secondary/30 outline-none text-center font-bold tracking-widest text-on-surface"
                    value={profile.district}
                    onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
                  />
                ) : (
                  <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest font-bold uppercase">District: {profile.district}</span>
                )}
              </div>
            </div>

            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
                isEditing 
                  ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
                  : 'bg-surface-container-highest text-primary border border-primary/20 hover:bg-primary/10'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs text-on-surface-variant hover:text-on-surface font-bold underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right - Detailed Settings */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="glass-card rounded-3xl p-8 flex flex-col gap-8">
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <span className="material-symbols-outlined text-primary">person</span>
              <h4 className="font-headline-md text-2xl font-bold text-on-surface">Personal Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: profile.displayName || "Not set", key: "displayName" },
                { label: "Email Address", value: profile.email || "Not set", key: "email", disabled: true },
                { label: "Location", value: profile.location || "Not set", key: "location" },
                { label: "District ID", value: profile.district || "Not set", key: "district" },
              ].map((field, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/20">
                  <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{field.label}</span>
                  {isEditing && !field.disabled ? (
                    <input 
                      className="font-headline-md font-bold text-on-surface bg-transparent border-none outline-none focus:text-primary"
                      value={field.value}
                      onChange={(e) => setProfile(prev => ({ ...prev, [field.key as string]: e.target.value }))}
                    />
                  ) : (
                    <span className="font-headline-md font-bold text-on-surface">{field.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col gap-8">
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <span className="material-symbols-outlined text-secondary">settings_suggest</span>
              <h4 className="font-headline-md text-2xl font-bold text-on-surface">App Settings</h4>
            </div>

            <div className="flex flex-col gap-8">
              {[
                { 
                  id: "darkTheme", 
                  title: "Dark Theme", 
                  desc: "Use a dark color scheme throughout the app.",
                  icon: "dark_mode"
                },
                { 
                  id: "notifications", 
                  title: "Voting Alerts", 
                  desc: "Get reminders for election dates and deadlines.",
                  icon: "notifications_active"
                },
                { 
                  id: "telemetry", 
                  title: "Help Improve", 
                  desc: "Share anonymous data to help us improve the guide.",
                  icon: "insights"
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md font-bold text-on-surface">{item.title}</span>
                      <span className="font-body-md text-sm text-on-surface-variant">{item.desc}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                      settings[item.id as keyof typeof settings] ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings[item.id as keyof typeof settings] ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-error/10 hover:bg-error/20 border border-error/30 rounded-2xl font-headline-md text-sm font-bold text-error uppercase tracking-widest transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    </ConsoleShell>
  );
}
