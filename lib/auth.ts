import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "@/models/User";

export const AUTH_COOKIE = "tourism_token";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export function signToken(payload: AuthUser) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
}

export function setAuthCookie(token: string) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getAuthUser() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const auth = await getAuthUser();
  if (!auth) return null;
  await connectDB();
  return User.findById(auth.id).lean();
}

export async function requireAuth() {
  const auth = await getAuthUser();
  if (!auth) return null;
  await connectDB();
  return auth;
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if (!auth || auth.role !== "admin") return null;
  return auth;
}
