import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany();
    
    // Convert array to object { key: value }
    const typedSettings = settings as Array<{ key: string; value: string }>;
    const settingsObj: Record<string, unknown> = {};
    for (const setting of typedSettings) {
      try {
        settingsObj[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsObj[setting.key] = setting.value;
      }
    }

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
    }

    const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: valueString },
      create: { key, value: valueString },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Update setting error:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
