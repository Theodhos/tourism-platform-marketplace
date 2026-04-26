import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import BlogPost from "@/models/BlogPost";
import { categories } from "@/lib/constants";
import HomeSearchHero from "@/components/home/HomeSearchHero";
import ListingCard from "@/components/ListingCard";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const destinationCards = [
  {
    title: "Ksamil and Saranda escapes",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    count: "105"
  },
  {
    title: "Mountain hikes and viewpoints",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    count: "1,099"
  },
  {
    title: "Coastal heritage experiences",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    count: "102"
  },
  {
    title: "Island boat transfers",
    image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    count: "384"
  }
];

const storyCards = [
  {
    title: "6 stunning superblooms worth traveling for",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Everything you need to know about skillcations",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "12 trips where you will never need to rent a car",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80"
  }
];

export default async function HomePage() {
  await connectDB();
  const featuredListings = (await Listing.find({ status: "approved" })
    .sort({ featured: -1, ratingAverage: -1, createdAt: -1 })
    .limit(3)
    .lean<any>()) || [];
  const blogPosts = (await BlogPost.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean<any>()) || [];

  return (
    <>
      <HomeSearchHero />

      <section className="page-shell mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80"
                alt="Travel inspiration"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent p-5 text-white sm:p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-brand-100">Editorial spotlight</p>
                <h2 className="display-font mt-2 text-3xl font-black leading-tight sm:text-4xl">
                  Find things to do for everything you are into
                </h2>
                <p className="mt-3 max-w-lg text-sm text-slate-200 sm:text-base">
                  Browse curated experiences and book trusted listings from a marketplace designed for discovery and confidence.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">Featured experience</p>
              <h2 className="section-heading mt-4">A travel marketplace built like a guide and a booking engine</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                The structure blends editorial inspiration, traveler trust signals, and direct discovery. It should feel useful before it feels promotional.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Verified listings",
                  "Traveler reviews",
                  "Search and filtering",
                  "Editorial stories"
                ].map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/services"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white sm:w-fit"
              >
                Book now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="surface p-5 sm:p-6">
          <p className="eyebrow">Quick facts</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { label: "Verified listings", value: "Quality approved" },
              { label: "Popular categories", value: "Tours, stays, transport" },
              { label: "Ratings", value: "4.8 average" },
              { label: "Support", value: "Fast moderation" }
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-14 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Categories</p>
            <h2 className="section-heading mt-2">Choose the service you need</h2>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.value}
              href={`/services?category=${category.value}`}
              className={`group relative overflow-hidden rounded-[2rem] shadow-soft ${
                index === 0 || index === 1 ? "md:col-span-1 xl:col-span-2" : ""
              }`}
            >
              <Image
                src={category.image}
                alt={category.label}
                width={900}
                height={700}
                className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[260px] lg:h-[280px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-100">Browse by category</p>
                    <h3 className="display-font mt-1 text-3xl font-black">{category.label}</h3>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 max-w-md text-sm text-brand-50">
                  {category.subcategories.slice(0, 4).map((item) => item.label).join(" • ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell py-8 sm:py-10">
        <div className="mb-8">
          <p className="eyebrow">Explore experiences</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Can not-miss picks near you</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {destinationCards.map((card) => (
            <article key={card.title} className="travel-card bg-white p-0">
              <div className="relative overflow-hidden">
                <Image src={card.image} alt={card.title} width={700} height={500} className="h-[210px] w-full object-cover sm:h-[230px]" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900">
                  Traveler favorite
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-black leading-snug text-slate-950 sm:text-xl">{card.title}</h3>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <Star className="h-4 w-4 text-amber-500" />
                  {card.rating} <span>({card.count})</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-700">from $38 per adult</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Popular listings</p>
            <h2 className="section-heading mt-2">Featured marketplace picks</h2>
          </div>
          <p className="max-w-2xl text-sm text-slate-600">
            These cards should feel like premium inventory from the moment they load. Strong imagery, rating context, and a direct path to details.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredListings.length ? (
            featuredListings.map((listing: any) => <ListingCard key={listing._id.toString()} listing={listing} />)
          ) : (
            <>
              <ListingCard
                listing={{
                  slug: "sample-villa",
                  title: "Oceanfront Villa Escape",
                  location: "Mombasa",
                  country: "Kenya",
                  category: "Stays",
                  subcategory: "Villas",
                  description: "A quiet, luxury stay with sunset views and curated local experiences.",
                  images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],
                  status: "approved",
                  featured: true,
                  priceFrom: 180,
                  currency: "USD",
                  ratingAverage: 4.9
                }}
              />
              <ListingCard
                listing={{
                  slug: "sample-tour",
                  title: "Cultural City Tour",
                  location: "Stone Town",
                  country: "Tanzania",
                  category: "Tours",
                  subcategory: "Cultural",
                  description: "Walk historic streets with an expert local guide and taste regional food.",
                  images: ["https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"],
                  status: "approved",
                  featured: true,
                  priceFrom: 38,
                  currency: "USD",
                  ratingAverage: 4.8
                }}
              />
              <ListingCard
                listing={{
                  slug: "sample-transfer",
                  title: "Private Airport Transfer",
                  location: "Dar es Salaam",
                  country: "Tanzania",
                  category: "Transport",
                  subcategory: "Airport Transfer",
                  description: "Reliable pickup and drop-off for travelers arriving any time of day.",
                  images: ["https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80"],
                  status: "approved",
                  featured: false,
                  priceFrom: 25,
                  currency: "USD",
                  ratingAverage: 4.7
                }}
              />
            </>
          )}
        </div>
      </section>

      <section className="page-shell py-12 sm:py-14 lg:py-16">
        <div className="surface-strong px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-brand-200">Travelers choice</p>
              <h2 className="display-font mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Awards Best of the Best for trusted tourism listings
              </h2>
              <p className="mt-4 max-w-2xl text-brand-50">
                Top picks from across the marketplace, chosen by visitors, ratings, and quality moderation.
              </p>
              <Button href="/services" className="mt-8 bg-white text-slate-950 hover:bg-slate-50">
                See the winners
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Verified stays",
                  text: "Premium properties, boutique villas, and homestays."
                },
                {
                  title: "Guided tours",
                  text: "City tours, heritage walks, and nature adventures."
                },
                {
                  title: "Local transport",
                  text: "Transfers, rentals, boats, and airport pickups."
                },
                {
                  title: "Editorial blog",
                  text: "Stories, guides, and inspiration for travelers."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                  <p className="text-lg font-bold">{item.title}</p>
                  <p className="mt-2 text-sm text-brand-50">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-14 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface p-5 sm:p-6">
            <p className="eyebrow">Inspiration to get you going</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Travel stories with a premium editorial feel
            </h2>
            <p className="mt-3 text-slate-600">
              Use the blog to publish guides, destination tips, and seasonal recommendations.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {storyCards.map((card) => (
              <article key={card.title} className="travel-card">
                <Image src={card.image} alt={card.title} width={700} height={500} className="h-[220px] w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-bold leading-snug text-slate-950">{card.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-14 lg:pb-16">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <p className="eyebrow">Journal</p>
          <h2 className="display-font text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Latest travel stories</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Read destination guides, listing tips, and travel ideas designed to help visitors and hosts make better decisions.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.length ? (
            blogPosts.map((post: any) => (
              <article key={post._id.toString()} className="travel-card p-6">
                <p className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                <h3 className="mt-3 text-xl font-bold">{post.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>
                <Button href={`/blog/${post.slug}`} variant="ghost" className="mt-4 px-0">
                  Read more
                </Button>
              </article>
            ))
          ) : (
            <article className="travel-card p-6 md:col-span-3">
              <h3 className="text-xl font-bold">No published posts yet</h3>
              <p className="mt-2 text-sm text-slate-600">Use the blog section to share destination guides and booking tips.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
