"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/page";
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";
export default function Product() {
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();
    const router = useRouter(); 

  const addLaptopToCart = async (brandName: string) => {
    if (status === "loading") {
      alert("Please wait, checking authentication status...");
      return;
    }
    if (!session|| !session.user || !session.user.id) {
      alert("Please log in to add items to your cart.");
      router.push("/login")
      return;
    }
    
    try {
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName }),
      });
       
        if (response.status === 401) {
            alert("Please log in to add items to your cart.");
            router.push("/login");
            return; 
        }

      if (response.ok) {
        setCartCount(prevCount => prevCount + 1);
        alert(`${brandName} added to cart!`);
      } else {
        alert('Failed to add laptop to cart.');
      }
    } catch (error) {
      console.error('Error adding laptop:', error);
      alert('An error occurred.');
    }

  };
       const redirect=()=>{
    router.push("/del")
  };
       const redirectTolenovo=()=>{
    router.push("/lenovo")
  };
  return (
    <>
      <Navbar cartCount={cartCount} />
      <h1 className="flex justify-center pt-6 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">
        Choose your Best Laptop
      </h1>
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-10 pr-10 pl-10">
        <div onClick={redirect}>
        <div  className="bg-white rounded-lg shadow-md overflow-hidden p-4 cursor-pointer">
          <div className="relative">
            <img src="/dell.jpeg" alt="Dell laptop" className="w-full h-auto object-cover" />
            <button
               onClick={(e) => {
    e.stopPropagation(); 
    addLaptopToCart("del");
  }}
              className="absolute top-2 left-2 bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1"
            >
              <span>+ Add</span>
            </button>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-800 capitalize">del</p>
          <p  className=" text-green-400">price : 800$</p>
        </div>
        </div>
          <div onClick={redirectTolenovo}>
        <div  className="bg-white rounded-lg shadow-md overflow-hidden p-4 cursor-pointer">
          <div className="relative">
            <img src="/lonovo.jpeg" alt="lenovo laptop" className="w-full h-auto object-cover" />
            <button
               onClick={(e) => {
    e.stopPropagation(); 
    addLaptopToCart("lenovo");
  }}
              className="absolute top-2 left-2 bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1"
            >
              <span>+ Add</span>
            </button>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-800 capitalize">lenovo</p>
          <p  className=" text-green-400">price : 600$</p>
        </div>
        </div>
      </div>
      
      
    </>
  );
}