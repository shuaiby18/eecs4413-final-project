//page is to be used by client
"use client"

//importing states, trpcs, and navbar component
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import { trpc } from "@/server/client";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Package, UserCog, Trash2 } from "lucide-react"

export default function Page() {
    //state management variables
    const [confirm, setconfirm] = useState(false)

    //TRPC fetching user and orders 
    const { data: users, refetch, isLoading: isLoadingUsers, error: errorUsers } = trpc.user.getUsers.useQuery()
    const { data: orders, isLoading: isLoadingOrders, error: errorOrders } = trpc.orders.getAllOrders.useQuery()

    //a utility function for trpc calls 
    const utils = trpc.useUtils()

    //mutatation calls for deleeeeting 
    const { mutate: mutateDelete } = trpc.user.deleteUsers.useMutation({
        onSuccess() {
            utils.user.getUsers.invalidate()
        }
    })

    //mutations call for poromotting users
    const { mutate: mutatePromote } = trpc.user.promoteUsers.useMutation({
        onSuccess() {
            utils.user.getUsers.invalidate()
        }
    })

    //function call for changing the role of users
    const handleRoleChange = async (userId: string) => {
        await mutatePromote({ id: userId, admin: users?.find(user => user.id === userId)?.role === "USER" })
    }

    //function call for handling deleting of user
    const handleDeleteUser = async (userId: string) => {
        await mutateDelete({ id: userId })
    }

    //state error message when fetching data
    if (isLoadingUsers || isLoadingOrders) return "Loading...";
    if (errorUsers || errorOrders) return "An error has occurred";


    //render side of the html
    return (<main className="flex min-h-screen flex-col w-full items-center">
        {/* Navigation Bar */}
        <Navbar />

        {/* Padding added below Navbar */}
        {/* <div className="w-full px-4" >
            <Table>
                <TableHeader >
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(data ?? []).map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                {confirm ? (<Button onClick={function () {
                                    mutate({ id: user.id })
                                    setconfirm(false)
                                }} variant={"destructive"}>Are you sure?</Button>) : (<Button onClick={function () {
                                    setconfirm(true)
                                }} variant={"destructive"}>Delete</Button>)}

                                <Button onClick={function () {
                                    mutatePromote({ id: user.id, admin: user.role === "USER" })
                                }}>Change Role</Button></TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </div> */}

        <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 pt-14">
            {/* Sales History */}
            <div className="w-full md:w-2/3 p-6 overflow-auto">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sales History</h2>
                <div className="space-y-4">
                    {orders?.map((sale) => {

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
            </div>

            {/* User Control Panel */}
            <div className="w-full md:w-1/3 p-6 border-l border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Control Panel</h2>
                <div className="space-y-4">
                    {users?.map((user) => (
                        <Card key={user.id} className="bg-white shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                                        {user?.email?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{user.email}</h3>
                                        <p className="text-sm text-gray-500">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleRoleChange(user.id)}
                                        aria-label={`Change role to ${user.role === 'ADMIN' ? 'ADMIN' : 'USER'}`}
                                    >
                                        <UserCog className="h-4 w-4 mr-2" />
                                        Change Role
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleDeleteUser(user.id)}
                                        aria-label="Delete user"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    </main>)
}