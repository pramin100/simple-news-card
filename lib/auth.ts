import crypto from "crypto";
import { cookies } from "next/headers";
import { findUserByUsername } from "./db";

const SESSION_SECRET = process.env.SESSION_SECRET || "simple-news-card-jwt-secret-token-key-2026";
export const COOKIE_NAME = "snc_session_token";

export interface SessionPayload {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function sign(payloadStr: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("base64url");
}

export function createSessionToken(user: { id: string; username: string; fullName: string; role: string }): string {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadStr);
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSig = sign(encodedPayload);
    if (expectedSig !== signature) return null;

    const payloadStr = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadStr) as SessionPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = await findUserByUsername(payload.username);
  if (!user) return null;

  const { passwordHash: _, salt: __, ...safeUser } = user;
  return safeUser;
}
