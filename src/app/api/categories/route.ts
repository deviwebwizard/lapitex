import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const defaultCategories = [
  {
    name: "Laptops",
    slug: "Laptops",
    children: ["H.P", "Dell", "Asus", "Macbook", "Lenovo", "Samsung", "Toshiba"],
  },
  {
    name: "Desktops",
    slug: "Desktops",
    children: ["H.P", "Dell", "Intel", "Zebronics", "Gigabyte", "Ivoomi", "frontech", "zebion"],
  },
  {
    name: "Parts & Upgrades",
    slug: "Parts",
    children: ["Keyboard", "Mouse", "Screen", "SSD", "RAM", "SMPS", "ATX", "Graphics card"],
  },
] as const;

async function ensureDefaultCategories() {
  const count = await (prisma as any).category.count();
  if (count > 0) return;

  for (const root of defaultCategories) {
    const parent = await (prisma as any).category.upsert({
      where: { slug: root.slug },
      update: { name: root.name, parentId: null },
      create: { name: root.name, slug: root.slug },
    });

    for (const name of root.children) {
      await (prisma as any).category.upsert({
        where: { slug: `${root.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
        update: { name, parentId: parent.id },
        create: {
          name,
          slug: `${root.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          parentId: parent.id,
        },
      });
    }
  }
}

export async function GET() {
  try {
    await ensureDefaultCategories();
    const categories = await (prisma as any).category.findMany({
      include: {
        children: {
          include: {
            children: true, // go 3 levels deep if needed
          }
        }
      },
      where: {
        parentId: null, // Only fetch top-level categories first
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, slug, parentId } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const category = await (prisma as any).category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
