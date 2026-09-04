import { NextResponse } from "next/server";
import {
  COOKIE_CONSENT_COOKIE,
  COOKIE_CONSENT_MAX_AGE,
  isCookieConsent,
} from "@/lib/cookieConsent";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const status = (body as { status?: unknown } | null)?.status;
  if (typeof status !== "string" || !isCookieConsent(status)) {
    return NextResponse.json({ error: "Invalid cookie consent value" }, { status: 400 });
  }

  const response = NextResponse.json({ status }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set({
    name: COOKIE_CONSENT_COOKIE,
    value: status,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_CONSENT_MAX_AGE,
  });

  return response;
}
