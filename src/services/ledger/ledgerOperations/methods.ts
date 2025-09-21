import { LedgerTransactionMethods } from '@/services/ledger/ledgerTransactions/methods'
import { PaymentMethods } from '@/services/ledger/payments/methods'
import { ManualTransferMethods } from '@/services/ledger/manualTransfers/methods'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'

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
            amount: z.number().positive(),
            ledgerAccountId: z.number(),
        }),
        method: async ({ prisma, params }) => {
            const [payment, transaction] = await prisma.$transaction(async tx => {
                const payment_ = await PaymentMethods.create({
                    params: {
                        ...params,
                        description: 'Innskudd',
                        descriptor: 'Innskudd',
                        provider: 'STRIPE',
                    },
                    prisma: tx,
                })

                const transaction_ = await LedgerTransactionMethods.create({
                    params: {
                        purpose: 'DEPOSIT',
                        ledgerEntries: [params],
                        paymentId: payment_.id,
                    },
                    prisma: tx,
                })

                return [payment_, transaction_]
            })

            transaction.payment = await PaymentMethods.initiate({
                params: { paymentId: payment.id },
            })

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
            amount: z.number().positive(),
            fees: z.number().positive(),
            ledgerAccountId: z.number(),
        }),
        opensTransaction: true,
        method: async ({ prisma, params }) => prisma.$transaction(async tx => {
            const manualTransfer = await ManualTransferMethods.create({
                params: {
                    amount: -params.amount,
                    fees: -params.fees,
                },
                prisma: tx,
            })

            const transaction = await LedgerTransactionMethods.create({
                params: {
                    purpose: 'PAYOUT',
                    ledgerEntries: [{
                        ledgerAccountId: params.ledgerAccountId,
                        amount: -params.amount,
                    }],
                    manualTransferId: manualTransfer.id,
                },
                prisma: tx,
            })

            return transaction
        })
    })
}
