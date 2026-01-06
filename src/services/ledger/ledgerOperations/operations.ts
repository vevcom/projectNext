import { LedgerTransactionMethods } from '../ledgerTransactions/operations'
import { PaymentMethods } from '../payments/operations'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'
import { PaymentProvider } from '@prisma/client'

// `LedgerOperations` provides functions to orchestrate account related actions,
// such as depositing funds or creating payouts. If the ledger is needed for
// other purposes, such as creating a transaction, it should be done through
// `LedgerTransaction`.

export namespace LedgerOperationMethods {
    /**
     * Creates a deposit transaction, which is a deposit of funds into the ledger.
     *
     * @params params.amount The amount to be deposited.
     * @params params.ledgerAccountId The ID of the ledger account where the funds will be deposited.
     *
     * @return The created transaction representing the deposit operation.
     */
    export const createDeposit = serviceMethod({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        opensTransaction: true,
        paramsSchema: z.object({
            ledgerAccountId: z.number(),
            provider: z.nativeEnum(PaymentProvider),
            funds: z.coerce.number().positive(),
        }),
        method: async ({ prisma, params }) => {
            const transaction = await prisma.$transaction(async tx => {
                const payment = await PaymentMethods.create({
                    params: {
                        provider: params.provider,
                        funds: params.funds,
                        descriptionLong: 'Innskudd',
                        descriptionShort: 'Innskudd',
                    },
                })

                const transaction = await LedgerTransactionMethods.create({
                    params: {
                        purpose: 'DEPOSIT',
                        ledgerEntries: [{
                            ledgerAccountId: params.ledgerAccountId,
                            funds: params.funds,
                        }],
                        paymentId: payment.id,
                    },
                })

                return transaction
            })

            if (transaction.payment?.state === 'PENDING') {
                transaction.payment = await PaymentMethods.initiate({
                    params: { paymentId: transaction.payment.id },
                })
            }

            return transaction
        }
    })

    /**
     * Creates a payout transaction, which is a withdrawal of funds from the ledger.
     *
     * @params params.amount The amount to be withdrawn.
     * @params params.fees The fees associated with the payout.
     * @params params.ledgerAccountId The ID of the ledger account from which the funds will be withdrawn.
     *
     * @returns The created transaction representing the payout operation.
     */
    export const createPayout = serviceMethod({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            ledgerAccountId: z.number(),
            funds: z.number().nonnegative().default(0),
            fees: z.number().nonnegative().default(0),
        }).refine((data) => data.funds || data.fees, 'Både beløp og avgifter kan ikke være 0 samtidig.'),
        opensTransaction: true,
        method: async ({ prisma, params }) => prisma.$transaction(async tx => {
            const payment = await PaymentMethods.create({
                params: {
                    provider: 'MANUAL',
                    descriptionLong: 'Utbetaling',
                    descriptionShort: 'Utbetaling',
                    funds: -params.funds,
                },
            })

            const transaction = await LedgerTransactionMethods.create({
                params: {
                    purpose: 'PAYOUT',
                    ledgerEntries: [{
                        ledgerAccountId: params.ledgerAccountId,
                        funds: -params.funds,
                    }],
                    paymentId: payment.id,
                },
            })

            return transaction
        })
    })
}
