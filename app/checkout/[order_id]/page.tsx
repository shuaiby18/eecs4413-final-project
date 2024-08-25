// pages/checkout.tsx

"use client";

import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    thumbnail: string;
};

export default function Checkout({ params }: { params: { order_id: string } }) {
    const router = useRouter();
    const [cartItems, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creditCardInfo, setCreditCardInfo] = useState({
        number: '',
        expiMonth: '',
        expiYear: '',
        cvv: ''
    });
    const [paypalToken, setPaypalToken] = useState<string | null>(null);

    const { data: cartData, refetch, isError } = trpc.cart.getCart.useQuery({ orderId: params.order_id });

    useEffect(() => {
        if (isError) {
            setError("Failed to fetch cart data");
            setLoading(false);
            return;
        }
        if (cartData) {
            setItems(cartData?.items);
        }
        setLoading(false);
    }, [cartData, isError]);

    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const completeOrder = trpc.checkout.completeOrder.useMutation({
        onSuccess: (data) => {
            console.log("order complete successfully", data);
        },
        onError: (error) => {
            console.error("Failed complete order", error);
            setError("Failed to complete order");
        }
    });

    const handleCheckout = async () => {
        try {
            const orderInput = {
                orderId: params.order_id,
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    postalCode: '12345',
                    country: 'US',
                },
                creditCardInfo: {
                    number: parseInt(creditCardInfo.number),
                    expiMonth: parseInt(creditCardInfo.expiMonth),
                    expiYear: parseInt(creditCardInfo.expiYear),
                    cvv: parseInt(creditCardInfo.cvv)
                }
            };

            await completeOrder.mutateAsync(orderInput);
            router.push("/");
        } catch (error) {
            console.error("Failed to complete checkout:", error);
            setError("Failed to complete checkout");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-6">Checkout</h1>
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
                                key={item.product_id}
                                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={item.thumbnail}
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
                    <div className="mt-6 flex flex-col space-y-4">
                        <h2 className="text-2xl font-bold">Total: ${totalCost.toFixed(2)}</h2>
                        <div>
                            <h3 className="text-xl font-semibold">Payment Method</h3>
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={creditCardInfo.number}
                                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, number: e.target.value })}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="MM"
                                value={creditCardInfo.expiMonth}
                                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiMonth: e.target.value })}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="YY"
                                value={creditCardInfo.expiYear}
                                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiYear: e.target.value })}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={creditCardInfo.cvv}
                                onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Complete Purchase
                    </button>
                </>
            )
            }
        </div >
    );
}
