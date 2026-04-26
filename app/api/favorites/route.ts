import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";
import Listing from "@/models/Listing";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(auth.id).populate("favorites").lean<any>();
    return NextResponse.json({ favorites: Array.isArray(user?.favorites) ? user.favorites : [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { listingId } = await request.json();
    await connectDB();
    const user = await User.findById(auth.id);
    const listing = await Listing.findById(listingId);
    if (!user || !listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const favorites = user.favorites as any[];
    const existing = favorites.some((favorite: any) => favorite.toString() === listingId);
    if (existing) {
      user.favorites = favorites.filter((favorite: any) => favorite.toString() !== listingId);
    } else {
      favorites.push(listingId);
      user.favorites = favorites;
    }

    await user.save();
    return NextResponse.json({ ok: true, favorited: !existing });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update favorites" }, { status: 500 });
  }
}
