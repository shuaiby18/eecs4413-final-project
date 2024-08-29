"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { trpc } from "@/server/client";
import Navbar from "@/components/ui/Navbar";
import { signOut } from "next-auth/react";

// Define the form data type to include password fields
interface FormData {
    name: string;
    password?: string;
    passwordConfirmation?: string;
}

// This component will handle user profile settings
export default function Profilepage() {
    const session = useSession();
    const router = useRouter();

    // Setup the form using react-hook-form
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
        defaultValues: {
            name: session.data?.user?.name ?? "",
        },
    });

    // Setup the TRPC mutation for updating the user's data
    const updateUser = trpc.user.update.useMutation();

    // Function to handle form submission
    const onSubmit = async (data: FormData) => {
        if (session.data?.user?.email) {
            try {
                // Ensure the password and password confirmation match before proceeding
                if (data.password && data.password !== data.passwordConfirmation) {
                    alert("Passwords do not match.");
                    return;
                }

                // Update the user's data in the database
                await updateUser.mutateAsync({
                    name: data.name,
                    email: session.data.user.email,
                    password: data.password || "", // Send password if provided
                    passwordConfirmation: data.passwordConfirmation || "", // Send password confirmation if provided
                });

                // Sign the user out after updating the name or password
                await signOut({ callbackUrl: "/login" });
            } catch (error) {
                console.error("Error updating user data:", error);
            }
        } else {
            console.error("Session data is null or undefined.");
        }
    };

    // If user is not found then do not render anything
    if (!session.data?.user?.email) {
        return null;
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-center mt-12 mb-20">User Settings</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="font-semibold">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your new name"
                                {...register("name")}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Email</label>
                            <input
                                type="email"
                                value={session.data.user.email}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
                                disabled
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Current Password</label>
                            <input
                                type="password"
                                value="********" // Masked for security, typically you don't show the actual password
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
                                disabled
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="font-semibold">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                {...register("password")}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your new password"
                                {...register("passwordConfirmation")}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={isSubmitting}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            disabled={isSubmitting}
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
