import prisma from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orderItems: true, views: true, cartItems: true }
      }
    }
  });

  return <ProductsClient initialProducts={products} />;
}
