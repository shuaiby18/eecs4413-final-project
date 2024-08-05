import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from '@/lib/auth';
import { prisma } from "@/lib/db"

// export const createContext = async (opts: CreateNextContextOptions) => {
//   const session = await auth();

//   return {
//     prisma,
//     session
//   };
// };

// type Context = Awaited<ReturnType<typeof createContext>>;

const trpc = initTRPC.create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
// export const protectedProcedure = publicProcedure.use(async (opts) => {
//   const session = await auth();

//   if (!session?.user?.email) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//   return opts.next({
//     ctx: {
//       session: session,
//     },
//   });
// });