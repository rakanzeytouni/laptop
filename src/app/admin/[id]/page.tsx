"use client";
import { getAllLaptop, getAllOrder, getAllUser, updateLaptopPrice } from "@/components/action/action";
import { useEffect, useState } from "react";
import Link from "next/link"; // Added Link for potential navigation/dashboard structure

type User = {
    name: string;
    email: string;
};
type laptop={
    brandName:string;
    price: number;
    quantity:number; 
    id?: string;
}
type order = {
    id: string;
    createdAt: string | Date;
    user: {
        name: string;
        email: string;
    };
    laptop: laptop[]; // List of products bought in this specific order
}

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [Laptops, setLaptop] = useState<laptop[]>([]);
    const [orderings, setOrder] = useState<order[]>([]);

    // State for the update form
    const [selectedLaptopId, setSelectedLaptopId] = useState('');
    const [newPrice, setNewPrice] = useState<number | ''>('');
    const [updateStatus, setUpdateStatus] = useState('');

    // Function to fetch laptops (used for initial load and refreshing data)
    const fetchLaptops = async () => {
        const data1 = await getAllLaptop();
        setLaptop(data1);
    };

    useEffect(() => {
        async function fetchInitialData() {
            // Fetch all data
            const data = await getAllUser();
            setUsers(data);
            
            await fetchLaptops(); // Fetch laptops
            
            const data2 = await getAllOrder();
            setOrder(data2);
        }
        fetchInitialData();
    }, []);

    // Handler for the price update
    const handleUpdatePrice = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateStatus('Updating...');

        if (!selectedLaptopId || newPrice === '' || isNaN(Number(newPrice))) {
            setUpdateStatus('Error: Select a laptop and enter a valid price.');
            return;
        }
    
        try {
            const selectedOption = UPDATABLE_LAPTOP_OPTIONS.find(o => o.id === selectedLaptopId);
            if (!selectedOption) throw new Error('Selected laptop option not found');
            
            const isFallback = selectedOption.id?.startsWith('fallback-');
            if (isFallback) {
                await updateLaptopPrice({ brandName: selectedOption.brandName }, Number(newPrice));
            } else {
                await updateLaptopPrice({ id: selectedLaptopId }, Number(newPrice));
            }

            setUpdateStatus("✅ Successfully updated price");
            
            // Refresh the laptop list to show the new price immediately
            await fetchLaptops(); 
            
            // Clear form
            setSelectedLaptopId('');
            setNewPrice('');
        } catch (error) {
            setUpdateStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update price'}`);
        }
    };
    
    // --- Updatable laptop options derived from current laptop state ---
    const UPDATABLE_LAPTOP_OPTIONS = (() => {
        const dellLaptop = Laptops.find(l => l.brandName.toLowerCase().includes("del"));
        const lenovoLaptop = Laptops.find(l => l.brandName.toLowerCase().includes("lenovo"));

        // Ensure we always have at least one option available, even if data hasn't fully loaded or is empty
        const options = [
            {
                id: lenovoLaptop?.id ?? "fallback-lenovo",
                brandName: lenovoLaptop?.brandName ?? "Lenovo (Fallback)",
                price: lenovoLaptop?.price,
            },
            {
                id: dellLaptop?.id ?? "fallback-dell",
                brandName: dellLaptop?.brandName ?? "Dell (Fallback)",
                price: dellLaptop?.price,
            },
        ];

        return options;
    })();

    // --- Data Flattening for Table Display ---
    const flattenedOrderData = orderings.flatMap(order => 
        order.laptop.map(laptopItem => ({
            userName: order.user.name,
            userEmail: order.user.email,
            brandName: laptopItem.brandName,
            price: laptopItem.price,
            quantity: laptopItem.quantity,
            totalPrice: laptopItem.price * laptopItem.quantity,
            createdAt: order.createdAt,
            orderId: order.id,
        }))
    );

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    
                    <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard 🛡️</h1>
                        <Link href="/product" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Back to product
                        </Link>
                    </header>
                    <div className="mb-10 p-6 border border-blue-200 rounded-xl shadow-lg bg-white">
                        <h2 className="text-2xl font-semibold text-blue-700 mb-3">Update Product Base Price</h2>
                        <p className="text-sm text-gray-600 mb-4">Use this form to adjust the current catalog price for **Lenovo** or **Dell** laptops. Changes will reflect in the cart immediately upon refresh.</p>
                        
                        <form onSubmit={handleUpdatePrice} className="flex flex-wrap gap-4 items-end">
                            
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Laptop Brand</label>
                                <select
                                    value={selectedLaptopId}
                                    onChange={(e) => setSelectedLaptopId(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                >
                                    <option value="" disabled>Select Brand to Edit</option>
                                    {UPDATABLE_LAPTOP_OPTIONS.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.brandName} {option.price !== undefined && `(Current: $${option.price.toFixed(2)})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-medium text-gray-700 mb-1">New Price ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 1250.00"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(Number(e.target.value))}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={!selectedLaptopId || newPrice === '' || updateStatus === 'Updating...'}
                                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {updateStatus === 'Updating...' ? 'Applying...' : 'Update Price'}
                            </button>
                        </form>
                        
                        {updateStatus && (
                            <p className={`mt-3 text-sm font-medium ${updateStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                                {updateStatus}
                            </p>
                        )}
                    </div>

                    ---

                    ## Recent Sales History 📜
                    <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg overflow-x-auto">
                        {flattenedOrderData.length > 0 ? (
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                                        <th className="p-3 border-b border-gray-200">Order ID</th>
                                        <th className="p-3 border-b border-gray-200">User</th>
                                        <th className="p-3 border-b border-gray-200">Product</th>
                                        <th className="p-3 border-b border-gray-200 text-right">Price ($)</th>
                                        <th className="p-3 border-b border-gray-200 text-right">Qty</th>
                                        <th className="p-3 border-b border-gray-200 text-right">Total</th>
                                        <th className="p-3 border-b border-gray-200">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flattenedOrderData.map((item, index) => (
                                        <tr key={item.orderId + '-' + index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3 text-xs text-gray-500">{item.orderId.substring(0, 8)}...</td>
                                            <td className="p-3">
                                                <div className="font-medium text-gray-900">{item.userName}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none">{item.userEmail}</div>
                                            </td>
                                            <td className="p-3 font-medium text-gray-700">{item.brandName}</td>
                                            <td className="p-3 text-right font-semibold text-gray-700">${item.price.toFixed(2)}</td>
                                            <td className="p-3 text-right">{item.quantity}</td>
                                            <td className="p-3 text-right font-bold text-base text-green-700">${item.totalPrice.toFixed(2)}</td>
                                            <td className="p-3 text-xs">
                                                {new Date(item.createdAt).toLocaleDateString()} 
                                                <div className="text-[10px]">{new Date(item.createdAt).toLocaleTimeString()}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No orders found yet. 🦗</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}