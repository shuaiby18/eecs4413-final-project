//This is the section of the code that is responsible for the client accessing user settings
"use client";

// Import the routers, states, zod, trpc for queries, and navbar 
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSchema } from "@/lib/schemas/user";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/server/client";
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/Navbar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

//This is the section responsible for calling the profile page
export default function Profilepage() {
    //Utilize user session data using NextAuth
    const session = useSession();

    //If use is not found then done do anything
    if (!session.data?.user?.email) {
        return null;
    }
    //Create the profile utilizing the session data that was retrieved
    return <Profile session={session.data} />;
}

//This component will handle user profile settings
function Profile({ session }: { session: any }) {
    //Create the router that will be used for navigation
    const router = useRouter();

    //This will create states for pending and starting transition
    const [isPending, startTransition] = useTransition();

    //retreive user email from session
    const email = session?.user?.email ?? "";
    
    //this will set up trpc mutation call
    const update = trpc.user.update.useMutation();

    //establish the form
    const form = useForm({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
            password: "",
            shippingAddress: {
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            },
        },
    });

    //this function will manage submitting a form
    async function onSubmit(values: any) {
        startTransition(async () => {
            await update.mutateAsync(values);
            router.push("/");
        });
    }

    //html code for rendering profile section
    return (
        <div>
            <Navbar />

            <h1 className="text-4xl font-bold text-center mt-12 mb-20">User Settings</h1> {/* Header */}

            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <Form {...form}>
                        {/* call the onSubmit function */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/*Section for User Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder="Josh"
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*Section for Email (Disabled) */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">E-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="example@email.com"
                                                disabled
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*Section for Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                disabled={isPending}
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*Section for Shipping Address */}
                            <FormField
                                control={form.control}
                                name="shippingAddress.street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Street</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                disabled={isPending}
                                                placeholder="123 York University St"
                                                required
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shippingAddress.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">City</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                disabled={isPending}
                                                placeholder="Vaughan"
                                                required
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shippingAddress.state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">State</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                disabled={isPending}
                                                placeholder="Ontario"
                                                required
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shippingAddress.postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Postal Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                disabled={isPending}
                                                placeholder="M1C 21A"
                                                required
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shippingAddress.country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                disabled={isPending}
                                                placeholder="Canada"
                                                required
                                                {...field}
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Update
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
