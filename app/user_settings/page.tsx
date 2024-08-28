//This is the section of the code that is responsible for the client accessing user settings
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { trpc } from "@/server/client";
import Navbar from "@/components/ui/Navbar";
import { signOut } from "next-auth/react";

// This component will handle user profile settings
export default function Profilepage() {
    const session = useSession();
    const router = useRouter();

    // If user is not found then do not render anything
    if (!session.data?.user?.email) {
        return null;
    }

    // Setup the form using react-hook-form
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            name: session.data.user.name ?? "",
        },
    });

    // Setup the TRPC mutation for updating the user's name
    const updateUser = trpc.user.update.useMutation();

    // Function to handle form submission
    const onSubmit = async (data: { name: string }) => {
        try {
          // Update the user's name in the database
          await updateUser.mutateAsync({
            name: data.name,
            email: session.data.user.email
          });
      
          // Sign the user out
          await signOut({ callbackUrl: "/login" });
        } catch (error) {
          console.error("Error updating name:", error);
        }
      };

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
                                placeholder="Your name"
                                {...register("name")}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={isSubmitting}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            disabled={isSubmitting}
                        >
                            Update Name
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
