"use client"

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/schemas/user";

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
import { trpc } from "@/server/client";

export default function Register() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const register = trpc.user.register.useMutation({
        onSuccess: (data) => {
            console.log("User registered successfully", data);
            router.push("/login");
        },
    });

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        startTransition(async () => {
            await register.mutateAsync({
                email: values.email,
                password: values.password,
                passwordConfirmation: values.passwordConfirmation
            });
        });
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            {/* Title */}
            <h1 className="text-4xl font-bold text-center mb-10">
                EECS 4413 Project
            </h1>

            {/* Signup Card */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign up</h1>
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
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Confirm Password</FormLabel>
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
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Form>
                <hr className="my-6" />
                <div className="text-center">
                    <p className="text-sm text-gray-600">Already have an account?</p>
                    <Button
                        onClick={() => router.push('/login')}
                        className="w-full mt-2 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </div>
    );
}
