import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { brandName , price } = await req.json();

    if (!brandName ||!price) {
        return NextResponse.json({ message: "Missing brandName" }, { status: 400 });
    }

    
    try {
        const userId = session.user.id; 
       const cartItem = await prisma.cartItem.upsert({
    where: {
        userId_brandName: { 
            userId: userId,
            brandName: brandName,
           
            
        }
    },
    update: {
        quantity: { increment: 1 }, 
         price:price
    },
    create: {
        userId: userId,
        brandName: brandName,
        quantity: 1,
        price:price

    },
});
        return NextResponse.json({ 
            message: `${brandName} added to cart successfully`, 
            item: cartItem 
        }, { status: 200 });
        
    } catch (error) {
        console.error("Database Error adding cart item:", error);
        return NextResponse.json(
            { message: "Internal server error while adding to cart" }, 
            { status: 500 }
        );
    }
}