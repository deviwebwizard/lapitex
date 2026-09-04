import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        category: body.category,
        condition: body.condition,
        stock: parseInt(body.stock),
        imageUrl: body.imageUrl,
        imageUrls: Array.isArray(body.imageUrls) ? JSON.stringify(body.imageUrls.slice(0, 5).filter((url: unknown): url is string => typeof url === "string" && url.trim().length > 0)) : null,
        discountBadge: body.discountBadge || null,
        isFeatured: body.isFeatured === true,
        specifications: typeof body.specifications === "string" ? body.specifications : null,
        technicalSpecifications: typeof body.technicalSpecifications === "string" ? body.technicalSpecifications : null,
        nonTechnicalSpecifications: body.nonTechnicalSpecifications || null,
        showTechnicalSpecifications: body.showTechnicalSpecifications !== false,
        showNonTechnicalSpecifications: body.showNonTechnicalSpecifications !== false,
        warrantyMonths: body.warrantyMonths === "" || body.warrantyMonths == null ? null : parseInt(body.warrantyMonths, 10),
        warrantyDetails: body.warrantyDetails || null,
        coveredItems: typeof body.coveredItems === "string" ? body.coveredItems : null,
        supportDetails: body.supportDetails || null,
        overviewQualityTitle: body.overviewQualityTitle || null,
        overviewQualityText: body.overviewQualityText || null,
        overviewReplacementTitle: body.overviewReplacementTitle || null,
        overviewReplacementText: body.overviewReplacementText || null,
        reviews: body.reviews || null,
        deliveryFee: body.deliveryFee === "" || body.deliveryFee == null ? null : parseFloat(body.deliveryFee),
        deliveryDays: body.deliveryDays || null
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
