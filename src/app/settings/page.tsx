"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Settings as SettingsIcon, User as UserIcon, LogOut, Trash2, RefreshCw, AlertTriangle, ShieldAlert } from "lucide-react";
import { useSync } from "@/hooks/useSync";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { fetchRemoteData } = useSync();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      
      // Pull name from user metadata (Google OAuth) or our table
      if (session.user.user_metadata?.full_name) {
        setFullName(session.user.user_metadata.full_name);
      } else {
        const { data } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        if (data?.full_name) setFullName(data.full_name);
      }
      
      setIsLoading(false);
    });
  }, [router]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);
      
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleForceSync = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await fetchRemoteData();
      setMessage({ type: 'success', text: 'Data synchronized with cloud successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Sync failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearLocal = () => {
    if (confirm("Are you sure you want to clear local progress? This will reset your device's progress until you sync with the cloud again.")) {
      localStorage.removeItem("medquiz_progress");
      localStorage.removeItem("medquiz_bookmarks");
      localStorage.removeItem("medquiz_sr_state");
      setMessage({ type: 'success', text: 'Local data cleared. Refresh the page to see changes.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("DANGER: Are you absolutely sure you want to permanently delete your account and all associated data? This cannot be undone.")) {
      setIsDeleting(true);
      try {
        const res = await fetch("/api/auth/delete-account", { method: "POST" });
        if (!res.ok) throw new Error("Deletion failed");
        
        await supabase.auth.signOut();
        router.push("/");
      } catch (error) {
        console.error(error);
        alert("Failed to delete account. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-[80vh] flex items-center justify-center">Loading settings...</div>;
  }

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-foreground">Settings</h1>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-lg font-medium text-sm ${message.type === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="clean-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-muted-foreground" />
            Profile Information
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-background shadow-md object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-md">
                  <UserIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Email (Read Only)</label>
                <input 
                  type="text" 
                  disabled 
                  value={user?.email || ""} 
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/50 text-muted-foreground font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                />
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="clean-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
            Data Management
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <h3 className="font-semibold text-sm mb-1">Force Cloud Sync</h3>
              <p className="text-xs text-muted-foreground mb-4">Pull the latest data from the cloud and merge it with your device.</p>
              <button onClick={handleForceSync} className="w-full bg-background border border-border hover:bg-muted text-sm font-semibold py-2 rounded-md transition-colors">
                Sync Now
              </button>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <h3 className="font-semibold text-sm mb-1">Clear Local Data</h3>
              <p className="text-xs text-muted-foreground mb-4">Wipe progress stored only on this browser/device.</p>
              <button onClick={handleClearLocal} className="w-full bg-background border border-border hover:bg-error/10 hover:text-error hover:border-error/20 text-sm font-semibold py-2 rounded-md transition-colors">
                Clear Local Data
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="clean-card p-6 sm:p-8 border-error/20 bg-error/5">
          <h2 className="text-lg font-bold text-error mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-error/80 mb-6">
            Deleting your account will permanently wipe all your progress, bookmarks, spaced repetition data, and custom PDF quizzes from the cloud. This action is irreversible.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-error text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-error/90 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Permanently Delete Account"}
          </button>
        </section>

        {/* Log Out */}
        <div className="pt-4 flex justify-end">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold px-4 py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
