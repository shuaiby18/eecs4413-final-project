import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from '@/lib/auth';

const trpc = initTRPC.create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = publicProcedure.use(async (opts) => {
    const { ctx } = opts;

    const session = await auth();

    if (!session?.user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
      ctx: {
        session: session,
      },
    });
  });