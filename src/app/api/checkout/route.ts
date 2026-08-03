import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // Optionally reduce stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}
