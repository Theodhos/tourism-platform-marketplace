import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, UserRound } from "lucide-react";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).lean<any>();
  if (!post) return {};

  return {
    title: `${post.title} | Tourism Platform`,
    description: post.excerpt.slice(0, 160)
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).populate("author", "name").lean<any>();
  if (!post) notFound();

  const image =
    post.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="page-shell py-10">
      <div className="mx-auto max-w-4xl">
        <div className="surface overflow-hidden">
          <div className="relative aspect-[16/7]">
            <Image src={image} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              {post.author?.name || "Editorial Team"}
            </span>
          </div>
          <h1 className="display-font mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>
          <div className="surface mt-8 p-6">
            <p className="whitespace-pre-line leading-8 text-slate-700">{post.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
