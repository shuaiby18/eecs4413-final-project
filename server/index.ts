import { cartRouter } from "./routers/cart";
import { productRouter } from "./routers/products";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  product: productRouter,
  cart: cartRouter,
});

export type AppRouter = typeof appRouter;