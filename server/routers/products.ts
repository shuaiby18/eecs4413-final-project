import { router, publicProcedure } from '../trpc';
import { RegisterSchema, LoginSchema } from "@/lib/schemas/user";
import { z } from "zod"
import { prisma } from "@/lib/db"

export const productRouter = router({
    ping: publicProcedure.query(() => {
      return "pong"
    }),
    getAll: publicProcedure
      .query(async () => {
          let products = await prisma.product.findMany({
            include: {
              category: true,
            },
            orderBy: {
              price: 'desc'
            }
          })

          return products
      }),
    getById: publicProcedure
      .input(
        z.object({id: z.number()})
      )
      .query(async (opts) => {
        let { input } = opts

        let product = await prisma.product.findUnique({
          where: {
            id: input.id
          },
        })

        return 
      })
  });