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
        paramsSchema: z.object({
            amount: z.number(),
            provider: z.nativeEnum(PaymentProvider),
            description: z.string(),
            descriptor: z.string().max(22),
            ledgerAccountId: z.number().optional(),
        }),
        method: async ({ prisma, params }) => {
            return prisma.payment.create({
                data: {
                    ...params,
                    // Manual payments are automatically succeeded
                    state: params.provider === 'MANUAL' ? 'SUCCEEDED' : 'PENDING',
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
                    amount: true,
                    provider: true,
                    state: true,
                    description: true,
                    descriptor: true,
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
                            state: 'PROCESSING',
                        },
                    })

                default:
                    throw new ServerError('SERVER ERROR', 'Prøvde å forespørre betalingsleverandør som ikke er støttet.')
            }
        },
    })

    // // TODO: Find a clean way to reuse logic from ledger account!
    
    // /**
    //  * Calculates the balance and fees of a payment. Optionally takes a transaction ID to calculate the balance up until that transaction.
    //  *
    //  * @warning Non-existent payments will be treated as having a balance of zero.
    //  * 
    //  * @param params.ids The IDs of the payments to calculate the balance for.
    //  * @param params.atTransactionId Optional transaction ID to calculate the balance up until that transaction.
    //  *
    //  * @returns The balances of the payments.
    //  */
    // export const calculateBalances = ServiceMethod({
    //     auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
    //     paramsSchema: z.object({
    //         ids: z.number().array(),
    //         atTransactionId: z.number().optional(),
    //     }),
    //     method: async ({ prisma, params }) => {
    //         const balanceArray = await prisma.ledgerEntry.groupBy({
    //             by: ['paymentId'],
    //             where: {
    //                 // Select which payments we want to calculate the balance for
    //                 paymentId: {
    //                     not: null,
    //                     in: params.ids,
    //                 },
    //                 // Since transaction ids are sequential we can use the less than operator
    //                 // to filter for all the transactions that happened before the given one.
    //                 // This is useful in case we need to know the balance in the past.
    //                 ledgerTransactionId: {
    //                     lte: params.atTransactionId,
    //                 },
    //                 // The amount should be deducted from the source if the transaction succeeded (obviously)
    //                 // OR when the transaction is pending. This is our way of reserving the funds
    //                 // until the transaction is complete.
    //                 ledgerTransaction: { status: { in: ['PENDING', 'SUCCEEDED'] } },
    //             },
    //             // Select what fields we should sum
    //             _sum: {
    //                 amount: true,
    //                 fees: true,
    //             },
    //         })

    //         const amounts = await prisma.payment.findMany({
    //             where: {
    //                 id: {
    //                     in: params.ids,
    //                 },
    //             },
    //             select: {
    //                 amount: true,
    //                 fees: true,
    //             },
    //         })

    //         // The output from the Prisma `groupBy` method is an array.
    //         // We convert it to an object (record) as it is more sensible for lookups. 
    //         const balanceRecord = Object.fromEntries(
    //             // The "as const"s are required so that TS understands that the arrays
    //             // have a length of exactly two.
    //             [
    //                 // Set all ids to zero by default in case some payments do not have
    //                 // any ledger entries yet.
    //                 ...params.ids.map(id => [id, { amount: 0, fees: 0 }] as const),
    //                 // Map the array returned by `groupBy` to key value pairs. 
    //                 ...balanceArray.map(balance => [
    //                     // The "!" is required because the typing for `fromEntries` doesn't accept
    //                     // null as a key. (Even though all keys just get converted to strings during
    //                     // runtime.) The query above guarantees that the id can never be null so
    //                     // its safe anyhow. 
    //                     balance.paymentId!, 
    //                     {
    //                         // Prisma sets sum to "null" in case the only rows which exist are null.
    //                         // For our case we can treat it as zero.
    //                         amount: balance._sum.amount ?? 0 + balance.amount,
    //                         fees: balance._sum.fees ?? 0 + (balance.fees ?? 0),
    //                     },
    //                 ] as const),
    //             ]
    //         )

    //         // The object returned by `fromEntries` assumes that all keys map to the provided type.
    //         // This is obviously not true so we need to assert the record as partial.
    //         return balanceRecord as Partial<typeof balanceRecord>
    //     }
    // })

    // /**
    //  * Calcultates the balance of a single payment. Under the hood it simply uses `calculateBalances`.
    //  * 
    //  * @warning In case a payment with the provided id doesn't exist a balance of zero will be returned!
    //  * 
    //  * @param params.id The ID of the payment to calculate the balance for.
    //  * @param params.atTransactionId Optional transaction ID to calculate the balance up until that transaction.
    //  *
    //  * @returns The balances of the payments.
    //  */
    // export const calculateBalance = ServiceMethod({
    //     auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
    //     paramsSchema: z.object({
    //         id: z.number(),
    //         atTransactionId: z.number().optional(),
    //     }),
    //     method: async ({ prisma, session, params }) => {
    //         const balances = await calculateBalances.client(prisma).execute({
    //             params: {
    //                 ids: [params.id],
    //                 atTransactionId: params.atTransactionId,
    //             },
    //             session,
    //         })

    //         // We know that the returned balances must contain the id we provided.
    //         // So, we can simply assert that this is not undefined.
    //         // TODO: There might be a better way to do this?
    //         return balances[params.id]!
    //     }
    // })
}
