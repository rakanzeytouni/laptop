"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar/page";
import { useSession } from "next-auth/react";
import { CreateOrder, deleteAllCart, deletecart, Getallcarts, UpdateCartQuantity } from "@/components/action/action";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

interface CartItem {
    id: string;
    brandName: string;
    quantity: number;
    userId: string;
}

export default function Cart() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOrdering, setIsOrdering] = useState(false);
    
    const cartCount = cartItems.length;

    // --- Data Fetching Logic (Retained) ---
    const fetchCart = useCallback(async (userId: string) => {
        setIsLoading(true);
        try {
            const items = await Getallcarts(userId);
            if (Array.isArray(items)) {
                setCartItems(items as CartItem[]);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            fetchCart(session.user.id);
        } else if (status !== "loading") {
            setIsLoading(false);
            setCartItems([]);
        }
    }, [status, session?.user?.id, fetchCart]);

    // --- Action Handlers (Retained) ---

    const handleDeleteAll = async () => {
        if (!session?.user?.id || !window.confirm("Are you sure you want to clear your entire cart?")) {
            return;
        }
        await deleteAllCart(session.user.id);
        fetchCart(session.user.id);
    };

    const deletelaptopTocart = async (userId: string, brandName: string) => {
        // Optimistic UI update for immediate removal
        setCartItems(prevItems => prevItems.filter(item => !(item.userId === userId && item.brandName === brandName)));
        
        await deletecart(userId, brandName);
        // Note: Re-fetch is only needed if optimistic update fails or for synchronization. 
        // We'll keep the re-fetch for safety:
        if (session?.user?.id) fetchCart(session.user.id);
    };

    const handleQuantityChange = async (itemId: string, currentQuantity: number, delta: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return; 
        
        // Optimistic UI update
        setCartItems(prevItems => 
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        try {
            await UpdateCartQuantity(itemId, newQuantity);
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("An error occurred. Re-fetching cart.");
            if (session?.user?.id) fetchCart(session.user.id);
        }
    };

    const handleCreateOrder = async () => {
        if (!session?.user?.id || cartItems.length === 0) {
            alert("Your cart is empty or you are not logged in.");
            return;
        }

        setIsOrdering(true);
        try {
            const order = await CreateOrder(session.user.id);
            
            if (order) {
                alert(`Order created successfully!`);
                setCartItems([]);
            } else {
                alert("Failed to create order. Please try again.");
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert("An error occurred while placing the order.");
        } finally {
            setIsOrdering(false);
        }
    };
    
    // --- Rendering Sections ---

    if (isLoading) {
        return (
            <>
                <Navbar cartCount={0} />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-xl text-gray-600">Loading your cart... ⏳</p>
                </div>
            </>
        );
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar cartCount={0} />
                <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
                    <div className="text-6xl mb-4">🛒</div>
                    <h1 className="text-3xl font-bold mb-3 text-gray-800">Your Cart is Empty</h1>
                    <p className="text-lg text-gray-500 mb-6">Explore our powerful laptops and find your next upgrade.</p>
                    <Link 
                        href="/product" 
                        className="inline-block text-white py-3 px-8 rounded-full font-semibold transition duration-300 bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 hover:shadow-lg"
                    >
                        Start Shopping
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar cartCount={cartCount} />
            <div className="min-h-screen bg-gray-50 pt-8 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Header with Gradient */}
                    <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
                        Shopping Cart <span className="text-xl font-medium text-gray-500">({cartCount} Items)</span>
                    </h1>
                    
                    {/* Cart Items List */}
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 items-center justify-between transition duration-300 hover:shadow-xl"
                            >
                                
                                {/* Item Info and Image Placeholder */}
                                <div className="flex items-center flex-grow">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center border border-gray-200">
                                        <span className="text-xs text-gray-400">Preview</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{item.brandName}</h3>
                                </div>

                                {/* Controls Section */}
                                <div className="flex items-center space-x-4">
                                    
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-1 border border-gray-300 rounded-full w-fit p-0.5">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                            disabled={item.quantity <= 1 || isOrdering}
                                            className="text-lg text-white bg-red-500 hover:bg-red-600 w-7 h-7 rounded-full disabled:bg-gray-300 transition"
                                        >
                                            -
                                        </button>
                                        <span className="text-base font-semibold w-5 text-center text-gray-700">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                            disabled={isOrdering}
                                            className="text-lg text-white bg-green-500 hover:bg-green-600 w-7 h-7 rounded-full transition"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => deletelaptopTocart(item.userId, item.brandName)}
                                        disabled={isOrdering}
                                        // Gradient Red Button for removal
                                        className="text-white font-medium py-2 px-4 rounded-lg text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition duration-150 disabled:bg-gray-400"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        
                        {/* Clear All Cart Button */}
                        <button
                            onClick={handleDeleteAll}
                            disabled={isOrdering}
                            className="text-sm font-medium text-red-500 hover:text-red-700 transition duration-150 p-2 border border-red-300 rounded-lg hover:bg-red-50 w-full md:w-auto"
                        >
                            Clear Entire Cart
                        </button>
                        
                        {/* Checkout Button (uses the main theme gradient) */}
                        <button
                            onClick={handleCreateOrder}
                            disabled={isOrdering || cartItems.length === 0}
                            className="w-full md:w-auto text-white font-bold py-3 px-10 rounded-lg text-lg transition duration-300 shadow-xl
                                bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 
                                hover:from-red-600 hover:to-blue-800
                                disabled:bg-gray-400 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400"
                        >
                            {isOrdering ? 'Processing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}