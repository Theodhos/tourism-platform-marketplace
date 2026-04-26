import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";

export default function ListingCard({ listing }: { listing: any }) {
  const image = listing.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Image src={image} alt={listing.title} fill className="object-cover" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/40 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {listing.featured ? <Badge tone="success">Featured</Badge> : null}
          {listing.priceFrom ? <Badge tone="info">{listing.currency || "USD"} {listing.priceFrom}+</Badge> : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <Badge className="bg-white/90 text-slate-800 backdrop-blur">{categoryLabel}</Badge>
          <div className="rounded-full bg-slate-950/75 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
            {Number(listing.ratingAverage || 0).toFixed(1)} <span className="text-slate-300">/ 5</span>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div>
            <Link href={`/listings/${listing.slug}`} className="text-xl font-black leading-tight text-slate-950 hover:text-brand-700">
              {listing.title}
            </Link>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>
                {listing.location}
                {listing.country ? `, ${listing.country}` : ""}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          {subcategoryLabel ? <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{subcategoryLabel}</span> : null}
          {listing.status && listing.status !== "approved" ? (
            <Badge tone={listing.status === "rejected" ? "danger" : "warning"}>{listing.status}</Badge>
          ) : null}
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{listing.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-amber-600">
              <Star className="h-4 w-4 fill-current" />
              {Number(listing.ratingAverage || 0).toFixed(1)}
            </span>
            <span className="text-slate-500">{listing.reviewCount || 0} reviews</span>
          </div>
          <Link href={`/listings/${listing.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
