import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, CheckCircle2, Clock3, Flame, LayoutDashboard, PlusCircle, ShieldCheck, Users } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import Review from "@/models/Review";
import BlogPost from "@/models/BlogPost";
import Activity from "@/models/Activity";
import AdminQueue from "@/components/dashboard/AdminQueue";
import BlogStudio from "@/components/dashboard/BlogStudio";

export const dynamic = "force-dynamic";

function formatDate(value?: string | Date) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const activityStyles: Record<string, { label: string; tone: string }> = {
  user_registered: { label: "User joined", tone: "bg-blue-50 text-blue-700" },
  user_logged_in: { label: "Login", tone: "bg-slate-100 text-slate-700" },
  listing_submitted: { label: "Submission", tone: "bg-amber-50 text-amber-700" },
  listing_approved: { label: "Approved", tone: "bg-emerald-50 text-emerald-700" },
  listing_rejected: { label: "Rejected", tone: "bg-rose-50 text-rose-700" },
  review_created: { label: "Review", tone: "bg-brand-50 text-brand-700" },
  blog_created: { label: "Blog", tone: "bg-violet-50 text-violet-700" }
};

export default async function AdminPage() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") redirect("/login");

  await connectDB();

  const [
    totalUsers,
    totalListings,
    pendingListings,
    approvedListings,
    rejectedListings,
    totalReviews,
    totalBlogs,
    featuredListings,
    recentBlogs,
    recentQueue,
    recentUsers,
    recentListings,
    recentReviews,
    recentActivities,
    favoriteStats
  ] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ status: "pending" }),
    Listing.countDocuments({ status: "approved" }),
    Listing.countDocuments({ status: "rejected" }),
    Review.countDocuments(),
    BlogPost.countDocuments(),
    Listing.countDocuments({ status: "approved", featured: true }),
    BlogPost.find().sort({ createdAt: -1 }).limit(5).populate("author", "name").lean<any>(),
    Listing.find({ status: "pending" }).sort({ createdAt: -1 }).limit(8).lean<any>(),
    User.find().sort({ createdAt: -1 }).limit(6).lean<any>(),
    Listing.find().sort({ createdAt: -1 }).limit(6).populate("owner", "name email role").lean<any>(),
    Review.find().sort({ createdAt: -1 }).limit(6).populate("user", "name").populate("listing", "title slug").lean<any>(),
    Activity.find().sort({ createdAt: -1 }).limit(10).lean<any>(),
    User.aggregate([
      {
        $project: {
          count: { $size: { $ifNull: ["$favorites", []] } }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }
        }
      }
    ])
  ]);

  const totalFavorites = favoriteStats[0]?.total || 0;
  const approvalRate = totalListings ? Math.round((approvedListings / totalListings) * 100) : 0;
  const displayName = auth.name || auth.email;

  return (
    <section className="page-shell py-8 sm:py-10">
      <div className="surface-strong overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-100">Administrator console</p>
            <h1 className="display-font mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Control the tourism marketplace from one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-50 sm:text-base">
              Monitor activity, review pending services, approve or reject listings, and keep every public result high quality.
            </p>
          </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/listings/add"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              Add listing
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              View services
            </Link>
            <Link
              href="#blog-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              Blog studio
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
          <span className="rounded-full bg-white/10 px-3 py-2">Logged in as {displayName}</span>
          <span className="rounded-full bg-white/10 px-3 py-2">{auth.email}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Users, label: "Users", value: totalUsers, accent: "bg-blue-50 text-blue-700" },
          { icon: ShieldCheck, label: "Listings", value: totalListings, accent: "bg-brand-50 text-brand-700" },
          { icon: Clock3, label: "Pending", value: pendingListings, accent: "bg-amber-50 text-amber-700" },
          { icon: CheckCircle2, label: "Approved", value: approvedListings, accent: "bg-emerald-50 text-emerald-700" },
          { icon: Flame, label: "Featured", value: featuredListings, accent: "bg-fuchsia-50 text-fuchsia-700" },
          { icon: BarChart3, label: "Reviews", value: totalReviews, accent: "bg-slate-100 text-slate-700" },
          { icon: LayoutDashboard, label: "Blogs", value: totalBlogs, accent: "bg-violet-50 text-violet-700" },
          { icon: Users, label: "Favorites", value: totalFavorites, accent: "bg-cyan-50 text-cyan-700" }
        ].map((item) => (
          <div key={item.label} className="surface p-5">
            <item.icon className={`h-5 w-5 rounded-xl p-2 ${item.accent}`} />
            <p className="mt-4 text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Pending moderation</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Review queue</h2>
            </div>
            <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              Approval rate {approvalRate}%
            </div>
          </div>
          <div className="mt-6">
            <AdminQueue listings={recentQueue} />
          </div>
        </div>

        <div className="surface p-6">
          <p className="eyebrow">Activity feed</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Platform activity</h2>
          <div className="mt-6 space-y-3">
            {recentActivities.length ? (
              recentActivities.map((activity: any) => {
                const style = activityStyles[activity.type] || activityStyles.user_logged_in;
                return (
                  <div key={activity._id.toString()} className="rounded-[1.5rem] border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.tone}`}>{style.label}</span>
                        <p className="mt-2 font-semibold text-slate-950">{activity.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                      </div>
                      <p className="text-xs text-slate-400">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <BlogStudio recentPosts={recentBlogs as any[]} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-6">
          <p className="eyebrow">Recent users</p>
          <div className="mt-5 space-y-3">
            {recentUsers.map((user: any) => (
              <div key={user._id.toString()} className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-950">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <p className="eyebrow">Recent services</p>
          <div className="mt-5 space-y-3">
            {recentListings.map((listing: any) => (
              <div key={listing._id.toString()} className="flex items-start justify-between rounded-[1.5rem] bg-slate-50 p-4">
                <div>
                  <Link href={`/listings/${listing.slug}`} className="font-semibold text-slate-950 hover:text-brand-700">
                    {listing.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {listing.location}
                    {listing.owner?.name ? ` • ${listing.owner.name}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {listing.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 surface p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Latest reviews</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">What users are saying</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {recentReviews.length ? (
            recentReviews.map((review: any) => (
              <div key={review._id.toString()} className="rounded-[1.5rem] border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{review.user?.name || "Anonymous"}</p>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {review.rating}/5
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                  {review.listing?.title || "Unknown listing"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
