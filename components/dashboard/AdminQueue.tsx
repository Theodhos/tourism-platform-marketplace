"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function AdminQueue({ listings }: { listings: any[] }) {
  const router = useRouter();

  async function action(id: string, endpoint: "approve" | "reject") {
    const response = await fetch(`/api/listings/${id}/${endpoint}`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Action failed");
      return;
    }
    toast.success(endpoint === "approve" ? "Listing approved" : "Listing rejected");
    router.refresh();
  }

  if (!listings.length) {
    return <p className="text-sm text-slate-500">No pending listings right now.</p>;
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div key={listing._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-lg font-bold text-slate-950">{listing.title}</p>
              <p className="text-sm text-slate-500">{listing.location}</p>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">{listing.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                <span className="rounded-full bg-brand-50 px-3 py-1">{listing.category}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{listing.subcategory}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => action(listing._id, "approve")}>Approve</Button>
              <Button variant="danger" onClick={() => action(listing._id, "reject")}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
