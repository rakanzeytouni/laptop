"use server";
import prisma from "@/lib/prisma";

export async function Getallcarts(userid:string){
return await prisma.cartItem.findMany({
    where:{userId:userid}
})
}
export async function UpdateCartQuantity(cartItemId: string, newQuantity: number) {
    if (newQuantity < 1) {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
        return null; 
    }
    
    return await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: newQuantity },
    });
}
export async function CreateOrder(userId: string) {
    return await prisma.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: { userId: userId },
        });

        if (cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }
        const newOrder = await tx.order.create({
            data: {
                userId: userId,
            },
        });
        const laptopData = cartItems.map(item => ({
            brandName: item.brandName,
            quantity: item.quantity,  
            orderId: newOrder.id,
        }));

        await tx.laptop.createMany({
            data: laptopData,
        });
        await tx.cartItem.deleteMany({
            where: { userId: userId },
        });

        return newOrder;
    });
}