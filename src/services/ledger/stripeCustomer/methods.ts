import { stripe } from '@/lib/stripe'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'

// We have no reason to store Stripe customer ids in the database
// so this service only interfaces with the stripe API.

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
