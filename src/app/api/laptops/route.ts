import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const laptops = await prisma.laptop.findMany({
    where: { orderId: null },
    select: { id: true, brandName: true, price: true, quantity: true },
  });
  return NextResponse.json(laptops);
}
