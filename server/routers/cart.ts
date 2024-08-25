import { router, publicProcedure } from "../trpc";
import { auth } from "@/lib/auth";
//import { PrismaClient } from '@prisma/client';
import { prisma } from "@/lib/db";
import { z } from "zod";

// Define the types for your cart items and formatted cart items
type CartItem = {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    thumbnail: string;
  };
};

type FormattedCartItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

export const cartRouter = router({
  getCart: publicProcedure.query(async ({ ctx }) => {
    try {
      const session = await auth();
      console.log("cartRouter:getCart: session", session);
      const userId = session?.user?.id; // Replace with actual user ID retrieval
      console.log("cartRouter:getCart: userId", userId);

      if (!userId) {
        console.log("cartRouter:getCart: User is not authenticated");
        throw new Error("User is not authenticated");
      }

      // Fetch cart items for the current user
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true, // Assuming `product` is a relation in your `cartItem` model
        },
      });

      console.log("cartRouter:getCart: cartItems length", cartItems.length);

      // Format the response to match the expected FormattedCartItem type
      const formattedItems: FormattedCartItem[] = cartItems.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        thumbnail: item.product.thumbnail,
      }));

      console.log(
        "cartRouter:getCart: formattedItems length",
        formattedItems.length
      );

      // Calculate total cost
      const total = formattedItems.reduce(
        (added, item) => added + item.price * item.quantity,
        0
      );

      console.log("cartRouter:getCart: total", total);

      return {
        items: formattedItems,
        total,
      };
    } catch (error) {
      console.log("cartRouter:getCart: error", error);
    }
  }),

  addItem: publicProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await auth();
        console.log("cartRouter:addItem: session", session);
        const userId = session?.user?.id;
        console.log("cartRouter:addItem: userId", userId);

        if (!userId) {
          console.log("cartRouter:addItem: User is not authenticated");
          throw new Error("User is not authenticated");
        }

        console.log("cartRouter:addItem: input.itemId", input.productId);

        await prisma.cartItem.upsert({
          where: {
            userId_productId: { userId, productId: input.productId },
          },
          create: { userId, productId: input.productId, quantity: 1 },
          update: { quantity: { increment: 1 } },
        });

        console.log("cartRouter:addItem: cartItem added successfully");

        const cartItems: CartItem[] = await prisma.cartItem.findMany({
          where: { userId },
          include: {
            product: true, // Assuming `product` is a relation in your `cartItem` model
          },
        });

        console.log(
          `cartRouter:addItem: cartItems ${cartItems.length}`,
          cartItems[0]
        );

        const formattedItems: FormattedCartItem[] = cartItems.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          thumbnail: item.product.thumbnail,
        }));

        console.log(
          `cartRouter:addItem: formattedItems ${formattedItems.length}`,
          formattedItems[0]
        );

        return { success: true, items: formattedItems };
      } catch (e) {
        console.log("cartRouter:addItem: error", e);
      }
    }),

  removeItem: publicProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await auth();
        console.log("cartRouter:removeItem: session", session);
        const userId = session?.user?.id;
        console.log("cartRouter:removeItem: userId", userId);

        if (!userId) {
          console.log("cartRouter:removeItem: User is not authenticated");
          throw new Error("User is not authenticated");
        }

        console.log("cartRouter:removeItem: input.productId", input.productId);

        const cartItem = await prisma.cartItem.findUnique({
          where: {
            userId_productId: { userId, productId: input.productId },
          },
        });

        console.log("cartRouter:removeItem: cartItem", cartItem);

        if (!cartItem) return { success: false };

        console.log(
          "cartRouter:removeItem: cartItem.quantity",
          cartItem.quantity
        );

        if (cartItem.quantity > 1) {
          await prisma.cartItem.update({
            where: {
              userId_productId: { userId, productId: input.productId },
            },
            data: { quantity: { decrement: 1 } },
          });
        } else {
          await prisma.cartItem.delete({
            where: {
              userId_productId: { userId, productId: input.productId },
            },
          });
        }

        console.log("cartRouter:removeItem: cartItem removed successfully");

        const cartItems: CartItem[] = await prisma.cartItem.findMany({
          where: { userId },
          include: {
            product: true, // Assuming `product` is a relation in your `cartItem` model
          },
        });

        console.log(
          `cartRouter:removeItem: cartItems ${cartItems.length}`,
          cartItems[0]
        );

        const formattedItems: FormattedCartItem[] = cartItems.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          thumbnail: item.product.thumbnail,
        }));

        return { success: true, items: formattedItems };
      } catch (e) {
        console.log("cartRouter:removeItem: error", e);
      }
    }),
});
