import { DepositSchemas } from './schemas'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServiceMethod } from '@/services/ServiceMethod'
import { stripe } from '@/lib/stripe'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export namespace DepositMethods {
    /**
     * Creates a new stripe deposit and a new Stripe payment intent with the specified amount.
     */
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

    /**
     * Confirms a Stripe deposit by updating the transaction status to SUCCEEDED.
     * This method also retrieves and sets the fee from the Stripe balance transaction.
     */
    export const confirmStripe = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            balanceTransactionId: z.string(),
            paymentIntentId: z.string(),
        }),
        method: async ({ prisma, params }) => {
            const { transactionId } = await prisma.stripeDeposit.findUniqueOrThrow({
                where: {
                    paymentIntentId: params.paymentIntentId,
                }
            })
        
            const balanceTransaction = await stripe.balanceTransactions.retrieve(params.balanceTransactionId)

            await prisma.transaction.update({
                where: {
                    id: transactionId,
                    status: 'PENDING',
                },
                data: {
                    status: 'SUCCEEDED',
                    fee: balanceTransaction.fee,
                }
            })
        },
    })
}
