import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-900/5 bg-white">
      <div className="page-shell py-12">
        <div className="surface-strong px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Tourism Platform</p>
              <h2 className="display-font mt-3 text-4xl font-black leading-tight">
                Plan, review, and book the kind of trip people remember.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Built for travelers, hosts, and editors. A single platform for discovery, trust, and high-quality tourism listings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/services" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                Explore services
              </Link>
              <Link href="/listings/add" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">
                Add a listing
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-black text-slate-950">Tourism Platform</p>
            <p className="mt-2 text-sm text-slate-600">A premium travel discovery and booking lead platform.</p>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Explore</p>
            <Link href="/services" className="block hover:text-brand-700">
              Services
            </Link>
            <Link href="/blog" className="block hover:text-brand-700">
              Blog
            </Link>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Get started</p>
            <Link href="/listings/add" className="block hover:text-brand-700">
              Add Listing
            </Link>
            <Link href="/register" className="block hover:text-brand-700">
              Create account
            </Link>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Follow</p>
            <div className="flex gap-3">
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
