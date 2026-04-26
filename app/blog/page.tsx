import Link from "next/link";
import Image from "next/image";
import { BookOpenText, Compass, WandSparkles } from "lucide-react";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await connectDB();
  const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).populate("author", "name").lean<any>();
  const heroPost = posts[0];

  return (
    <section className="page-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="surface overflow-hidden">
          <div className="relative min-h-[360px]">
            <Image
              src={
                heroPost?.coverImage ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
              }
              alt="Travel stories"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
              <p className="eyebrow text-brand-100">Blog</p>
              <h1 className="display-font mt-2 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                Travel insights and destination stories
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
                Discover guides, insider tips, and curated stories that help travelers plan better and help hosts market smarter.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: BookOpenText, label: "Guides", value: "Practical" },
            { icon: Compass, label: "Destinations", value: "Curated" },
            { icon: WandSparkles, label: "Ideas", value: "Fresh" }
          ].map((item) => (
            <div key={item.label} className="surface p-5">
              <item.icon className="h-5 w-5 text-brand-600" />
              <p className="mt-4 text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.length ? (
          posts.map((post: any) => (
            <article key={post._id.toString()} className="travel-card bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={
                    post.coverImage ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                <h2 className="mt-3 text-2xl font-bold">{post.title}</h2>
                <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                  Read article
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="surface p-8 text-sm text-slate-500 md:col-span-2 xl:col-span-3">No blog posts yet.</div>
        )}
      </div>
    </section>
  );
}
