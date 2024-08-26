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
    })

    if (!session) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">Please sign in to view your orders</h1>
            </main>
        )
    }

    if (isError) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">An error occurred while fetching your orders</h1>
            </main>
        )
    }

    return (
        <>
            <Navbar />

            <main className="flex min-h-screen flex-col w-full items-center pt-32">
                <h1 className="text-4xl">Your Orders</h1>

                <div className="space-y-4">
                    {ordersData?.map((sale) => {

                        const orderDate = new Date(sale.createdAt).toLocaleDateString("en-CA");
                        const totalCost = sale.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

                        return (
                            <Card key={sale.id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-4">
                                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <h3 className="text-md font-medium">Order: {sale.id}</h3>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm text-muted-foreground">{orderDate}</p>
                                            <span className="text-lg font-semibold">${totalCost}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-2">
                                        {sale.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                <div className="flex items-center space-x-2">
                                                    <Package className="h-4 w-4 text-gray-500" />
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
                        )
                    })}
                </div>
            </main>
        </>

    )
}