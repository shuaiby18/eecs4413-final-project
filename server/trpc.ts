/*import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Create the TRPC context
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts; // Extract req and res
  const session = await auth({ req, res }); // Pass req and res to auth

  return {
    prisma,
    req,
    res,
    session, // Include session in the context
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize TRPC
const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;*/

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