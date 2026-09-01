import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { randomBytes } from "node:crypto";
import { isPasswordResetRateLimited } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (await isPasswordResetRateLimited(req, email)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ message: "If that email is registered, we have sent a reset link." });
    }

    const token = randomBytes(32).toString("hex");
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
