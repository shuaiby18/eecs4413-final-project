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
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: cartData, refetch, isError } = trpc.cart.getCart.useQuery();

    const addItemMutation = trpc.cart.addItem.useMutation({
        onSuccess: () => {
            refetch(); // Refetch the cart data after successful mutation
        },
        onError: (error) => {
            console.error("Failed to add item", error);
            setError("Failed to add item");
        }
    });

    const removeItemMutation = trpc.cart.removeItem.useMutation({
        onSuccess: () => {
            refetch(); // Refetch the cart data after successful mutation
        },
        onError: (error) => {
            console.error("Failed to remove item", error);
            setError("Failed to remove item");
        }
    });

    useEffect(() => {
        if(isError){
            setError("Failed to fetch cart data");
            setLoading(false);
            return;
        }
        if (cartData) {
            setItems(cartData.items);
        }
        setLoading(false);
    }, [cartData, isError]);

    const addItem = async (itemId: string) => {
        await addItemMutation.mutateAsync({ itemId });
    };

    const removeItem = async (itemId: string) => {
        await removeItemMutation.mutateAsync({ itemId });
    };

    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-center mb-6">Shopping Cart</h1>
        {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
            <p className="text-center text-red-600">{error}</p>
        ) : cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty</p>
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
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => addItem(item.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
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

