

"use client"

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSchema } from "@/lib/schemas/user";

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
import { useSession } from "next-auth/react";
import Navbar from "@/components/ui/Navbar";
import { Session } from "next-auth";

export default function Profilepage() {
    const session = useSession()
    if(!session.data?.user?.email){
        return null}

    return <Profile session = {session.data}></Profile>
    }
 function Profile({session}:{session:Session}) {
    


    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const update = trpc.user.update.useMutation();
    
   



    
    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            name: session?.user?.name??"",
            email: session?.user?.email??"",
            password: "",
            passwordConfirmation: "",
        },
    });

    async function onSubmit(values: z.infer<typeof UpdateSchema>) {
        startTransition(async () => {
           const result = await update.mutateAsync({
                name: values.name,
                email: values.email,
                password: values.password,
                passwordConfirmation: values.passwordConfirmation
            });

            if (result.status === 201) {
                router.push("/login");
            }
        });         
    }

    return (
       
        <main className="flex min-h-screen flex-col items-center pt-32">
        {/* Navigation Bar */}
        <Navbar />
  
        {/* Padding added below Navbar */}
        <div className="mt-4 w-full"></div> {/* Adds margin-top of 1rem (4 * 0.25rem) */}
  <div className="w-full px-4 w-1/3" >
        <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="your name" 
                                            type="text" 
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">E-mail address</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="you@example.com" 
                                            type="email" 
                                            disabled={true}
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
                                    <FormLabel className="font-semibold">New Password</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Confirm New Password</FormLabel>
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
                        <div className="space-y-4">
                            <Button 
                                type="submit" 
                                className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
                            >
                                
                                Update profile
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
      </main>

    );
}
