"use client";

import Navbar from "@/components/navbar/page";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        // --- 1. Inject Scrolling Animation CSS (Retained) ---
        const scrollStyleId = 'laptop-animation-styles';
        if (!document.getElementById(scrollStyleId)) {
            const scrollStyle = document.createElement("style");
            scrollStyle.id = scrollStyleId;
            scrollStyle.innerHTML = `
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

                /* Custom gradient utility classes for better reusability */
                .bg-primary-gradient {
                    background-image: linear-gradient(to right, var(--tw-gradient-stops));
                }
                .text-primary-gradient {
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                    background-image: linear-gradient(to right, var(--tw-gradient-stops));
                }
            `;
            document.head.appendChild(scrollStyle);
        }

        // --- 2. Inject Custom Gradient Colors and Shadow CSS ---
        // Defines the specific gradient and ensures text accents and card shadows are adapted.
        const colorStyleId = 'gradient-styles';
        if (!document.getElementById(colorStyleId)) {
            const colorStyle = document.createElement('style');
            colorStyle.id = colorStyleId;
            colorStyle.innerHTML = `
                :root {
                    --red-500: #ef4444;
                    --purple-600: #9333ea;
                    --blue-700: #1d4ed8;
                }
                .bg-primary-gradient {
                    --tw-gradient-stops: var(--red-500), var(--purple-600), var(--blue-700);
                }
                .border-gradient-primary {
                    border-image: linear-gradient(to right, var(--red-500), var(--purple-600), var(--blue-700)) 1;
                    border-width: 4px; /* Ensure thickness for the border effect */
                    border-style: solid;
                }
                .card-shadow {
                    box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.3), 0 4px 6px -2px rgba(147, 51, 234, 0.1);
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .card-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 25px -5px rgba(147, 51, 234, 0.4), 0 10px 10px -5px rgba(147, 51, 234, 0.15);
                }
            `;
            document.head.appendChild(colorStyle);
        }
    }, []);

    // Helper component for the product card (adapted for gradient styling)
    const ProductCard = ({ title, specs, price }:{title:any, specs:any ,price:any}) => (
        <div className="bg-white rounded-xl overflow-hidden card-shadow p-6 flex flex-col items-center text-center border border-gray-100">
            <div className="w-full h-48 bg-gray-100 mb-4 rounded-lg flex items-center justify-center">
                <span className="text-lg text-gray-400">{title} Render</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm mb-3">{specs}</p>
            {/* Price uses the gradient text class */}
            <p className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">{price}</p>
            
            {/* CTA button uses the gradient background */}
            <a href="#" className="w-full text-white py-2 rounded-lg font-medium transition duration-300 bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 hover:opacity-90">
                View Details
            </a>
        </div>
    );

    const laptopImages = [
        "/dell.jpeg",
        "/dell2.jpeg",
        "/gamin laptop.jpeg",
        "/hp.jpeg",
        "/msi.jpeg",
        "/lonovo2.jpeg",
    ];

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Navbar retains its shadow and uses the light background for contrast */}
            <Navbar cartCount={0} />

            <main>
                {/* Hero Section - Uses the full gradient background and white text */}
                <section className="bg-blue-950  py-20 md:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl text-amber-50  font-extrabold leading-tight mb-4">
                                Unleash Your Potential with <span className="text-white underline decoration-wavy decoration-red-400">Pure Power</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-8">
                                Explore the latest ultrabooks, gaming rigs, and professional workstations built for extreme performance.
                            </p>
                            {/* CTA button remains vibrant white on gradient background */}
                            <a href="/product" className="inline-block bg-white text-gray-900 text-lg font-semibold py-3 px-8 rounded-full hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 shadow-xl">
                                Shop All Laptops
                            </a>
                        </div>
                        
                        {/* Laptop Image Placeholder */}
                        <div className="flex-shrink-0 w-full max-w-sm md:max-w-lg">
                            <div className="h-64 md:h-96  rounded-xl flex items-center justify-center  shadow-2xl">
                                <span className="text-xl text-gray-400">
                                  <img width={6000} className=" rounded-2xl" src={"/lonovo.jpeg"} />
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Infinite Scrolling Laptop Gallery */}
                <div className="relative w-full overflow-hidden bg-white py-6 border-b border-gray-200 shadow-inner">
                    <div className="flex animate-laptop-scroll" style={{ width: "fit-content" }}>
                        {[...laptopImages, ...laptopImages].map((src, index) => (
                            <img
                                key={index}
                                className="w-60 h-40 object-contain mx-6 flex-shrink-0 opacity-70 hover:opacity-100 transition duration-300" 
                                src={src}
                                alt={`Laptop ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Featured Products Section */}
                <section id="featured" className="py-16 md:py-24 bg-white ">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">Top Picks</span> This Month
                        </h2>
                    
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ProductCard title="ProBook X1 Carbon" specs="i7 | 16GB RAM | 1TB SSD" price="$1,899" />
                            <ProductCard title="Gaming Beast Z14" specs="Ryzen 9 | RTX 4080 | 32GB RAM" price="$2,999" />
                            <ProductCard title="Budget Student Air" specs="i5 | 8GB RAM | 512GB SSD" price="$749" />
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-16 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-600 to-blue-700">Us</span>?
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {/* Boxes use a border image trick to apply the gradient border, a slight modification of the border-t-4 class */}
                            <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300 border-gradient-primary">
                                <div className="text-5xl mb-4">⭐</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Top-Rated Quality</h3>
                                <p className="text-gray-500">Only genuine products from certified, world-leading manufacturers.</p>
                            </div>
                            
                            <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300 border-gradient-primary">
                                <div className="text-5xl mb-4">🚀</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Free Express Shipping</h3>
                                <p className="text-gray-500">Get your new machine delivered to your door in 1-3 business days.</p>
                            </div>

                            <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300 border-gradient-primary">
                                <div className="text-5xl mb-4">🛡️</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">30-Day Money Back</h3>
                                <p className="text-gray-500">Shop with confidence with our no-hassle return policy.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer Section - Uses the full gradient background and white text */}
            <footer className="bg-primary-gradient bg-gradient-to-r from-red-500 via-purple-600 to-blue-700 text-white py-12 shadow-inner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/30 pb-8 mb-8">
                        
                        <div>
                            {/* Footer headline uses white for maximum contrast */}
                            <h4 className="text-xl font-bold text-white mb-4">Laptop Store</h4>
                            <p className="text-gray-200 text-sm">Powering your future, today.</p>
                        </div>

                        <div>
                            <h5 className="text-lg font-semibold mb-4">Shop</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-200 hover:text-white transition duration-300">Ultrabooks</a></li>
                                <li><a href="#" className="text-gray-200 hover:text-white transition duration-300">Gaming</a></li>
                                <li><a href="#" className="text-gray-200 hover:text-white transition duration-300">Business</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-lg font-semibold mb-4">Support</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-200 hover:text-white transition duration-300">Contact Us</a></li>
                                <li><a href="#" className="text-gray-200 hover:text-white transition duration-300">FAQ</a></li>
                                <li><a href="#" className="text-gray-200 hover:text-white transition duration-300">Returns</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-lg font-semibold mb-4">Stay Connected</h5>
                            <form>
                                <input type="email" placeholder="Your Email" className="w-full p-2 rounded-lg bg-white/20 text-white border-none focus:ring-white focus:border-white mb-3 text-sm placeholder-gray-300" />
                                <button type="submit" className="w-full bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold text-sm">Subscribe</button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="text-center text-gray-300 text-sm">
                        &copy; 2025 Laptop Store. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}