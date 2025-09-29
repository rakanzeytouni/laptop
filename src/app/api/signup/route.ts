"use server";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;
    if (!name || !email || !password ||!confirmPassword ) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
