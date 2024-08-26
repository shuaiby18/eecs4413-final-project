import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (session?.user.role != "ADMIN") {
    redirect("/")
  }
  return (

    <SessionProvider session={session}>
      <div className="flex items-center justify-center mx-4 my-6 lg:mt-20">
        {children}
      </div>
    </SessionProvider>
  );
}