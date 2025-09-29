"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar/page";
import { useSession } from "next-auth/react";
import { CreateOrder, Getallcarts, UpdateCartQuantity } from "@/components/action/action";
interface CartItem {
    id: string;
    brandName: string;
    quantity: number;
    userId: string;
}

export default function Cart() {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOrdering, setIsOrdering] = useState(false);

    const cartCount = cartItems.length;
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
    const handleQuantityChange = async (itemId: string, currentQuantity: number, delta: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return; 
        setCartItems(prevItems => 
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        try {
            const updatedItem = await UpdateCartQuantity(itemId, newQuantity);

            if (!updatedItem) {
                alert("Failed to update quantity. Re-fetching cart.");
                if (session?.user?.id) fetchCart(session.user.id);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("An error occurred while updating quantity.");
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
                alert(`Order created successfully! Cart cleared.`);
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
    

    if (isLoading) {
    }
    
    if (cartItems.length === 0) {
        
    }

    return (
        <>
            <Navbar cartCount={cartCount} />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart ({cartCount} Items)</h1>
                
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border p-4 rounded-lg shadow-sm">
                            <span className="text-lg font-semibold flex-1">{item.brandName}</span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                    className="bg-red-500 text-white w-8 h-8 rounded-full disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="text-xl w-6 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                    className="bg-green-500 text-white w-8 h-8 rounded-full"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-right">
                    <button
                        onClick={handleCreateOrder}
                        disabled={isOrdering || cartItems.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:bg-gray-400 transition duration-150"
                    >
                        {isOrdering ? 'Processing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </>
    );
}