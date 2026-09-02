import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: true, message: "Not logged in, skipping track" });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { action, productId, cartItems } = body as {
      action?: string;
      productId?: string;
      cartItems?: Array<{ id: string; quantity: number }>;
    };

    // Always update lastOnline
    await prisma.user.update({
      where: { id: userId },
      data: { lastOnline: new Date() }
    });

    if (action === "VIEW_PRODUCT" && productId) {
      await prisma.productView.create({
        data: {
          userId,
          productId
        }
      });
    } else if (action === "SYNC_CART" && Array.isArray(cartItems)) {
      // First delete all existing cart items for this user
      await prisma.cartItem.deleteMany({
        where: { userId }
      });
      
      // Then insert the new ones
      if (cartItems.length > 0) {
        await prisma.cartItem.createMany({
          data: cartItems.map(item => ({
            userId,
            productId: item.id,
            quantity: item.quantity
          }))
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ error: "Failed to track user activity" }, { status: 500 });
  }
}
