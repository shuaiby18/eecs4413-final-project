import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { RegisterSchema, LoginSchema } from "@/lib/schemas/user";
import { AuthError } from "next-auth";

import { prisma } from "@/lib/db"

import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/user";
 
export const userRouter = router({
  ping: publicProcedure.query(() => {
    return "pong"
  }),
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async (opts) => {
      const { email, password } = opts.input;

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        return { error: "User email already exists." };
      }
    
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return { status: 201 }
    }),
});
 
// Export type router type signature,
// NOT the router itself.