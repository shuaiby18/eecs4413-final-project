import { router, publicProcedure } from '../trpc';
import { RegisterSchema, LoginSchema, UpdateSchema } from "@/lib/schemas/user";

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

    update: publicProcedure
    .input(UpdateSchema)
    .mutation(async (opts) => {
      const {name, email, password } = opts.input;

      

      const existingUser = await getUserByEmail(email);

      if (!existingUser) {
        
        return { error: "User does not exist" };
      }
      const data:{name:string,password?:string} =  { 
        name,
        
      }
      if (password){
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password =  hashedPassword
    }
      await prisma.user.update({
        where: {id:existingUser.id}, 
        data:data ,
      });

      return { status: 201 }
    }),
});
 
// Export type router type signature,
// NOT the router itself.