"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
    id?: string;
    brandName: string;
    price: number;
    imageUrl: string;
    redirectPath: string;
};

export default function ProductCard({ id, brandName, price, imageUrl, redirectPath }: ProductCardProps) {
    const [cartCount, setCartCount] = useState(0); // This state should probably live higher up or use a global store for a real cart count
    const [currentPrice, setCurrentPrice] = useState<number>(price);
    const { data: session, status } = useSession();
    const router = useRouter(); 

    useEffect(() => {
        const ac = new AbortController();
        async function fetchPrice() {
            try {
                let res: Response;
                if (id && !id.startsWith('fallback-')) {
                    // prefer id-based lookup when a real id is available
                    const encodedId = encodeURIComponent(id);
                    res = await fetch(`/api/debug/laptop?id=${encodedId}`, { signal: ac.signal });
                } else {
                    const encoded = encodeURIComponent(brandName);
                    res = await fetch(`/api/debug/laptop?brandName=${encoded}`, { signal: ac.signal });
                }
                if (!res.ok) return; // keep current price if debug route fails
                const data = await res.json();

                // debug route returns either null, an object (for id), or an array (for brandName)
                if (!data) return;
                if (Array.isArray(data) && data.length > 0) {
                    const first = data[0];
                    if (first && typeof first.price === 'number') setCurrentPrice(first.price);
                } else if (typeof data === 'object' && data.price != null) {
                    setCurrentPrice(Number(data.price));
                }
            } catch (err) {
                // ignore fetch errors (network aborted or offline)
                // console.debug('Price fetch error', err);
            }
        }
        fetchPrice();
        return () => ac.abort();
    }, [brandName]);

    const addLaptopToCart = async () => {
        if (status === "loading") {
            alert("Please wait, checking authentication status...");
            return;
        }
        if (!session || !session.user || !session.user.id) {
            alert("Please log in to add items to your cart.");
            router.push("/login");
            return;
        }
        
        try {
            const response = await fetch('/api/add-to-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brandName, price: currentPrice }),
            });
            
            if (response.status === 401) {
                alert("Please log in to add items to your cart.");
                router.push("/login");
                return; 
            }

            if (response.ok) {
                setCartCount(prevCount => prevCount + 1);
                alert(`${brandName} added to cart at price ${currentPrice}$!`);
            } else {
                alert('Failed to add laptop to cart.');
            }
        } catch (error) {
            console.error('Error adding laptop:', error);
            alert('An error occurred.');
        }
    };
    
    return (
        <div onClick={() => router.push(redirectPath)}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 cursor-pointer">
                <div className="relative">
                    <img src={imageUrl} alt={`${brandName} laptop`} className="w-full h-auto object-cover" />
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            addLaptopToCart();
                        }}
                        className="absolute top-2 left-2 bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1"
                    >
                        <span>+ Add</span>
                    </button>
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-800 capitalize">{brandName}</p>
                <p className="text-green-400">price : {currentPrice}$</p>
            </div>
        </div>
    );
}