import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function currentUser() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string; role?: string } | undefined)?.id;
  return userId ? { userId, role: (session?.user as { role?: string })?.role } : null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ eligible: false }, { status: 401 });
  const { id: productId } = await params;
  const purchased = await prisma.orderItem.findFirst({ where: { productId, order: { userId: user.userId, status: "DELIVERED" } }, select: { id: true } });
  const existing = await prisma.review.findUnique({ where: { productId_userId: { productId, userId: user.userId } }, select: { id: true } });
  return NextResponse.json({ eligible: Boolean(purchased), alreadyReviewed: Boolean(existing) });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to review this product." }, { status: 401 });
  if (user.role === "ADMIN") return NextResponse.json({ error: "Only customers can submit reviews." }, { status: 403 });
  const { id: productId } = await params;
  const purchased = await prisma.orderItem.findFirst({ where: { productId, order: { userId: user.userId, status: "DELIVERED" } }, select: { id: true } });
  if (!purchased) return NextResponse.json({ error: "Reviews are available after a delivered purchase." }, { status: 403 });
  const body = await request.json();
  const rating = Number(body.rating);
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : null;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || content.length < 3 || content.length > 2000) return NextResponse.json({ error: "Please provide a rating and a review between 3 and 2000 characters." }, { status: 400 });
  try {
    const review = await prisma.review.create({ data: { productId, userId: user.userId, rating, title: title || null, content }, include: { user: { select: { name: true } } } });
    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
  }
}
