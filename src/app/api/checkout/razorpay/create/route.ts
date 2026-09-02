import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const typedProducts = dbProducts as Array<{ id: string; stock: number; name: string; price: number }>;
    const productMap = new Map(typedProducts.map(product => [product.id, product]));

    let calculatedSubTotal = 0;

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
    }

    const shippingSetting = await prisma.siteSetting.findUnique({
      where: { key: "SHIPPING_FEE" }
    });
    const shippingFee = shippingSetting ? Number(shippingSetting.value) || 0 : 0;
    
    const calculatedTotal = calculatedSubTotal + shippingFee;

    // Razorpay requires amount in smallest currency unit (paise for INR)
    const options = {
      amount: calculatedTotal * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      amount: order.amount,
      currency: order.currency 
    });
  } catch (error: any) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
