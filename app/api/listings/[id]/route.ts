import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Listing from "@/models/Listing";

function parseList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseMaybeNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function parseMaybeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const listing = await Listing.findOne({ $or: [{ _id: params.id }, { slug: params.id }] })
      .populate("owner", "name email role")
      .lean();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load listing" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const listing = await Listing.findById(params.id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    if (listing.owner.toString() !== auth.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    listing.title = parseMaybeString(body.title) || listing.title;
    listing.description = parseMaybeString(body.description) || listing.description;
    listing.category = parseMaybeString(body.category) || listing.category;
    listing.subcategory = parseMaybeString(body.subcategory) || listing.subcategory;
    listing.location = parseMaybeString(body.location) || listing.location;
    listing.country = parseMaybeString(body.country) || "";
    listing.address = parseMaybeString(body.address) || "";
    listing.images = Array.isArray(body.images) ? body.images.map((item: unknown) => String(item)).filter(Boolean) : listing.images;
    listing.price = parseMaybeNumber(body.price);
    listing.priceFrom = parseMaybeNumber(body.priceFrom);
    listing.currency = parseMaybeString(body.currency) || listing.currency;
    listing.amenities = parseList(body.amenities);
    listing.tags = parseList(body.tags);
    listing.highlights = parseList(body.highlights);
    listing.contactInfo = {
      phone: parseMaybeString(body.contactPhone) || "",
      email: parseMaybeString(body.contactEmail) || "",
      website: parseMaybeString(body.website) || ""
    };
    listing.socialLinks = {
      instagram: parseMaybeString(body.instagram) || "",
      facebook: parseMaybeString(body.facebook) || "",
      tiktok: parseMaybeString(body.tiktok) || "",
      x: parseMaybeString(body.x) || ""
    };

    if (typeof body.featured === "boolean" && auth.role === "admin") {
      listing.featured = body.featured;
    }

    if (auth.role === "admin" && body.status) {
      listing.status = body.status;
    } else if (auth.role !== "admin") {
      listing.status = "pending";
    }

    await listing.save();
    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 500 });
  }
}
