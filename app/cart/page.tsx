"use client";

import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    thumbnail: string;
};

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: cartData, refetch, isError } = trpc.cart.getCart.useQuery({});
    const addItemMutation = trpc.cart.addItem.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("Failed to add item", error);
            setError("Failed to add item");
        }
    });

    const removeItemMutation = trpc.cart.removeItem.useMutation({
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("Failed to remove item", error);
            setError("Failed to remove item");
        }
    });

    const prepareOrder = trpc.checkout.prepareOrder.useMutation({
        onSuccess: (data) => {
            console.log("Order prepared successfully", data);
        },
        onError: (error) => {
            console.error("Failed to prepare order", error);
            setError("Failed to prepare order");
        }
    });

    useEffect(() => {
        if (isError) {
            setError("Failed to load cart data.");
            setLoading(false);
        } else if (cartData) {
            setCartItems(cartData.items);
            setLoading(false);
        }
    }, [cartData, isError]);

    const handleAddItem = async (productId: number) => {
        // Optimistically update the cart items locally
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      
        // Perform the mutation on the server
        await addItemMutation.mutateAsync({ productId });
      };
      
      const handleRemoveItem = async (productId: number) => {
        // Optimistically update the cart items locally
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === productId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      
        // Perform the mutation on the server
        await removeItemMutation.mutateAsync({ productId });
      };
    

    

    const goToCheckout = async () => {
        console.log("Proceeding to checkout...");
        try {
            let orderId = await prepareOrder.mutateAsync();
            router.push(`/checkout/${orderId}`);
        } catch (error) {
            console.error("Error proceeding to checkout", error);
        }
    };

    // Calculate subtotal, totalItems, tax, and total
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold pl-6">Shopping Cart</h1>
                <h2 className="text-3xl font-bold" style={{ marginRight: '10rem', marginLeft: '-8rem' }}>Order Summary</h2>
            </div>

            <div className="flex justify-between">
                <div className="w-2/3 bg-white shadow-md rounded-lg p-6">
                    <div className="grid grid-cols-6 gap-4 px-6 py-4 text-gray-600 font-semibold border-b bg-gray-100">
                        <span className="col-span-3">Product Details</span>
                        <span className="text-center">Quantity</span>
                        <span className="text-center">Price</span>
                        <span className="text-center">Total</span>
                    </div>

                    <div className="h-[18rem] overflow-y-auto custom-scrollbar">
                        {cartItems.length === 0 ? (
                            <p className="p-6 text-gray-500">Your cart is empty.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.product_id} className="grid grid-cols-6 gap-4 px-6 py-4 items-center border-b">
                                    <div className="flex items-center space-x-4 col-span-3">
                                        <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <h4 className="text-lg font-semibold">{item.name}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => handleRemoveItem(item.product_id)} className="px-2 py-1 bg-gray-200 rounded" disabled={item.quantity <= 1}>
                                            -
                                        </button>
                                        <input type="text" readOnly value={item.quantity} className="mx-2 w-10 text-center border rounded" />
                                        <button onClick={() => handleAddItem(item.product_id)} className="px-2 py-1 bg-gray-200 rounded">
                                            +
                                        </button>
                                    </div>
                                    <p className="text-lg font-semibold text-center">${item.price.toFixed(2)}</p>
                                    <p className="text-lg font-semibold text-center">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-1/3 bg-white shadow-md rounded-lg p-6 sticky top-24 ml-6 flex flex-col justify-between h-[24rem]">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">Your cart contains {totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div className="flex justify-between mb-4">
                            <p>Subtotal:</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between mb-4">
                            <p>Tax:</p>
                            <p>${tax.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mb-6">
                            <p>Total:</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                    </div>
                    <button onClick={goToCheckout} className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-auto" disabled={cartItems.length === 0}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <a href="/searchResults" className="text-purple-600 hover:underline inline-flex items-center">
                    ← Continue Shopping
                </a>
            </div>
        </div>
    );
}
