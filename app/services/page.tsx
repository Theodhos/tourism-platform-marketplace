import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { categories, getCategoryLabel, getCategorySearchValues, getSubcategorySearchValues } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";

export const dynamic = "force-dynamic";

function categoryValueFromSearch(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function ServicesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await connectDB();

  const query: Record<string, unknown> = { status: "approved" };
  const activeCategory = categoryValueFromSearch(searchParams.category);
  const activeSubcategory = categoryValueFromSearch(searchParams.subcategory);

  if (activeCategory) {
    query.category = { $in: getCategorySearchValues(activeCategory) };
  }
  if (activeSubcategory) {
    query.subcategory = {
      $in: getSubcategorySearchValues(activeCategory || undefined, activeSubcategory)
    };
  }
  if (typeof searchParams.location === "string" && searchParams.location) {
    query.location = { $regex: searchParams.location, $options: "i" };
  }
  if (typeof searchParams.country === "string" && searchParams.country) {
    query.country = { $regex: searchParams.country, $options: "i" };
  }
  if (typeof searchParams.q === "string" && searchParams.q) {
    query.$text = { $search: searchParams.q };
  }
  if (searchParams.featured === "true") {
    query.featured = true;
  }

  const minPrice =
    typeof searchParams.minPrice === "string" && searchParams.minPrice.trim() ? Number(searchParams.minPrice) : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string" && searchParams.maxPrice.trim() ? Number(searchParams.maxPrice) : undefined;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) (query.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (query.price as Record<string, number>).$lte = maxPrice;
  }

  const minRating =
    typeof searchParams.minRating === "string" && searchParams.minRating.trim() ? Number(searchParams.minRating) : undefined;
  if (minRating !== undefined) {
    query.ratingAverage = { $gte: minRating };
  }

  const sort: Record<string, 1 | -1> =
    searchParams.sort === "popular"
      ? { views: -1, createdAt: -1 }
      : searchParams.sort === "rating"
        ? { ratingAverage: -1, reviewCount: -1, createdAt: -1 }
        : { createdAt: -1 };

  const listings = await Listing.find(query).sort(sort).lean<any>();

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[260px] sm:min-h-[320px]">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
                alt="Marketplace"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-100">Marketplace</p>
                <h1 className="display-font mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Verified services, things to do, and places to stay
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-50 sm:text-base">
                  Each listing is reviewed before it goes live. Travelers can discover experiences, compare options, and filter by what matters most.
                </p>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <p className="eyebrow">Live overview</p>
              <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-4">
                <div className="rounded-[1.5rem] bg-brand-50 p-4">
                  <p className="text-2xl font-black">{listings.length}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-brand-700">Results</p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  <p className="text-2xl font-black">Trust</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-600">Moderated</p>
                </div>
                <div className="rounded-[1.5rem] bg-emerald-50 p-4">
                  <p className="text-2xl font-black">Live</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-700">Active</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
                <p className="text-sm text-slate-600">Selected category</p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {activeCategory ? getCategoryLabel(activeCategory) : "All categories"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Use the filters below to refine by subcategory, location, country, price, rating, and featured status.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="surface p-5 sm:p-6">
          <p className="eyebrow">Trending now</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Can not-miss tours",
              "Luxury stays",
              "Family experiences",
              "Private transfers"
            ].map((item) => (
              <div key={item} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Why it works</p>
            <p className="mt-3 text-lg font-bold">A clean discovery layer with a TripAdvisor-style filter model and a booking-first presentation.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category.value}
            href={`/services?category=${category.value}`}
            className={`group relative overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl ${
              index === 0 ? "md:col-span-2 xl:col-span-2" : ""
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={category.image}
                alt={category.label}
                fill
                className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[260px] lg:h-[280px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
            </div>
            <div className="relative flex min-h-[240px] flex-col justify-between p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {index + 1}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  Browse
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-brand-100">Category</p>
                <h2 className="display-font mt-2 text-3xl font-black">{category.label}</h2>
                <p className="mt-2 max-w-sm text-sm text-brand-50">
                  {category.subcategories.slice(0, 3).map((item) => item.label).join(" • ")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <SearchFilters />
        </aside>
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Results</p>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Approved listings</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              <Sparkles className="h-4 w-4" />
              {listings.length} found
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.length ? (
              listings.map((listing: any) => <ListingCard key={listing._id.toString()} listing={listing} />)
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                No approved listings match your selected filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
