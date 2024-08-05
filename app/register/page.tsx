"use client"

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/lib/schemas/user"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { trpc } from "@/server/client";

export default function Register() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()
    let register = trpc.user.register.useMutation()
    
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    })

    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        startTransition(async () => {
           let result = await register.mutateAsync({
                email: values.email,
                password: values.password,
                passwordConfirmation: values.passwordConfirmation
            })

            if (result.status === 201) {
                router.push("/login");
              }
        })         
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Sign up using your email and password.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="yusufahmed123@gmail.com" 
                                            type="email" 
                                            disabled={isPending}
                                            {...field} 
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            disabled={isPending}
                                            required 
                                            {...field} 
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
                                    <FormLabel>Confirmation Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password" 
                                            disabled={isPending}
                                            required 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Submit</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}