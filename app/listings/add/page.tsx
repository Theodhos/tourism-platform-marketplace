import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ListingForm from "@/components/forms/ListingForm";

export const dynamic = "force-dynamic";

export default async function AddListingPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  return (
    <section className="page-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-6">
          <p className="eyebrow">Submit listing</p>
          <h1 className="display-font mt-3 text-4xl font-black tracking-tight text-slate-950">Add a new travel service</h1>
          <p className="mt-4 text-slate-600">
            Listings start in pending status so the admin team can review and approve quality submissions before they go live.
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Pro tip</p>
            <p className="mt-3 text-lg font-bold">Use strong images, clear categories, and direct contact details to improve approvals.</p>
          </div>
        </div>
        <div className="surface p-6">
          <ListingForm />
        </div>
      </div>
    </section>
  );
}
