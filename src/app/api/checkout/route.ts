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

    const { items, paymentMethod } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    // Fetch real product prices from DB
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const typedProducts = dbProducts as Array<{ id: string; stock: number; name: string; price: number }>;
    const productMap = new Map(typedProducts.map(product => [product.id, product]));

    let calculatedSubTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 404 });
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${dbProduct.name}` }, { status: 400 });
      }
      
      const price = dbProduct.price;
      calculatedSubTotal += price * item.quantity;
      
      orderItemsData.push({
        productId: item.id,
        quantity: item.quantity,
        price: price
      });
    }

    // Fetch shipping fee
    const shippingSetting = await prisma.siteSetting.findUnique({
      where: { key: "SHIPPING_FEE" }
    });
    const shippingFee = shippingSetting ? Number(shippingSetting.value) || 0 : 0;
    
    const calculatedTotal = calculatedSubTotal + shippingFee;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total: calculatedTotal,
        status: "PENDING",
        paymentMethod: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
        paymentStatus: "PENDING",
        orderItems: {
          create: orderItemsData
        }
      }
    });

    // Reduce stock
    for (const item of orderItemsData) {
      await prisma.product.update({
        where: { id: item.productId },
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
