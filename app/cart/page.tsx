"use client";

import { trpc } from "@/server/client";
import { useRouter } from "next/navigation"; // Use next/navigation for the latest versions
import { useEffect, useState } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export default function Cart() {
    const router = useRouter();
    const [cartItems, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await trpc.cart.getCart.useQuery();
                if (response.data) {
                    setItems(response.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch cart items", error);
            }
        };

        fetchItems();
    }, []);

    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="ml-4">
                                        <h2 className="text-lg font-semibold">{item.name}</h2>
                                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                                        <p className="text-gray-500">Price: ${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold">
                                    ${item.price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Total: ${totalCost.toFixed(2)}</h2>
                        <button
                            onClick={() => router.push("/checkout")}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
