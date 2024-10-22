import NextAuth, { DefaultSession } from "next-auth";
import bcrypt from "bcryptjs";

import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/user";
import { getUserByEmail } from "./user";

import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user?.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (await getUserByEmail(token?.email))?.id;
      session.user.role = token.role;
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
              email: user?.email,
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
