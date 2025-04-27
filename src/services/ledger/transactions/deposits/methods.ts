import { DepositSchemas } from './schemas'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServiceMethod } from '@/services/ServiceMethod'
import { stripe } from '@/lib/stripe'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export namespace DepositMethods {
    export const createStripe = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            accountId: z.number(),
        }),
        dataSchema: DepositSchemas.create,
        method: async ({ prisma, params, data }) => {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: data.amount,
                currency: 'nok',
                description: 'Innskudd',
                statement_descriptor: 'Omegaveven Innskudd',
            })

            if (paymentIntent.client_secret === null) {
                throw new ServerError('UNKNOWN ERROR', 'Noe gikk galt med forespørselen til Stripe.')
            }

            return prisma.stripeDeposit.create({
                data: {
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                    deposit: {
                        create: {
                            type: 'STRIPE',
                            transaction: {
                                create: {
                                    status: 'PENDING',
                                    type: 'DEPOSIT',
                                    toAccountId: params.accountId,
                                    amount: data.amount,
                                }
                            }
                        }
                    }
                }
            })
        },
    })
}
