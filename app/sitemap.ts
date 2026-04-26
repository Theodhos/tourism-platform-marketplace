import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/register`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/dashboard`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/admin/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/listings/add`, changeFrequency: "monthly", priority: 0.5 }
  ];
}
