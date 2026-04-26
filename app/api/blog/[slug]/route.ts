import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug: params.slug, published: true }).populate("author", "name").lean();
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load blog post" }, { status: 500 });
  }
}
