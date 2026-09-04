import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      originalPrice: true,
      stock: true,
      category: true,
      condition: true,
      imageUrl: true,
      imageUrls: true,
      specifications: true,
      technicalSpecifications: true,
      nonTechnicalSpecifications: true,
      showTechnicalSpecifications: true,
      showNonTechnicalSpecifications: true,
      discountBadge: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}
