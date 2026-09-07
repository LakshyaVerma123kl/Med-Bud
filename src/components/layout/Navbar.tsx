"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun, Stethoscope, LayoutDashboard, BookOpen, Menu, X, Settings as SettingsIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { 
    setMounted(true); 
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { href: "/", label: "Home", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/60 shadow-sm transition-transform group-hover:scale-105 bg-primary/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-sm.webp" alt="MedQuiz Logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-serif font-bold text-foreground tracking-tight leading-none">MedQuiz</h1>
              <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">Pro Edition</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Auth Button */}
            {mounted && (
              <div className="hidden sm:block mr-2">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      {user.email?.split('@')[0]}
                    </span>
                    <Link
                      href="/settings"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Settings"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/settings"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Settings"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/login"
                      className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl absolute top-full left-0 right-0 shadow-2xl"
          >
            <div className="px-4 py-4 space-y-2 pb-6">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-5 py-4 min-h-[56px] rounded-xl text-lg font-bold transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-2 border-t border-border/50">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-5 py-2">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Signed in as {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 min-h-[56px] rounded-xl text-lg font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        supabase.auth.signOut();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 px-5 py-4 min-h-[56px] rounded-xl text-lg font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-left w-full"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 min-h-[56px] rounded-xl text-lg font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      Settings & Storage
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-3 px-5 py-4 min-h-[56px] rounded-xl text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm mx-2 mt-2"
                    >
                      Log In with Google
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
