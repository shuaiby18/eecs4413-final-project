import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/db'; 
import { z } from 'zod';

export const checkoutRouter = router({
    createOrder: publicProcedure
    .input(z.object({
        items: z.array(z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            image: z.string(),
        })),
        userId: z.string(),
        shippingAddress: z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            postalCode: z.string(),
            country: z.string(),
        }),
        paymentInfo: z.object({
            method: z.enum(['credit_card', 'paypal']),
            creditCard: z.object({
                number: z.string().optional(),
                expiMonth: z.number().optional(),
                expiYear: z.number().optional(),
                cvv: z.string().optional(),
            }).optional(),
            paypalToken: z.string().optional(),
        }),
    }))
    .mutation(async ({ input }) => {
        try {
            if (input.paymentInfo.method === 'credit_card') {
                if (!input.paymentInfo.creditCard?.number) {
                    throw new Error('Credit Card Information Required');
                }
                
            } else if (input.paymentInfo.method === 'paypal') {
                if (!input.paymentInfo.paypalToken) {
                    throw new Error('PayPal token is required');
                }
            } else {
                throw new Error('Invalid payment method');
            }

            const order = await prisma.order.create({
                data: {
                    userId: input.userId,
                    shippingAddress: {
                        create: input.shippingAddress
                    },
                    items: {
                        create: input.items.map(item => ({
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image,
                        })),
                    },
                    paymentMethod: input.paymentInfo.method,
                    paymentInfo: input.paymentInfo.method === 'credit_card' ? {
                        creditCard: {
                            number: input.paymentInfo.creditCard?.number,
                            expiMonth: input.paymentInfo.creditCard?.expiMonth,
                            expiYear: input.paymentInfo.creditCard?.expiYear,
                            cvv: input.paymentInfo.creditCard?.cvv,
                        },
                    } : input.paymentInfo.method === 'paypal' ? {
                        paypalToken: input.paymentInfo.paypalToken,
                    } : undefined,
                },
            });

            return order;
        } catch (error) {
            console.error("Error creating order:", error);
            throw new Error("Failed to create order");
        }
    }),
});
