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

export default function Checkout({ params }: { params: { order_id: string } }) {
    const router = useRouter();
    const [cartItems, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [billingAddress, setBillingAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });
    const [creditCardInfo, setCreditCardInfo] = useState({
        number: '',
        expiMonth: '',
        expiYear: '',
        cvv: ''
    });

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
                shippingAddress: billingAddress,  // Use the user-provided billing address
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
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (
                <div className="w-full max-w-lg">
                    {/* Billing/Shipping Address Form */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={billingAddress.street}
                                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                                className="p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={billingAddress.city}
                                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                                className="p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={billingAddress.state}
                                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                                className="p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={billingAddress.postalCode}
                                onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                                className="p-2 border rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={billingAddress.country}
                                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Total: ${totalCost.toFixed(2)}</h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Payment Method</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    value={creditCardInfo.number}
                                    onChange={(e) => setCreditCardInfo({ ...creditCardInfo, number: e.target.value })}
                                    className="p-2 border rounded w-full"
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="MM"
                                        value={creditCardInfo.expiMonth}
                                        onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiMonth: e.target.value })}
                                        className="p-2 border rounded w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="YY"
                                        value={creditCardInfo.expiYear}
                                        onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiYear: e.target.value })}
                                        className="p-2 border rounded w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={creditCardInfo.cvv}
                                        onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
                                        className="p-2 border rounded w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Complete Purchase
                    </button>

                    <div className="mt-6 flex justify-between space-x-4">
                        <a
                            href="/cart"
                            className="text-blue-500 hover:underline"
                        >
                            Back to Cart
                        </a>
                        <a
                            href="/searchResults"
                            className="text-blue-500 hover:underline"
                        >
                            Continue Shopping
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
