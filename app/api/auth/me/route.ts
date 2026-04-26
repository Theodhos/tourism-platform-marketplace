import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(auth.id).populate("favorites").lean();
  return NextResponse.json({ user });
}
