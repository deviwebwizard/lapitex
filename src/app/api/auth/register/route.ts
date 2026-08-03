import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Create the new user
    // Note: We are storing plain text passwords to match the existing login logic
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password,
        role: "CUSTOMER", // Default role
      },
    });

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
