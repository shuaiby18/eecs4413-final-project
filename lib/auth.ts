import NextAuth from "next-auth";
import bcrypt from "bcryptjs";

import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/user";
import { getUserByEmail } from "./user";

import { prisma } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email as string;
        token.role = user.role;
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        const userId = await getUserByEmail(token.email).then((user) => user?.id);

        if (userId) {
          return {
            ...session,
            user: {
              ...session.user,
              id: userId,
              role: token.role, // role is expected to be a string
            },
          };
        }        
      }


      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              name: user?.name,
              email: user.email,
              role: user?.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
});
