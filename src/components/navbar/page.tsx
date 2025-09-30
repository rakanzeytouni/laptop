"use client";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
declare global {
  interface Window {
    gapi?: any; 
  }
}
interface NavbarProps {
  cartCount: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

const handleSignout = () => {
  localStorage.removeItem("currentUser");
if (window.gapi) {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2) auth2.signOut();
}
  if (window?.gapi) {
    const auth2 = window.gapi?.auth2?.getAuthInstance();
    if (auth2) auth2.signOut().then(() => console.log("Google signed out"));
  }
  window.location.href = "/login";
};


  return (
    <header className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
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
          <h1 className="text-2xl font-semibold">Rakan Laptops</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-10 text-lg font-medium">
          {["Home", "Products", "About Us", "Contact"].map((item) => (
            <Link key={item} href={item === "Home" ? "/home" : item === "Products" ? "/product" : "#"} className="hover:text-yellow-300 transition">
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop Cart & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cart" className="relative">
            <button className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full hover:rounded-2xl transition relative">
              <ShoppingCartIcon className="h-6 w-6 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
          <button
            onClick={handleSignout}
            className="bg-red-500 text-amber-50 px-4 py-2 rounded-full hover:rounded-2xl transition"
          >
            Log Out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative">
            <button className="bg-white text-gray-900 p-2 rounded-full hover:rounded-2xl transition relative">
              <ShoppingCartIcon className="h-6 w-6 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8 text-white" /> : <Bars3Icon className="h-8 w-8 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} w-full bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-inner transition-all duration-300 ease-in-out`}
      >
        <nav className="flex flex-col items-center py-6 text-lg font-medium space-y-4">
          {["Home", "Products", "About Us", "Contact"].map((item) => (
            <Link key={item} href={item === "Home" ? "/home" : item === "Products" ? "/product" : "#"} className="hover:text-yellow-300 transition">
              {item}
            </Link>
          ))}
          <button
            onClick={handleSignout}
            className="bg-red-500 text-amber-50 w-80 py-2 rounded-2xl flex justify-center items-center hover:opacity-90 transition"
          >
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );
}
