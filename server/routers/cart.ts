import { router, publicProcedure } from '../trpc';
import { prisma } from "@/lib/db";
import { z } from "zod";

type CartItemType = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };

export const cartRouter = router({
  getCart: publicProcedure.query(async () => {
    //change with whatever ends up being the method to pull userId.
    const userId = 'some id';

    // Fetch cart items for the current user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: userId },
      include: {
        product: true, // Assuming `product` is a relation in your `cartItem` model
      },
    });

    // Format the response to match the expected CartItem type
    const formattedItems = cartItems.map((item: { id: any; product: { name: any; price: any; image: any; }; quantity: any; }) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    // Calculate total cost
    const total = formattedItems.reduce((added: number, item: { price: number; quantity: number; }) => added + (item.price * item.quantity), 0);

    return {
      items: formattedItems,
      total,
    };
  }),
});