import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarDays,
  Clock3,
  Globe,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Eye
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";
import ListingActions from "@/components/ListingActions";
import ReviewPanel from "@/components/ReviewPanel";
import Badge from "@/components/ui/Badge";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug, status: "approved" }).lean<any>();
  if (!listing) return {};

  return {
    title: `${listing.title} | Tourism Platform`,
    description: listing.description.slice(0, 160)
  };
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const listing = await Listing.findOne({ slug: params.slug }).populate("owner", "name email role").lean<any>();
  if (!listing) notFound();

  const viewer = await getAuthUser();
  const canEdit = Boolean(viewer && (viewer.role === "admin" || viewer.id === listing.owner?._id?.toString()));
  const isPublic = listing.status === "approved";

  if (!isPublic && !canEdit) notFound();

  await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });

  const heroImage =
    listing.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  const gallery = (listing.images || []).slice(0, 6);

  return (
    <section className="page-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="surface overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image src={heroImage} alt={listing.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <Badge tone={isPublic ? "success" : "warning"}>{listing.status}</Badge>
                {listing.featured ? <Badge tone="success">Featured</Badge> : null}
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-white">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-100">{categoryLabel}</p>
                  <h1 className="display-font mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">{listing.title}</h1>
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {Number(listing.ratingAverage || 0).toFixed(1)} / 5
                </div>
              </div>
            </div>
          </div>

          <div className="surface p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {listing.location}
                {listing.country ? `, ${listing.country}` : ""}
              </span>
              <span className="text-slate-300">•</span>
              <span>{subcategoryLabel}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {listing.views || 0} views
              </span>
            </div>
            <p className="mt-4 whitespace-pre-line text-slate-600">{listing.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rating</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-bold">
                  <Star className="h-4 w-4 text-amber-500" />
                  {Number(listing.ratingAverage || 0).toFixed(1)} ({listing.reviewCount || 0})
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Price</p>
                <p className="mt-2 text-lg font-bold">
                  {listing.currency || "USD"} {listing.priceFrom || listing.price || "N/A"}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trust</p>
                <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified flow
                </p>
              </div>
            </div>
          </div>

          {listing.highlights?.length ? (
            <div className="surface p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-600" />
                <h2 className="text-xl font-bold">Highlights</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.highlights.map((item: string) => (
                  <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {listing.amenities?.length ? (
            <div className="surface p-6">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-brand-600" />
                <h2 className="text-xl font-bold">Amenities</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.amenities.map((amenity: string) => (
                  <Badge key={amenity}>{amenity}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          {gallery.length ? (
            <div className="surface p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Gallery</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">More views from the listing</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {gallery.map((image: string) => (
                  <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                    <Image src={image} alt={listing.title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {isPublic ? (
            <div className="surface p-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-brand-600" />
                <h2 className="text-xl font-bold">Reviews</h2>
              </div>
              <div className="mt-4">
                <ReviewPanel listingId={listing._id.toString()} />
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="surface p-6">
            <p className="eyebrow">Book / contact</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {listing.contactInfo?.email || listing.owner?.email || "No contact listed"}
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {listing.priceFrom ? (
                <div className="rounded-[1.5rem] bg-brand-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-700">From</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {listing.currency || "USD"} {listing.priceFrom}
                  </p>
                </div>
              ) : null}
              {listing.contactInfo?.phone ? (
                <p className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {listing.contactInfo.phone}
                </p>
              ) : null}
              {listing.contactInfo?.email ? (
                <p className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {listing.contactInfo.email}
                </p>
              ) : null}
              {listing.contactInfo?.website ? (
                <a href={listing.contactInfo.website} className="block text-brand-700 hover:underline" target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {canEdit ? (
                <Link
                  href={`/listings/${listing.slug}/edit`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  <PencilLine className="h-4 w-4" />
                  Edit
                </Link>
              ) : null}
              {isPublic ? <ListingActions listingId={listing._id.toString()} /> : null}
            </div>
          </div>

          {listing.socialLinks ? (
            <div className="surface p-6">
              <p className="eyebrow">Social links</p>
              <div className="mt-3 space-y-2 text-sm">
                {listing.socialLinks.instagram ? (
                  <a href={listing.socialLinks.instagram} target="_blank" rel="noreferrer" className="block text-brand-700 hover:underline">
                    Instagram
                  </a>
                ) : null}
                {listing.socialLinks.facebook ? (
                  <a href={listing.socialLinks.facebook} target="_blank" rel="noreferrer" className="block text-brand-700 hover:underline">
                    Facebook
                  </a>
                ) : null}
                {listing.socialLinks.tiktok ? (
                  <a href={listing.socialLinks.tiktok} target="_blank" rel="noreferrer" className="block text-brand-700 hover:underline">
                    TikTok
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="surface p-6">
            <p className="eyebrow">Location map</p>
            <iframe
              title="Location map"
              className="mt-4 h-72 w-full rounded-[1.5rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(listing.location)}&output=embed`}
            />
          </div>

          <div className="surface p-6">
            <p className="eyebrow">Administrative note</p>
            <p className="mt-2 text-sm text-slate-600">
              Listings are shown publicly only after approval. Edits from owners will send the listing back through review if needed.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-800">
              <Clock3 className="h-4 w-4" />
              Real-time moderation
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
