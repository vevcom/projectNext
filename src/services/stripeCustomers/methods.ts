import { stripe } from '@/lib/stripe'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'
import { ServerError } from '../error'
import { RequireUserId } from '@/auth/auther/RequireUserId'

export namespace StripeCustomerMethods {
    /**
     * If a user already has a Stripe customer associated it is returned.
     * Otherwise, a new customer is created, associated in the DB, and returned.
     */
    export const readOrCreate = serviceMethod({
        // No one should ever be able to retrieve the customer id of another user. NOT EVEN ADMINS!
        authorizer: ({ params: { userId } }) => RequireUserId.staticFields({}).dynamicFields({ userId }),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ params: { userId }, prisma }) => {
            // We query the user table and not the StripeCustomer table here
            // because we also need to fetch the user's email and name in
            // case the Stripe customer does not exist and we need to create it.
            const { stripeCustomer, ...user } = await prisma.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                select: {
                    stripeCustomer: {
                        select: {
                            customerId: true,
                        },
                    },
                    email: true,
                    firstname: true,
                    lastname: true,
                }
            })

            // Stripe customers have only a single name field.
            const name = `${user.firstname} ${user.lastname}`

            // If the user doesn't already have a Stripe customer, we need to create one.
            if (!stripeCustomer) {
                // The information we store in the customer is only for out convienience
                // when looking at the Stripe dashboard. This information is never actually
                // used in the code.
                const customer = await stripe.customers.create({
                    email: user.email,
                    name,
                    metadata: {
                        userId: userId.toString(),
                    },
                })

                return await prisma.stripeCustomer.create({
                    data: {
                        userId,
                        customerId: customer.id,
                    },
                    select: {
                        customerId: true,
                    },
                })
            }

            // Otherwise, we can just return the existing customer.
            // But, we'll first verify that it is not deleted and that 
            // the stored information are up to date.

            const customer = await stripe.customers.retrieve(stripeCustomer.customerId)

            if (customer.deleted) {
                // This should never happen as we never delete customers in Stripe.
                throw new ServerError(
                    'SERVER ERROR',
                    'Stripe kunden tilknyttet brukeren er slettet. Vennligst kontakt Vevcom.',
                )
            }

            if (customer.email !== user.email || customer.name !== `${user.firstname} ${user.lastname}`) {
                await stripe.customers.update(stripeCustomer.customerId, {
                    email: user.email,
                    name,
                    metadata: {
                        userId: userId.toString(),
                    },
                })

            }
            
            return {
                customerId: stripeCustomer.customerId,
            }
        }
    })

    /**
     * Creates a Strip customer session which allows the frontend to manage the saved payment methods
     * for the user. This session is a one time use object and needs to be created each time it is needed.
     * 
     * If the user does not have a Stripe customer associated it will be created automatically.
     */
    export const createSession = serviceMethod({
        authorizer: ({ params: { userId } }) => RequireUserId.staticFields({}).dynamicFields({ userId }),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ params: { userId } }) => {
            const { customerId } = await readOrCreate({ params: { userId } })

            // I havent seen much about this customer session API on the internet.
            // I guess it must be rather new? Here is a link to the docs in case you wonder how it works:
            // https://docs.stripe.com/payments/accept-a-payment-deferred?platform=web&type=payment#save-payment-methods
            // https://docs.stripe.com/api/customer_sessions/create
            const customerSession = await stripe.customerSessions.create({
                components: {
                    payment_element: {
                        enabled: true,
                        features: {
                            // Show all payment methods, even those that are "limited" or "unspecified" in display.
                            payment_method_allow_redisplay_filters: ['always', 'limited', 'unspecified'],
                            // Enable avaialble payment methods to be shown for the user.
                            payment_method_redisplay: 'enabled',
                            // Max allowed by Stripe, not that anyone will ever reach this lol.
                            payment_method_redisplay_limit: 10,
                            // Allow removal of payment methods.
                            payment_method_remove: 'enabled',
                            // Allow new payment methods to be added.
                            payment_method_save: 'enabled',
                            // Specify that new payment methods will be used manually by the user.
                            // (As opposed to automatically by the server, for example a subscription.)
                            payment_method_save_usage: 'on_session',
                        }
                    }
                },
                customer: customerId,
            })

            // The customer session is a one time use object, so we don't need to (nor should we) store it in the DB.
            
            // Only return what is needed by the frontend.
            return {
                customerSessionClientSecret: customerSession.client_secret,
            }
        }
    })
}
