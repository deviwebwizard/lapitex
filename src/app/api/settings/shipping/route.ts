import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const shippingSetting = await prisma.siteSetting.findUnique({
      where: { key: "SHIPPING_FEE" }
    });
    
    const shippingFee = shippingSetting ? Number(shippingSetting.value) || 0 : 0;

    return NextResponse.json({ shippingFee });
  } catch (error) {
    console.error("Error fetching shipping settings:", error);
    return NextResponse.json({ shippingFee: 0 }); // Fallback
  }
}
