"use client"

//import TRPC router, states, and route for navigation
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useTransition, Suspense } from "react";
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Login />
        </Suspense>
    );
}

//function call for logging in 
function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //stay in login page if we cant login
    const callbackUrl = searchParams.get("callbackUrl") || "/login"; 

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            callbackUrl: callbackUrl
        },
    });


// on submit function for creating credentials
async function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log("Attempting to sign in with values:", values);

    const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Prevent automatic redirect
    });

    console.log("Sign in response:", response);

    if (response) {
        const { ok, error, url } = response;

        // Check if there is an error or the sign-in was not successful
        if (ok && !error) {
            // Wait to see session established
            await new Promise((resolve) => setTimeout(resolve, 500)); 

            // Handle the callback URL explicitly
            if (url && url.includes("login")) {
                console.log("redirect home page");
                router.push("/"); // Redirect to home page 
            } else {
                console.log("Session establihed and going to home page", url || "/");
                router.push(url || "/"); 
            }
        } else {
            console.error("Login failed:", error); 
            alert("Invalid credentials. Please try again."); 
        }
    } else {
        console.error("signing in shows blank");
    }
}



    //returns render side for the html for login
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-10">
                EECS 4413 Project
            </h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign in</h1>
                <Form {...form}>
                    {/* call the onsubmit button */}
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
                        <Button
                            type="submit"
                            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
                        >
                            Continue
                        </Button>
                    </form>
                </Form>
                <hr className="my-6" />
                <div className="text-center">
                    <p className="text-sm text-gray-600">New customer?</p>
                    <Button
                        onClick={() => router.push('/register')}
                        className="w-full mt-2 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
                    >
                        Create account
                    </Button>
                </div>
            </div>
        </div>
    );
}