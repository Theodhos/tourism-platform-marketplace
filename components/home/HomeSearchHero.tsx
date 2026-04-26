"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  CalendarDays,
  Landmark,
  MapPinned,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  UtensilsCrossed
} from "lucide-react";
import Button from "@/components/ui/Button";

const tabs = [
  { label: "All", value: "", icon: Search, placeholder: "Search tours, stays, restaurants, or transport..." },
  { label: "Stays", value: "akomodim", icon: Landmark, placeholder: "Hotels, villas, apartments..." },
  { label: "Food", value: "restorante", icon: UtensilsCrossed, placeholder: "Restaurants, cafes, bars..." },
  { label: "Things to do", value: "atraksione", icon: MapPinned, placeholder: "Attractions, tours, day trips..." },
  { label: "Events", value: "evente", icon: CalendarDays, placeholder: "Concerts, festivals, fairs..." },
  { label: "Services", value: "sherbime-turistike", icon: Sparkles, placeholder: "Guides, agencies, excursions..." },
  { label: "Local goods", value: "produkte-lokale", icon: ShoppingBag, placeholder: "Souvenirs, artisan products..." },
  { label: "Transport", value: "transport", icon: Bike, placeholder: "Airport transfers, rentals, boats..." }
];

export default function HomeSearchHero() {
  const router = useRouter();
  const [active, setActive] = useState(tabs[0]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("q") || "").trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (active.value) params.set("category", active.value);
    router.push(`/services?${params.toString()}`);
  }

  return (
    <section className="page-shell pt-6 sm:pt-8 lg:pt-10">
      <div className="surface relative overflow-hidden px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 soft-grid opacity-35" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="text-left">
            <div className="flex flex-wrap gap-2">
              <span className="chip">
                <Sparkles className="h-4 w-4 text-brand-600" />
                Inspired by modern travel platforms
              </span>
              <span className="chip">
                <Star className="h-4 w-4 text-amber-500" />
                Trusted by travelers
              </span>
            </div>
            <h1 className="display-font mt-5 max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Where are you going next?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Discover curated things to do, verified stays, and transport options with the editorial feel of TripAdvisor and the booking flow of GetYourGuide.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/services">Explore services</Button>
              <Button href="/listings/add" variant="ghost" className="bg-white/80">
                Host your experience
              </Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Listings", value: "100+", note: "Approved experiences" },
                { label: "Reviews", value: "4.8/5", note: "Trust signals" },
                { label: "Destinations", value: "24", note: "Growing coverage" }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] bg-slate-950 p-4 text-white shadow-2xl shadow-slate-950/20 sm:p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Traveler picks</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {[
                  { title: "Riviera escapes", text: "Beach clubs, boats, and sunset dinners." },
                  { title: "City highlights", text: "Museums, landmarks, and guided walks." },
                  { title: "Local taste", text: "Food tours and culinary stops." },
                  { title: "Easy transfers", text: "Airport and intercity transport." }
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-base font-bold">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-4 shadow-soft sm:mt-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const activeTab = active.value === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActive(tab)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab ? "bg-slate-950 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <Search className="h-5 w-5 text-slate-500" />
            <input
              name="q"
              placeholder={active.placeholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base"
            />
          </div>
          <Button type="submit" className="w-full rounded-3xl px-6 py-4 text-base md:w-[160px]">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
