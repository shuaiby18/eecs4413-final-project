"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schemas/user";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Login() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            callbackUrl: "/dashboard"
        },
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) {
        signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: values.callbackUrl
        });
    }

    const handleCreateAccount = () => {
        router.push('/register');
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            {/* Title */}
            <h1 className="text-4xl font-bold text-center mb-10">
                EECS 4413 Project
            </h1>

            {/* Login Card */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign in</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">E-mail address</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="you@example.com" 
                                            type="email"
                                            disabled={isPending}
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password" 
                                            disabled={isPending} 
                                            required 
                                            {...field} 
                                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <Button 
                                type="submit" 
                                className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
                <hr className="my-6"/>
                <div className="text-center">
                    <p className="text-sm text-gray-600">New customer?</p>
                    <Button 
                        onClick={handleCreateAccount} 
                        className="w-full mt-2 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
                    >
                        Create account
                    </Button>
                </div>
            </div>
        </div>
    );
}
