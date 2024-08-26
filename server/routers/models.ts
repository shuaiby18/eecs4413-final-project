import { get } from "http";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const modelsRouter = router({
  getAllModels: publicProcedure.query(async () => {
    try {
      console.log("modelsRouter:getAllModels");

      const models = await prisma.product.findMany({
        include: {
          category: true, // Ensure we're including the related category
        },
      });

      console.log(
        `modelsRouter:getAllModels models ${models.length}`,
        models[0]
      );

      return models;
    } catch (error) {
      console.log("modelsRouter:getAllModels error", error);
    }
  }),
  getModelById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        console.log("modelsRouter:getModelById", input.id);

        const model = await prisma.product.findUnique({
          where: { id: input.id },
          include: {
            category: true, // Ensure we're including the related category
          },
        });

        console.log("modelsRouter:getModelById model", model);

        return model;
      } catch (error) {
        console.log("modelsRouter:getModelById error", error);
      }
    })
});
