import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function getAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") return null;
  return session.user.id;
}

export async function POST(request: Request) {
  const userId = await getAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const deviceKey = typeof body.deviceKey === "string" ? body.deviceKey.slice(0, 120) : "unknown-device";
  try {
    const session = await prisma.adminSession.create({
      data: { userId, deviceKey, userAgent: request.headers.get("user-agent")?.slice(0, 500) || null },
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("[ADMIN_SESSION_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Session tracking is unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const userId = await getAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.sessionId !== "string") return NextResponse.json({ error: "Session ID is required" }, { status: 400 });

  try {
    await prisma.adminSession.updateMany({
      where: { id: body.sessionId, userId, logoutAt: null },
      data: { lastSeenAt: new Date() },
    });
  } catch (error) {
    console.error("[ADMIN_SESSION_HEARTBEAT_ERROR]", error);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const userId = await getAdmin();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.sessionId !== "string") return NextResponse.json({ error: "Session ID is required" }, { status: 400 });

  try {
    await prisma.adminSession.updateMany({
      where: { id: body.sessionId, userId, logoutAt: null },
      data: { logoutAt: new Date(), lastSeenAt: new Date() },
    });
  } catch (error) {
    console.error("[ADMIN_SESSION_LOGOUT_ERROR]", error);
  }
  return NextResponse.json({ success: true });
}
