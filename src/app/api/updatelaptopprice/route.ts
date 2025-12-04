import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  // Try to read JSON body first; if missing or invalid, fall back to query params
  const body = await req.json().catch(() => null);
  let { id, price, brandName } = (body ?? {}) as { id?: string; brandName?: string; price?: number };

  if ((!id && !brandName) || price == null) {
    // fallback to query params for convenience (useful when testing with Thunder Client)
    try {
      const url = new URL(req.url);
      const qpId = url.searchParams.get('id');
      const qpBrand = url.searchParams.get('brandName') || url.searchParams.get('brand');
      const qpPrice = url.searchParams.get('price');
      if (!id && qpId) id = qpId;
      if (!brandName && qpBrand) brandName = qpBrand;
      if (price == null && qpPrice != null) {
        const parsed = Number(qpPrice);
        if (!isNaN(parsed)) price = parsed;
      }
    } catch (e) {
      // ignore URL parse errors and fall through to validation below
    }
  }

  if ((!id && !brandName) || price == null) {
    return NextResponse.json({ message: "Missing id/brandName or price" }, { status: 400 });
  }

  const newPrice = Number(price);
  if (isNaN(newPrice)) {
    return NextResponse.json({ message: "Invalid price format" }, { status: 400 });
  }

  try {
    // normalize id/brandName
    if (brandName) brandName = String(brandName).trim();
    if (id) id = String(id).trim();

    // Try updating by id first (catalog items only)
    if (id) {
      console.log(`[updatelaptopprice] attempt by id=${id} price=${newPrice}`);
      const result = await prisma.laptop.updateMany({ where: { id: String(id), orderId: null }, data: { price: newPrice } });

      if (result.count > 0) {
        const updatedLaptop = await prisma.laptop.findUnique({ where: { id: String(id) } });
        return NextResponse.json(updatedLaptop);
      }

      // If no catalog rows updated, check whether the id exists but belongs to an order
      const existing = await prisma.laptop.findUnique({ where: { id: String(id) } });
      if (existing) {
        console.warn(`[updatelaptopprice] id=${id} exists but orderId=${existing.orderId}`);
        return NextResponse.json({ message: 'Laptop exists but is part of an order (historical). Catalog rows were not updated.' }, { status: 409 });
      }
      // fallthrough to attempt brandName update if provided
    }

    // If brandName provided, update catalog laptops by brandName (may affect multiple rows if duplicates)
    if (brandName) {
      console.log(`[updatelaptopprice] attempt by brandName=${brandName} price=${newPrice}`);
      const resultByBrand = await prisma.laptop.updateMany({ where: { brandName: { equals: String(brandName), mode: 'insensitive' }, orderId: null }, data: { price: newPrice } });

      if (resultByBrand.count > 0) {
        // return one of the updated catalog items for convenience
        const oneUpdated = await prisma.laptop.findFirst({ where: { brandName: { equals: String(brandName), mode: 'insensitive' }, orderId: null } });
        return NextResponse.json(oneUpdated);
      }

      // If nothing updated, check whether any laptops exist with that brandName (case-insensitive) but are part of orders
      const anyExisting = await prisma.laptop.findFirst({ where: { brandName: { equals: String(brandName), mode: 'insensitive' } } });
      if (anyExisting) {
        console.warn(`[updatelaptopprice] brandName=${brandName} exists but no catalog rows (orderId=null) found`);
        return NextResponse.json({ message: 'No catalog rows found for this brandName; existing rows appear to be order items (historical).' }, { status: 409 });
      }
    }

    return NextResponse.json({ message: 'Laptop not found' }, { status: 404 });
  } catch (error: any) {
    console.error("Error updating laptop price:", error);
    return NextResponse.json({ message: "Failed to update price" }, { status: 500 });
  }
}