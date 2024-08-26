import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

export const ordersRouter = router({
    getAllOrders: publicProcedure
        .query(async () => {
            console.log("ordersRouter:getAllOrders: Fetching all orders");

            let orders = await prisma.order.findMany({
                include: {  
                    items: {
                        include: {
                            product: true
                        }
                    }
                },
                take: 10
            })

            console.log(`ordersRouter:getAllOrders: orders length ${orders.length}`, orders[0]);

            return orders
        }),
}) 