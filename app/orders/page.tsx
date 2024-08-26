"use client";

import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { trpc } from "@/server/client";
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function Orders() {
    const { data: session } = useSession();

    const { data: ordersData, refetch, isError } = trpc.orders.getAllOrdersByUser.useQuery({
        userId: session?.user?.id
    });

    if (!session) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">Please sign in to view your orders</h1>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">An error occurred while fetching your orders</h1>
            </main>
        );
    }

    return (
        <>
            <Navbar />

            <main className="flex min-h-screen flex-col w-full items-center pt-32">
                <h1 className="text-4xl mb-8">Your Orders</h1>

                <div className="space-y-6 w-full max-w-4xl px-4"> {/* Updated width and padding */}
                    {ordersData?.map((sale) => {
                        const orderDate = new Date(sale.createdAt).toLocaleDateString("en-CA");
                        const totalCost = sale.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

                        return (
                            <Card key={sale.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-6"> {/* Increased padding for better spacing */}
                                    <div className="flex flex-row items-center justify-between space-y-0 pb-4"> {/* Updated padding */}
                                        <h3 className="text-lg font-semibold">Order: {sale.id}</h3>
                                        <div className="flex items-center space-x-4"> {/* Increased space between date and total */}
                                            <p className="text-sm text-gray-600">{orderDate}</p>
                                            <span className="text-lg font-bold">${totalCost}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-4"> {/* Increased spacing between items */}
                                        {sale.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md"> {/* Updated padding */}
                                                <div className="flex items-center space-x-4"> {/* Increased spacing between icon and text */}
                                                    <Package className="h-5 w-5 text-gray-500" /> {/* Slightly larger icon */}
                                                    <span className="text-sm font-medium">{item.product.name}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    ${item.product.price} x {item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </>
    );
}
