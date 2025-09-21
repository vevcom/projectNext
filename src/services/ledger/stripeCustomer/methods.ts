import { stripe } from "@/lib/stripe";
import { serviceMethod } from "@/services/serviceMethod";
import { z } from "zod";

export namespace StripeCustomerMethods {
    export const create = serviceMethod({
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ params: { userId }, prisma }) => {
            const user = await prisma.user.findUniqueOrThrow({
                where: { id: userId },
                select: { firstname: true, lastname: true, email: true, emailVerified: true, }
            })
            // Check if customer already exists

            stripe.customers.create({
                email,
            })
        },
    })

    export const readOrCreate = serviceMethod({
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ params }) => {
            
        }
    })
}