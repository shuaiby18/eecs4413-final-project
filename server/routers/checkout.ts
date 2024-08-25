import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

export const checkoutRouter = router({
  prepareOrder: publicProcedure
    .output(z.string())
    .mutation(async () => {
        try {
        const session = await auth();
        console.log("checkoutRouter:prepareOrder: session", session);
        const userId = session?.user?.id; // Replace with actual user ID retrieval
        console.log("checkoutRouter:prepareOrder: userId", userId);

        if (!userId) {
            console.log("checkoutRouter:prepareOrder: User is not authenticated");
            throw new Error("User is not authenticated");
        }

        console.log("checkoutRouter:prepareOrder: userId", userId);

        let { id: orderId } = await prisma.order.create({
            data: {
            userId,
            checkouted: true,
            },
            select: {
            id: true,
            },
        });

        console.log("checkoutRouter:prepareOrder: orderId", orderId);

        await prisma.cartItem.updateMany({
            where: {
            userId,
            orderId: null,
            },
            data: {
            orderId,
            },
        });

        console.log("checkoutRouter:prepareOrder: cartItems updated");

        return orderId;
        } catch (error) {
        console.error("Failed to prepare order:", error);
        throw new Error("Failed to prepare order");
        }
    }),
  completeOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        shippingAddress: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        creditCardInfo: z.object({
          number: z.number(),
          expiMonth: z.number(),
          expiYear: z.number(),
          cvv: z.number(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const session = await auth();
        console.log("checkoutRouter:prepareOrder: session", session);
        const userId = session?.user?.id; // Replace with actual user ID retrieval
        console.log("checkoutRouter:prepareOrder: userId", userId);

        if (!userId) {
          console.log("checkoutRouter:prepareOrder: User is not authenticated");
          throw new Error("User is not authenticated");
        }

        console.log("checkoutRouter:prepareOrder: userId", userId);

        let { id: shippingAddressId } = await prisma.shippingAddress.create({
          data: {
            street: input.shippingAddress.street,
            city: input.shippingAddress.city,
            state: input.shippingAddress.state,
            postalCode: input.shippingAddress.postalCode,
            country: input.shippingAddress.country,
          },
          select: {
            id: true,
          },
        });

        let { id: paymentInfoId } = await prisma.creditCardInfo.create({
          data: {
            number: input.creditCardInfo.number.toString(),
            expiMonth: input.creditCardInfo.expiMonth,
            expiYear: input.creditCardInfo.expiYear,
            cvv: input.creditCardInfo.cvv,
          },
          select: {
            id: true,
          },
        });

        await prisma.order.update({
          where: {
            id: input.orderId.toString(),
          },
          data: {
            shippingAddressId,
            paymentInfoId,
          },
        });
      } catch (error) {
        console.error(
          "checkoutRouter:prepareOrder: Error complete order:",
          error
        );
        throw new Error(
          "checkoutRouter:prepareOrder: Failed to complete order"
        );
      }
    }),
});
