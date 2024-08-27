"use client";

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

export default function Profilepage() {
    const session = useSession();
    if (!session.data?.user?.email) {
        return null;
    }

    return <Profile session={session.data} />;
}

function Profile({ session }: { session: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const email = session?.user?.email ?? "";
    const update = trpc.user.update.useMutation();

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

    async function onSubmit(values: any) {
        startTransition(async () => {
            await update.mutateAsync(values);
            router.push("/");
        });
    }

    return (
        <div>
            <Navbar />

            <h1 className="text-4xl font-bold text-center mt-12 mb-20">User Settings</h1> {/* Header */}

            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* User Name */}
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
                            {/* Email (Disabled) */}
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
                            {/* Password */}
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
                            {/* Shipping Address */}
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