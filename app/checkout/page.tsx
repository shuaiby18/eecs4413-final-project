// pages/checkout.tsx

"use client";

import { trpc } from "@/server/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export default function Checkout() {
    const router = useRouter();
    const [cartItems, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal'>('credit_card');
    const [creditCardInfo, setCreditCardInfo] = useState({
        number: '',
        expiMonth: '',
        expiYear: '',
        cvv: ''
    });
    const [paypalToken, setPaypalToken] = useState<string | null>(null);

    const { data: cartData, refetch, isError } = trpc.cart.getCart.useQuery();

    useEffect(() => {
        if (isError) {
            setError("Failed to fetch cart data");
            setLoading(false);
            return;
        }
        if (cartData) {
            setItems(cartData.items);
        }
        setLoading(false);
    }, [cartData, isError]);

    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        try {
            const orderInput = {
                items: cartItems,
                userId: 'some-user-id', // Replace with actual user ID
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    postalCode: '12345',
                    country: 'US',
                },
                paymentInfo: paymentMethod === 'credit_card' ? {
                    method: 'credit_card',
                    creditCard: {
                        number: creditCardInfo.number,
                        expiMonth: parseInt(creditCardInfo.expiMonth),
                        expiYear: parseInt(creditCardInfo.expiYear),
                        cvv: creditCardInfo.cvv,
                    }
                } : {
                    method: 'paypal',
                    paypalToken: paypalToken
                }
            };

            await trpc.checkout.createOrder.mutateAsync(orderInput);
            router.push("/order-success");
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
                    <div className="mt-6 flex flex-col space-y-4">
                        <h2 className="text-2xl font-bold">Total: ${totalCost.toFixed(2)}</h2>
                        <div>
                            <h3 className="text-xl font-semibold">Payment Method</h3>
                            <div className="flex space-x-4">
                                <label>
                                    <input
                                        type="radio"
                                        value="credit_card"
                                        checked={paymentMethod === 'credit_card'}
                                        onChange={() => setPaymentMethod('credit_card')}
                                    />
                                    Credit Card
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                    />
                                    PayPal
                                </label>
                            </div>
                        </div>
                        {paymentMethod === 'credit_card' && (
                            <div className="space-y-4">
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
                        )}
                        {paymentMethod === 'paypal' && (
                            <div className="space-y-4">
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: totalCost.toFixed(2)
                                                }
                                            }]
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        const order = await actions.order.capture();
                                        setPaypalToken(order.id); // Save PayPal token for the order
                                        await handleCheckout(); // Complete checkout
                                    }}
                                    onError={(err) => {
                                        console.error("PayPal error:", err);
                                        setError("Failed to process PayPal payment");
                                    }}
                                />
                            </div>
                        )}
                        <button
                            onClick={handleCheckout}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Complete Purchase
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
