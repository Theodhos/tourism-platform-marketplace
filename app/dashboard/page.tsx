import { redirect } from "next/navigation";
import { CalendarDays, Clock3, Heart, MessageSquareText, ShieldCheck, Star, User2 } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Review from "@/models/Review";
import Activity from "@/models/Activity";
import UserListingTable from "@/components/dashboard/UserListingTable";
import Button from "@/components/ui/Button";
import ListingCard from "@/components/ListingCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  await connectDB();
  const listings = await Listing.find({ owner: auth.id }).sort({ createdAt: -1 }).lean<any>();
  const user = await User.findById(auth.id).populate("favorites").lean<any>();
  const reviews = await Review.find({ user: auth.id }).sort({ createdAt: -1 }).populate("listing", "title slug images location country category subcategory ratingAverage reviewCount").lean<any>();
  const activities = await Activity.find({ actor: auth.id }).sort({ createdAt: -1 }).limit(8).lean<any>();
  const favorites = Array.isArray(user?.favorites) ? user.favorites.filter(Boolean) : [];
  const approved = listings.filter((listing: any) => listing.status === "approved").length;
  const pending = listings.filter((listing: any) => listing.status === "pending").length;
  const rejected = listings.filter((listing: any) => listing.status === "rejected").length;
  const totalReviews = reviews.length;
  const totalFavorites = favorites.length;
  const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "";

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="surface overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Your area</p>
            <h1 className="display-font mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Personal dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Your listings, favorites, reviews, and platform activity in one place. Everything you do on the platform is surfaced here clearly.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/listings/add">Add Listing</Button>
            <Button href="/services" variant="ghost">
              Explore services
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Account", value: auth.name, icon: User2 },
            { label: "Member since", value: joinedAt || "Now", icon: CalendarDays },
            { label: "Email", value: auth.email, icon: MessageSquareText },
            { label: "Role", value: auth.role, icon: ShieldCheck }
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <item.icon className="h-5 w-5 text-brand-600" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              <p className="mt-1 break-words text-sm font-bold text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Total listings</p>
          <p className="mt-2 text-3xl font-black">{listings.length}</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Pending approval</p>
          <p className="mt-2 text-3xl font-black">{pending}</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-2 text-3xl font-black">{approved}</p>
        </div>
        <div className="surface p-6">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-2 text-3xl font-black">{rejected}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Listings</p>
              <h2 className="text-2xl font-black text-slate-950">Your services</h2>
            </div>
            <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              {listings.length} total
            </div>
          </div>
          <div className="mt-6">
            <UserListingTable listings={listings} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface p-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-brand-600" />
              <div>
                <p className="eyebrow">Favorites</p>
                <h2 className="text-2xl font-black text-slate-950">Saved listings</h2>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Your saved experiences and places you want to revisit.</p>
            <div className="mt-4 grid gap-4">
              {favorites.length ? (
                favorites.map((listing: any) => (
                  <div key={listing._id.toString()} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-950">{listing.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {listing.location}
                      {listing.country ? `, ${listing.country}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No favorites saved yet.</p>
              )}
            </div>
          </div>

          <div className="surface p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-brand-600" />
              <div>
                <p className="eyebrow">Your reviews</p>
                <h2 className="text-2xl font-black text-slate-950">Feedback you posted</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {reviews.length ? (
                reviews.map((review: any) => (
                  <div key={review._id.toString()} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950">{review.listing?.title || "Unknown listing"}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700">{review.rating}/5</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No reviews posted yet.</p>
              )}
            </div>
          </div>

          <div className="surface p-6">
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-brand-600" />
              <div>
                <p className="eyebrow">Recent activity</p>
                <h2 className="text-2xl font-black text-slate-950">What you did lately</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {activities.length ? (
                activities.map((activity: any) => (
                  <div key={activity._id.toString()} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">{activity.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No activity yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4">
          <p className="eyebrow">Saved cards</p>
          <h2 className="text-2xl font-black text-slate-950">Favorite listings in card view</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.length ? (
            favorites.map((listing: any) => <ListingCard key={listing._id.toString()} listing={listing} />)
          ) : (
            <div className="surface p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-3">No favorites saved yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
