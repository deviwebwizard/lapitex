import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment details" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    const expectedSignature = Buffer.from(digest, "hex");
    const receivedSignature = Buffer.from(razorpay_signature, "hex");
    if (expectedSignature.length !== receivedSignature.length ||
        !crypto.timingSafeEqual(expectedSignature, receivedSignature)) {
      return NextResponse.json({ error: "Transaction is not legit!" }, { status: 400 });
    }

    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    let calculatedSubTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) continue;
      
      const price = dbProduct.price;
      calculatedSubTotal += price * item.quantity;
      
      orderItemsData.push({
        productId: item.id,
        quantity: item.quantity,
        price: price
      });
    }

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
        status: "PENDING", // Order status
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
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
    console.error("Razorpay verify error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
