import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="page-shell flex min-h-[70vh] items-center py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="surface-strong p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-100">Join the marketplace</p>
          <h1 className="display-font mt-4 text-4xl font-black leading-tight">
            Create an account to list your tourism service.
          </h1>
          <p className="mt-4 text-slate-300">
            Registering lets you submit listings, save favorites, and leave reviews across the platform.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Submit listings", "Bookmark ideas", "Leave reviews", "Track approvals"].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface p-8">
          <h2 className="text-2xl font-bold text-slate-950">Register</h2>
          <div className="mt-6">
            <AuthForm mode="register" />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
