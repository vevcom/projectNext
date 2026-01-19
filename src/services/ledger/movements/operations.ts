import { ledgerTransactionOperations } from '@/services/ledger/transactions/operations'
import { paymentOperations } from '@/services/ledger/payments/operations'
import { defineOperation } from '@/services/serviceOperation'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { z } from 'zod'
import { PaymentProvider } from '@/prisma-generated-pn-types'

// `ledgerMovementOperations` provides functions to orchestrate account related actions,
// such as depositing funds or creating payouts. If the ledger is needed for
// other purposes, such as creating a transaction, it should be done through
// `ledgerTransactionOperations`.

export const ledgerMovementOperations = {
    /**
     * Creates a deposit transaction, which is a deposit of funds into the ledger.
     *
     * @params params.amount The amount to be deposited.
     * @params params.ledgerAccountId The ID of the ledger account where the funds will be deposited.
     *
     * @return The created transaction representing the deposit operation.
     */
    createDeposit: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        opensTransaction: true,
        paramsSchema: z.object({
            ledgerAccountId: z.number(),
            provider: z.nativeEnum(PaymentProvider),
            funds: z.coerce.number().nonnegative(),
            manualFees: z.coerce.number().nonnegative().default(0),
        }),
        operation: async ({ prisma, params }) => {
            const transaction = await prisma.$transaction(async tx => {
                const payment = await paymentOperations.create({
                    params: {
                        provider: params.provider,
                        funds: params.funds,
                        manualFees: params.manualFees,
                        descriptionLong: 'Innskudd til veven',
                        descriptionShort: 'Innskudd',
                    },
                    prisma: tx,
                })

                return await ledgerTransactionOperations.create({
                    params: {
                        purpose: 'DEPOSIT',
                        ledgerEntries: [{
                            ledgerAccountId: params.ledgerAccountId,
                            funds: params.funds,
                        }],
                        paymentId: payment.id,
                    },
                    prisma: tx,
                })
            })

            if (transaction.payment?.state === 'PENDING') {
                transaction.payment = await paymentOperations.initiate({
                    params: { paymentId: transaction.payment.id },
                })
            }

            return transaction
        }
    }),

    /**
     * Creates a payout transaction, which is a withdrawal of funds from the ledger.
     *
     * @params params.amount The amount to be withdrawn.
     * @params params.fees The fees associated with the payout.
     * @params params.ledgerAccountId The ID of the ledger account from which the funds will be withdrawn.
     *
     * @returns The created transaction representing the payout operation.
     */
    createPayout: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            ledgerAccountId: z.number(),
            funds: z.number().nonnegative().default(0),
            fees: z.number().nonnegative().default(0),
        }).refine((data) => data.funds || data.fees, 'Både beløp og avgifter kan ikke være 0 samtidig.'),
        opensTransaction: true,
        operation: async ({ prisma, params }) => prisma.$transaction(async tx => {
            const payment = await paymentOperations.create({
                params: {
                    provider: 'MANUAL',
                    descriptionLong: 'Utbetaling fra veven',
                    descriptionShort: 'Utbetaling',
                    funds: -params.funds,
                    manualFees: -params.fees,
                },
                prisma: tx,
            })

            const transaction = await ledgerTransactionOperations.create({
                params: {
                    purpose: 'PAYOUT',
                    ledgerEntries: [{
                        ledgerAccountId: params.ledgerAccountId,
                        funds: -params.funds,
                        fees: -params.fees,
                    }],
                    paymentId: payment.id,
                },
                prisma: tx,
            })

            return transaction
        })
    }),
}
