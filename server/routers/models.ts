import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/db";

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
});
