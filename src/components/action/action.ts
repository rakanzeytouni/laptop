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
        
        // 1. Create the new Order record
        const newOrder = await tx.order.create({
            data: {
                userId: userId,
            },
        });

        // 2. Prepare the order items (historical record)
        const laptopOrderData = cartItems.map(item => ({
            brandName: item.brandName,
            quantity: item.quantity,  
            orderId: newOrder.id, // Linked to the specific order
            price: item.price ?? 0, 
        }));

        // 3. Create the historical laptop records
        await tx.laptop.createMany({
            data: laptopOrderData,
        });

        // 4. NEW LOGIC: Ensure a catalog item (orderId: null) exists for every brand in the cart.
        const uniqueBrands = [...new Set(cartItems.map(item => item.brandName))];

        for (const brandName of uniqueBrands) {
            // Check if a catalog item (orderId: null) already exists for this brand
            const catalogItemExists = await tx.laptop.findFirst({
                where: { 
                    brandName: { equals: brandName, mode: 'insensitive' },
                    orderId: null 
                },
            });

            // If no catalog item exists, create one using the price from the cart.
            if (!catalogItemExists) {
                const cartItem = cartItems.find(item => item.brandName === brandName);
                if (cartItem) {
                    console.log(`[CreateOrder] No catalog item found for ${brandName}. Creating a new catalog item.`);
                    await tx.laptop.create({
                        data: {
                            brandName: cartItem.brandName,
                            price: cartItem.price ?? 0,
                            quantity: 1, // Default quantity for catalog item
                            orderId: null, // THIS ensures it is a permanent catalog item
                        }
                    });
                }
            }
        }
        
        // 5. Clear the cart
        await tx.cartItem.deleteMany({
            where: { userId: userId },
        });

        return newOrder;
    });
}
export async function deleteAllCart(userId:string){
    return await prisma.cartItem.deleteMany({
        where:{userId:userId},
    })
}
export async function deletecart(userId: string, brandName: string) {
  return await prisma.cartItem.delete({
    where: {
      userId_brandName: {
        userId,
        brandName
      }
    }
  });
}
export async function getAllUser() {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email:true, // بس الاسم
    },
  });
  return users;
}

// NEW FUNCTION: getLaptopForDisplay
export async function getLaptopForDisplay(brandName: string) {
    // 1. Try to find the item in the catalog (orderId: null)
    let laptop = await prisma.laptop.findFirst({
        where: { 
            brandName: { equals: brandName, mode: 'insensitive' },
            orderId: null 
        },
        select: {
            id: true,
            brandName: true,
            price: true,
        }
    });

    // 2. If no catalog item exists, find any existing laptop of that brand (even a historical/order item)
    // This provides a dynamic price reference if the catalog is momentarily empty for this brand.
    if (!laptop) {
        laptop = await prisma.laptop.findFirst({
            where: { 
                brandName: { equals: brandName, mode: 'insensitive' } 
            },
            select: {
                id: true,
                brandName: true,
                price: true,
            }
        });
    }

    // Return the found laptop or null if neither was found
    return laptop;
}


export async function getAllLaptop() {
 const Laptop = await prisma.laptop.findMany({
where: { orderId: null }, // only return catalog items (not order items)
 select: {
id: true,
brandName: true,
 price: true,
 quantity: true,
 },
 });
 return Laptop;
}
export async function getAllOrder() {
 const ordersWithDetails = await prisma.order.findMany({
 // Fetch the main order details
 orderBy: { createdAt: 'desc' }, // Show newest orders first
 select: {
 id: true,
 createdAt: true,
 // Eager load the user who placed the order
 user: {
 select: {
name: true,
 email: true,
 },
 },
// Eager load the items (laptops) in this specific order
laptop: {
 select: {
 brandName: true,
 price: true,
quantity: true,
 },
 },
 },
});
 return ordersWithDetails;
}
// Add this new function to handle the price update
export async function updateLaptopPrice(
 identifier: { id?: string; brandName?: string },
 price: number
) {
 try {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
 // Build body to include either id or brandName
 const body: any = { price };
 if (identifier.id) body.id = identifier.id;
 if (identifier.brandName) body.brandName = identifier.brandName;

 const response = await fetch(`${baseUrl}/api/updatelaptopprice`, {
 method: 'PATCH',
headers: {
 'Content-Type': 'application/json',
 },
body: JSON.stringify(body),
 });
 if (!response.ok) {
 const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
 return { success: false, message: errorData.message || 'Failed to update price on server.' };
 }

const data = await response.json();
 return { success: true, data };
 } catch (error) {
 console.error('Error updating laptop price:', error);
 throw error; // Re-throw the error to be handled by the component
 }
}
