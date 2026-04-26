import AuthForm from "@/components/forms/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="page-shell flex min-h-[70vh] items-center py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="surface-strong p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-100">Welcome back</p>
          <h1 className="display-font mt-4 text-4xl font-black leading-tight">
            Sign in to manage listings, favorites, and reviews.
          </h1>
          <p className="mt-4 text-slate-300">
            Travelers and hosts get one secure account with role-based access for admins.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Saved trips", "Moderation tools", "Reviews", "Listing management"].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface p-8">
          <h2 className="text-2xl font-bold text-slate-950">Login</h2>
          <div className="mt-6">
            <AuthForm mode="login" />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-brand-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
