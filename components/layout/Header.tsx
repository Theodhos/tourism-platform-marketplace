"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, Globe2, Menu, Search, X } from "lucide-react";
import Button from "@/components/ui/Button";

type Me = { name: string; role: "user" | "admin" } | null;

export default function Header() {
  const [me, setMe] = useState<Me>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setMe(data.user ?? null))
      .catch(() => setMe(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setMobileOpen(false);
    window.location.href = "/";
  }

  const navLinkClass =
    "text-sm font-semibold text-slate-700 transition hover:text-brand-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/5 bg-white/80 backdrop-blur-2xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
            <Compass className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-slate-950">Tourism Platform</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Discover more</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link href="/services" className={navLinkClass}>
            Services
          </Link>
          <Link href="/blog" className={navLinkClass}>
            Blog
          </Link>
          {me ? (
            <Link href="/dashboard" className={navLinkClass}>
              Dashboard
            </Link>
          ) : null}
          <Link href="/listings/add" className={navLinkClass}>
            Add Listing
          </Link>
          {me?.role === "admin" ? (
            <Link href="/admin" className={navLinkClass}>
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/services"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm lg:inline-flex"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <button className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 lg:inline-flex">
            <Globe2 className="mr-2 h-4 w-4" />
            USD
          </button>
          {me ? (
            <>
              <span className="hidden text-sm text-slate-600 md:inline">Hi, {me.name}</span>
              <Button href="/dashboard" className="hidden sm:inline-flex">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={logout} className="hidden sm:inline-flex">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" className="hidden sm:inline-flex">
                Login
              </Button>
              <Button href="/register" className="hidden sm:inline-flex">
                Register
              </Button>
            </>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="page-shell space-y-4 py-4">
            <div className="grid gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
              <Link href="/" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link href="/services" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
                Services
              </Link>
              <Link href="/blog" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link href="/listings/add" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
                Add Listing
              </Link>
              {me?.role === "admin" ? (
                <Link href="/admin" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/services" className="chip justify-center" onClick={() => setMobileOpen(false)}>
                <Search className="h-4 w-4 text-brand-600" />
                Search
              </Link>
              <button className="chip justify-center">
                <Globe2 className="h-4 w-4 text-brand-600" />
                USD
              </button>
            </div>

            {me ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button href="/dashboard" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button href="/login" variant="ghost" onClick={() => setMobileOpen(false)}>
                  Login
                </Button>
                <Button href="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
