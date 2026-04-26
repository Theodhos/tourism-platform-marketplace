import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
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
  const favorites = Array.isArray(user?.favorites) ? user.favorites.filter(Boolean) : [];
  const approved = listings.filter((listing: any) => listing.status === "approved").length;
  const pending = listings.filter((listing: any) => listing.status === "pending").length;

  return (
    <section className="page-shell py-10">
      <div className="surface overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Your area</p>
            <h1 className="display-font mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              User dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Manage listings, track approvals, and keep an eye on your saved travel ideas in a cleaner, more editorial layout.
            </p>
          </div>
          <Button href="/listings/add">Add Listing</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <p className="eyebrow">Listings</p>
          <h2 className="text-2xl font-black">Your services</h2>
        </div>
        <UserListingTable listings={listings} />
      </div>

      <div className="mt-12">
        <div className="mb-4">
          <p className="eyebrow">Favorites</p>
          <h2 className="text-2xl font-black">Saved listings</h2>
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
