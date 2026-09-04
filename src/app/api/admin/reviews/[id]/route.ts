import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const review = await prisma.review.update({
      where: { id },
      data: { isTopReview: Boolean(body.isTopReview) },
    });
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}
