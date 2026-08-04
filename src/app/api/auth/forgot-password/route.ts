import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number, resetTime: number, totalCount: number, totalResetTime: number, blockUntil: number }>();
const MAX_REQUESTS = 2; // 2 requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute
const BLOCK_THRESHOLD = 15; // 15 requests within 15 minutes triggers block
const CONTINUOUS_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
  try {
    // Get IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    
    let limitData = rateLimit.get(ip);
    
    if (!limitData) {
      limitData = { count: 1, resetTime: now + WINDOW_MS, totalCount: 1, totalResetTime: now + CONTINUOUS_WINDOW_MS, blockUntil: 0 };
      rateLimit.set(ip, limitData);
    } else {
      // Check if blocked
      if (limitData.blockUntil > now) {
        return NextResponse.json(
          { error: "Too many attempts. Your IP has been temporarily blocked for 24 hours." },
          { status: 429 }
        );
      }
      
      // Update continuous window
      if (now > limitData.totalResetTime) {
        limitData.totalCount = 1;
        limitData.totalResetTime = now + CONTINUOUS_WINDOW_MS;
      } else {
        limitData.totalCount += 1;
        if (limitData.totalCount >= BLOCK_THRESHOLD) {
          limitData.blockUntil = now + BLOCK_DURATION_MS;
          return NextResponse.json(
            { error: "Too many attempts. Your IP has been blocked for 24 hours." },
            { status: 429 }
          );
        }
      }

      // Update per-minute window
      if (now > limitData.resetTime) {
        limitData.count = 1;
        limitData.resetTime = now + WINDOW_MS;
      } else {
        limitData.count += 1;
        if (limitData.count > MAX_REQUESTS) {
          return NextResponse.json(
            { error: "Too many requests. Please try again in a minute." },
            { status: 429 }
          );
        }
      }
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ message: "If that email is registered, we have sent a reset link." });
    }

    // Generate random string for token (we could also use crypto for better randomness)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiration

    // Delete any existing tokens for this email to prevent spam
    await (prisma as any).passwordResetToken.deleteMany({
      where: { email },
    });

    // Save token to DB
    await (prisma as any).passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // Send email via nodemailer (using Ethereal dummy transport)
    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ message: "If that email is registered, we have sent a reset link." });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
