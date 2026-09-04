import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductAdminDetailClient from "./ProductAdminDetailClient";

export const dynamic = "force-dynamic";

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, shipping] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.siteSetting.findUnique({ where: { key: "SHIPPING_FEE" } }),
  ]);
  if (!product) notFound();
  const siteShippingFee = shipping ? Number(shipping.value) || 0 : 0;
  return <ProductAdminDetailClient product={product} siteShippingFee={siteShippingFee} />;
}
