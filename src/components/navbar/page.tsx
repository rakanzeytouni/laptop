"use client";
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
interface NavbarProps {
  cartCount: number;
}

export default function Navbar( { cartCount }: NavbarProps) {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V15H4V5Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17H22"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-2xl font-semibold">Rakan laptops</h1>
        </div>
        <nav className="hidden md:flex gap-10 text-lg font-medium">
          <a href="/home" className="hover:text-yellow-300 transition">Home</a>
          <a href="/product" className="hover:text-yellow-300 transition">Products</a>
          <a href="#" className="hover:text-yellow-300 transition">About Us</a>
          <a href="#" className="hover:text-yellow-300 transition">Contact</a>
        </nav>
        <div className="hidden md:block">
                   <Link href={"/cart"}>
          <button className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full cursor-pointer hover:rounded-2xl transition">
               {cartCount > 0 && (
          <span className="absolute   -right-1 mr-40  bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {cartCount}
          </span>
               )}
            <ShoppingCartIcon className="h-6 w-6 text-black" />
          </button>
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-4">
            <Link href={"/cart"}>
          <button className="bg-white text-gray-900 font-semibold p-2 rounded-full cursor-pointer hover:rounded-2xl transition">
            <ShoppingCartIcon className="h-6 w-6 text-black" />
                  {cartCount > 0 && (
          <span className="absolute   -right-1 mr-20 top-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {cartCount}
          </span>
               )}
          </button>
          </Link>
        
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-8 w-8 text-white" />
            ) : (
              <Bars3Icon className="h-8 w-8 text-white" />
            )}
          </button>
        
          
        </div>
      </div>
      <div
        className={`md:hidden ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } w-full bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-inner transition-all duration-300 ease-in-out`}
      >
        <nav className="flex flex-col items-center py-6 text-lg font-medium space-y-4">
          <a href="/home" className="hover:text-yellow-300 transition">Home</a>
          <a href="/product" className="hover:text-yellow-300 transition">Products</a>
          <a href="#" className="hover:text-yellow-300 transition">About Us</a>
          <a href="#" className="hover:text-yellow-300 transition">Contact</a>
        </nav>
      </div>
    </header>
  );
}