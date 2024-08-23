import { router, publicProcedure } from '../trpc';
import { getSession } from "next-auth/react";
//import { auth } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
//import { prisma } from '@/lib/db'; 
import { z } from 'zod';

// Define the types for your cart items and formatted cart items
type CartItem = {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
};

type FormattedCartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const prisma = new PrismaClient();

export const cartRouter = router({
  getCart: publicProcedure.query(async ({ctx}) => {
    const session = await getSession(ctx);
    const userId = session?.user?.id; // Replace with actual user ID retrieval

    if(!userId){
      throw new Error("User is not authenticated");
    }
    // Fetch cart items for the current user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true, // Assuming `product` is a relation in your `cartItem` model
      },
    });

    // Format the response to match the expected FormattedCartItem type
    const formattedItems: FormattedCartItem[] = cartItems.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    // Calculate total cost
    const total = formattedItems.reduce((added, item) => added + (item.price * item.quantity), 0);

    return {
      items: formattedItems,
      total,
    };
  }),

  addItem: publicProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await getSession(ctx);
      const userId = session?.user?.id; // Replace with actual user ID retrieval

      if(!userId){
        throw new Error("User is not authenticated");
      }
      await prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId: input.itemId } },
        create: { userId, productId: input.itemId, quantity: 1 },
        update: { quantity: { increment: 1 } },
      });

      const cartItems: CartItem[] = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true,
        },
      });

      const formattedItems: FormattedCartItem[] = cartItems.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      return { success: true, items: formattedItems };
    }),

  removeItem: publicProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await getSession(ctx);
      const userId = session?.user?.id; // Replace with actual user ID retrieval

      if(!userId){
        throw new Error("User is not authenticated");
      }
      const cartItem = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId: input.itemId } },
      });

      if (!cartItem) return { success: false };

      if (cartItem.quantity > 1) {
        await prisma.cartItem.update({
          where: { userId_productId: { userId, productId: input.itemId } },
          data: { quantity: { decrement: 1 } },
        });
      } else {
        await prisma.cartItem.delete({
          where: { userId_productId: { userId, productId: input.itemId } },
        });
      }

      const cartItems: CartItem[] = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true,
        },
      });

      const formattedItems: FormattedCartItem[] = cartItems.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      return { success: true, items: formattedItems };
    }),
});

