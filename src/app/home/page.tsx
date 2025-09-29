"use client";
import Navbar from "@/components/navbar/page";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    if (!document.getElementById("laptop-animation-styles")) {
      const style = document.createElement("style");
      style.id = "laptop-animation-styles"; 
      style.innerHTML = `
        @keyframes scroll-laptops {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-laptop-scroll {
          animation: scroll-laptops 30s linear infinite;
          display: flex;
          white-space: nowrap;
        }
      `;
      document.head.appendChild(style);
    }
  }, []); 

  return (
    <>
      <Navbar cartCount={0}/>
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto py-20">
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">
              Your Gateway to the Best Laptops
            </span>
          </h1>
          <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto mb-8">
            Explore our curated collection of high-performance laptops. We bring you the latest technology,
            unmatched quality, and unbeatable prices to power your passion and profession.
          </p>
          <a
            href="/product"
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
          >
            Shop Now
          </a>
        </div>
        <div className="relative w-full max-w-screen-xl overflow-hidden py-8">
          <div className="flex animate-laptop-scroll" style={{ width: "fit-content" }}>

            {[
              "/dell.jpeg",
              "/dell2.jpeg",
              "/gamin laptop.jpeg",
              "/hp.jpeg",
              "/msi.jpeg",
              "/lonovo2.jpeg",
            ].map((src, index) => (
              <img
                key={`original-${index}`}
                className="w-50 h-50 object-cover mx-4 flex-shrink-0"
                src={src}
                alt={`Laptop ${index + 1}`}
              />
            ))}
            {[
              "/dell.jpeg",
              "/dell2.jpeg",
              "/gamin laptop.jpeg",
              "/hp.jpeg",
              "/msi.jpeg",
              "/lonovo2.jpeg",
            ].map((src, index) => (
              <img
                key={`duplicate-${index}`}
                className="w-50  h-50 object-cover mx-4 flex-shrink-0"
                src={src}
                alt={`Laptop ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}