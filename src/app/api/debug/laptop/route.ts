import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Lightweight debug route to fetch laptop rows by id or brandName.
// GET /api/debug/laptop?id=... or /api/debug/laptop?brandName=...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const brandName = url.searchParams.get('brandName');

    if (!id && !brandName) {
      return NextResponse.json({ message: 'Provide id or brandName as query param' }, { status: 400 });
    }

    if (id) {
      const row = await prisma.laptop.findUnique({ where: { id } });
      return NextResponse.json(row ?? null);
    }

    if (brandName) {
      // Case-insensitive search and only return catalog items (orderId == null)
      const rows = await prisma.laptop.findMany({
        where: {
          brandName: { equals: String(brandName), mode: 'insensitive' },
          orderId: null,
        },
      });
      return NextResponse.json(rows);
    }
    return NextResponse.json(null);
  } catch (err: any) {
    console.error('Debug laptop fetch error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
