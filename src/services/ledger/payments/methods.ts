import { RequireNothing } from "@/auth/auther/RequireNothing"
import { stripe } from "@/lib/stripe"
import { ServerError } from "@/services/error"
import { ServiceMethod } from "@/services/ServiceMethod"
import { PaymentProvider } from "@prisma/client"
import { z } from "zod"


export namespace PaymentMethods {
    /**
     * Creates a new payment record in the db.
     * Important: This method does not call external APIs to enable it to be used in transactions.
     * Call `initiate` to actually begin collecting the payment.
     */
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.intersection(
            z.object({
                funds: z.number(),
                fees: z.number().optional(),
                descriptionLong: z.string().optional(),
                descriptionShort: z.string().optional(),
                ledgerAccountId: z.number().optional(),
            }),
            z.discriminatedUnion('provider', [
                z.object({
                    provider: z.literal(PaymentProvider.STRIPE),
                    details: z.object({}).optional(),
                }),
                z.object({
                    provider: z.literal(PaymentProvider.MANUAL),
                    details: z.object({
                        bankAccountNumber: z.string().optional(),
                    }).optional(),
                }),
            ]),
        ),
        method: async ({ prisma, params }) => {
            const { details = {}, ...paymentData } = params

            return prisma.payment.create({
                data: {
                    ...paymentData,
                    // Manual payments are automatically succeeded
                    state: params.provider === 'MANUAL' ? 'SUCCEEDED' : 'PENDING',
                    stripePayment: params.provider === 'STRIPE' ? {
                        create: params.details,
                    } : undefined,
                    manualPayment: params.provider === 'MANUAL' ? {
                        create: params.details,
                    } : undefined,
                },
                include: {
                    stripePayment: true,
                    manualPayment: true,
                }
            })
        },
    })

    /**
     * Calls the external API to begin collecting the payment.
     * 
     * @warning Do not call this method for manual payments! It will fail.
     */
    export const initiate = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
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
                    funds: true,
                    provider: true,
                    state: true,
                    descriptionLong: true,
                    descriptionShort: true,
                },
            })

            if (payment.state !== 'PENDING') {
                throw new ServerError('BAD PARAMETERS', 'Betalingen har allerede blitt forespurt.')
            }

            switch (payment.provider) {
                case 'MANUAL':
                    throw new ServerError('BAD PARAMETERS', 'Manuelle betalinger trenger ikke å startes.')

                case 'STRIPE':
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: payment.funds,
                        currency: 'nok',
                        description: payment.descriptionLong ?? undefined,
                        statement_descriptor_suffix: payment.descriptionShort ?? undefined,
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
                            stripePayment: {
                                update: {
                                    paymentIntentId: paymentIntent.id,
                                },
                            },
                            state: 'PROCESSING',
                        },
                        include: {
                            stripePayment: true,
                            manualPayment: true,
                        }
                    })

                default:
                    throw new ServerError('SERVER ERROR', 'Prøvde å forespørre betalingsleverandør som ikke er støttet.')
            }
        },
    })
}
