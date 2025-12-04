import React from "react";
import Navbar from "@/components/navbar/page";
import ProductCard from "@/components/ProductCard/ProductCard";
import { Getallcarts, getLaptopForDisplay } from "@/components/action/action";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- Assumed function to fetch cart data (MUST be an async function/Server Action) ---
// Replace this with your actual function that fetches the cart data from your database.
async function getUserCart(): Promise<CartItem[]> {
    // In a real application, you'd fetch the data based on the user's session/ID.
    // For this demonstration, we'll simulate an empty cart.
    // return []; 
    
    // OR, simulate a cart with two items to show the count working:
    return [
        { id: "cart1", brandName: "Dell", quantity: 1, userId: "user123" },
        { id: "cart2", brandName: "Lenovo", quantity: 1, userId: "user123" }
    ];
}
// ----------------------------------------------------------------------------------

interface CartItem {
    id: string;
    brandName: string;
    quantity: number;
    userId: string;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LaptopDisplay = {
    id: string;
    brandName: string;
    price: number;
};

export default async function Product() {
    let dellData: LaptopDisplay;
    let lenovoData: LaptopDisplay;
    let cartItems: CartItem[] = []; // Initialize cart items

    try {
        // --- 1. Fetch Product Data ---
        const dellLaptop = await getLaptopForDisplay('Dell');
        dellData = dellLaptop || { id: "fallback-dell", brandName: "Dell", price: 800 };

        const lenovoLaptop = await getLaptopForDisplay('Lenovo');
        lenovoData = lenovoLaptop || { id: "fallback-lenovo", brandName: "Lenovo", price: 600 };

        // --- 2. Fetch Cart Data ---
        // getServerSession is available in server components; use it to fetch the user's cart
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            cartItems = await Getallcarts(session.user.id);
        } else {
            cartItems = [];
        }

    } catch (e) {
        console.error("Failed to fetch data:", e);
        // Use fallback data in case of any fetch error
        dellData = { id: "fallback-dell", brandName: "Dell", price: 800 };
        lenovoData = { id: "fallback-lenovo", brandName: "Lenovo", price: 600 };
        cartItems = []; // Ensure cart is empty on failure
    }
    
    // --- 3. Calculate Cart Count ---
    const cartCount = cartItems.length;

    return (
        <>
            {/* Pass the calculated count to the Navbar */}
            <Navbar cartCount={cartCount} /> 
            
            <h1 className="flex justify-center pt-6 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">
                Choose your Best Laptop
            </h1>

            <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-10 pr-10 pl-10">
                <ProductCard
                    id={dellData.id}
                    brandName={dellData.brandName}
                    price={dellData.price}
                    imageUrl="/dell.jpeg"
                    redirectPath="/del"
                />
                <ProductCard
                    id={lenovoData.id}
                    brandName={lenovoData.brandName}
                    price={lenovoData.price}
                    imageUrl="/lonovo.jpeg"
                    redirectPath="/lenovo"
                />
            </div>
        </>
    );
}