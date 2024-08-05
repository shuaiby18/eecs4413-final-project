import { productRouter } from "./routers/products";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;