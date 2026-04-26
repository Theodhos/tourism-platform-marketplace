import Button from "@/components/ui/Button";
import { Compass, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 soft-grid opacity-30" />
      <div className="absolute left-[-8rem] top-[-5rem] h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="absolute right-[-6rem] top-20 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="page-shell relative grid gap-10 py-16 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
            Verified travel services and experiences
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            A modern tourism marketplace built for discovery and trust.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Browse curated listings, submit your own travel service, and let admins approve quality experiences before they go live.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/services">Explore Services</Button>
            <Button href="/listings/add" variant="secondary">
              Add Your Listing
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Compass, label: "Destinations", value: "Curated" },
              { icon: ShieldCheck, label: "Moderation", value: "Trusted" },
              { icon: Star, label: "Reviews", value: "Real feedback" }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur">
                <item.icon className="h-5 w-5 text-brand-600" />
                <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-br from-brand-200/30 to-sky-200/20 blur-2xl" />
          <div className="relative glass rounded-[2.2rem] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white shadow-soft">
                <p className="text-sm text-slate-300">Listings</p>
                <p className="mt-2 text-3xl font-black">100+</p>
                <p className="mt-2 text-sm text-slate-300">Experience categories across travel, stays, and transport.</p>
              </div>
              <div className="rounded-[1.8rem] bg-brand-600 p-5 text-white shadow-soft">
                <p className="text-sm text-brand-100">Trust</p>
                <p className="mt-2 text-3xl font-black">Moderated</p>
                <p className="mt-2 text-sm text-brand-50">Every listing starts pending until reviewed by admin.</p>
              </div>
              <div className="rounded-[1.8rem] bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Favorites</p>
                <p className="mt-2 text-3xl font-black text-slate-900">Saved</p>
                <p className="mt-2 text-sm text-slate-600">Let users bookmark listings for later comparison.</p>
              </div>
              <div className="rounded-[1.8rem] bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Reviews</p>
                <p className="mt-2 text-3xl font-black text-slate-900">Rated</p>
                <p className="mt-2 text-sm text-slate-600">Collect feedback to help travelers choose confidently.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-[1.8rem] border border-white/70 bg-white/80 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Beautiful and responsive</p>
                  <p className="text-xs text-slate-500">Tailwind-first UI for modern tourism discovery.</p>
                </div>
              </div>
              <Compass className="h-8 w-8 text-brand-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
