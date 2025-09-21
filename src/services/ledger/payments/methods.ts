import { RequireNothing } from '@/auth/auther/RequireNothing'
import { stripe } from '@/lib/stripe'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { PaymentProvider } from '@prisma/client'
import { z } from 'zod'

export namespace PaymentMethods {
    /**
     * Creates a new payment record in the db.
     * Important: This method does not call external APIs to enable it to be used in transactions.
     * Call `initiate` to actually begin collecting the payment.
     */
    export const create = serviceMethod({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            amount: z.number(),
            provider: z.nativeEnum(PaymentProvider),
            description: z.string(),
            descriptor: z.string().max(22),
            ledgerAccountId: z.number().optional(),
        }),
        method: async ({ prisma, params }) => prisma.payment.create({
            data: {
                ...params,
                // Manual payments are automatically succeeded
                status: params.provider === 'MANUAL' ? 'SUCCEEDED' : 'PENDING',
            }
        }),
    })

    /**
     * Calls the external API to begin collecting the payment.
     *
     * @warning Do not call this method for manual payments! It will fail.
     */
    export const initiate = serviceMethod({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            paymentId: z.number(),
        }),
        // This method does not actually open a transaction. However, it cannot be used
        // inside a transaction as it does external API calls which cannot be reversed.
        opensTransaction: true,
        method: async ({ prisma, params }) => {
            const payment = await prisma.payment.findUniqueOrThrow({
                where: {
                    id: params.paymentId,
                },
                select: {
                    amount: true,
                    provider: true,
                    status: true,
                    description: true,
                    descriptor: true,
                },
            })

            if (payment.status !== 'PENDING') {
                throw new ServerError('BAD PARAMETERS', 'Betalingen har allerede blitt forespurt.')
            }

            switch (payment.provider) {
                case 'MANUAL':
                    throw new ServerError('BAD PARAMETERS', 'Manuelle betalinger trenger ikke å startes.')

                case 'STRIPE':
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: payment.amount,
                        currency: 'nok',
                        description: payment.description,
                        statement_descriptor_suffix: payment.descriptor,
                        // Stripe allows us to attach arbitrary metadata to payment intents
                        // Currently, we don't use this for anything, but it might be
                        // useful in the future.
                        metadata: {
                            projectNextPaymentId: params.paymentId,
                        },
                    }, {
                        // The idempotency key makes it so that multiple requests with the
                        // same key return the same result. This is useful in case
                        // initiate payment is accidentally called twice.
                        idempotencyKey: `project-next-payment-id-${params.paymentId}`,
                    })

                    if (paymentIntent.client_secret === null) {
                        throw new ServerError('UNKNOWN ERROR', 'Noe gikk galt med forespørselen til Stripe.')
                    }

                    return await prisma.payment.update({
                        where: {
                            id: params.paymentId,
                        },
                        data: {
                            paymentIntentId: paymentIntent.id,
                            status: 'PROCESSING',
                        },
                    })

                default:
                    throw new ServerError('SERVER ERROR', 'Prøvde å forespørre betalingsleverandør som ikke er støttet.')
            }
        },
    })

    // If you are wondering where payments are updated it is in "stripeWebhookCallback.ts".
    // Manual payments don't need updating as they're are immediately marked as succeeded.
}
