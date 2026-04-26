import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import BlogPost from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await connectDB();

  const listings = await Listing.find({ status: "approved" }).select("slug updatedAt").lean();
  const posts = await BlogPost.find({ published: true }).select("slug updatedAt").lean();

  return [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...listings.map((listing) => ({
      url: `${baseUrl}/listings/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6
    }))
  ];
}
