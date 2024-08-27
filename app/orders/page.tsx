//this page is to be used with client side
"use client";

//import the navbar, next authentication, trpc, session data
import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { trpc } from "@/server/client";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function Orders() {
    //session data will have three states, either loading, authenticated, or unauthenticated 
    const { data: session, status } = useSession(); 

    //establish user id from session data
    const userId = session?.user?.id;

    //fetch data only when the userId is defined and not anytime else
    const { data: ordersData, isError, isLoading } = trpc.orders.getAllOrdersByUser.useQuery(
        // Temporarily pass an empty string if userId is currently undefied undefined
        { userId: userId || "" }, 
        // Run the hook if the user ID is defined 
        { enabled: !!userId } 
    );

    //Just display a loadin message if currently loading status 
    if (status === "loading") {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">Loading...</h1>
            </main>
        );
    }

    //if the user id doesnt exist then just display please sign in to view order
    if (!userId) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">Please sign in to view your orders</h1>
            </main>
        );
    }

    //display an error state
    if (isError) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">An error occurred while fetching your orders</h1>
            </main>
        );
    }

    //display loading state
    if (isLoading) {
        return (
            <main className="flex min-h-screen flex-col w-full items-center">
                <Navbar />
                <h1 className="text-4xl">Loading orders...</h1>
            </main>
        );
    }

    //render side html code
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col w-full items-center pt-32 px-8">
                <h1 className="text-4xl mb-8">Your Orders</h1>
                <div className="space-y-6 w-full max-w-4xl">
                    {ordersData?.map((sale) => {
                        const orderDate = new Date(sale.createdAt).toLocaleDateString("en-CA");
                        const totalCost = sale.items.reduce(
                            (total, item) => total + item.product.price * item.quantity, 0
                        );

                        return (
                            <Card
                                key={sale.id}
                                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
                            >
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
                                        <h3 className="text-md font-medium">Order: {sale.id}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                            <p className="text-sm text-gray-500">{orderDate}</p>
                                            <span className="text-lg font-semibold">${totalCost.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {sale.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                                                <div className="flex items-center space-x-4">
                                                    <Package className="h-6 w-6 text-gray-500" />
                                                    <span className="text-sm font-medium">{item.product.name}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    ${item.product.price.toFixed(2)} x {item.quantity}
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