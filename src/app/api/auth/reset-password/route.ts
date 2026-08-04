import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Find token in database
    const resetToken = await (prisma as any).passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    if (resetToken.expires < new Date()) {
      // Token expired, delete it
      await (prisma as any).passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 });
    }

    // Since the system currently uses plaintext passwords (per auth.ts), we update it directly.
    // NOTE: In production, passwords should ALWAYS be hashed using bcrypt or similar.
    await prisma.user.update({
      where: { email: resetToken.email },
      data: {
        password: password,
      },
    });

    // Delete token after successful password reset
    await (prisma as any).passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
