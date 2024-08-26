import { cartRouter } from "./routers/cart";
import { checkoutRouter } from "./routers/checkout";
import { modelsRouter } from "./routers/models";
import { ordersRouter } from "./routers/orders";
import { productRouter } from "./routers/products";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  product: productRouter,
  cart: cartRouter,
  checkout: checkoutRouter,
  orders: ordersRouter,
  models: modelsRouter,
});

export type AppRouter = typeof appRouter;