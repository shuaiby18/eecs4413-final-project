import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "@/lib/db";

import { auth } from "@/lib/auth";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const { req, res } = ctx;

  const session =
    req && res && (await auth());

  return {
    req,
    res,
    prisma,
    session
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;