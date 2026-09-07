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

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
    },
    orderBy: { name: 'asc' }
  });

  return <ProductsClient initialProducts={products} categories={categories} />;
}
