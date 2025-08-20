import { RequireNothing } from "@/auth/auther/RequireNothing"
import { ServiceMethod } from "@/services/ServiceMethod"
import { LedgerTransactionMethods } from "../ledgerTransactions/methods"
import { PaymentMethods } from "../payments/methods"
import { z } from "zod"
import { ManualTransferMethods } from "../manualTransfers/methods"

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
    export const createDeposit = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        opensTransaction: true,
        paramsSchema: z.object({
            amount: z.number().positive(),
            ledgerAccountId: z.number(),
        }),
        method: async ({ prisma, session, params }) => {
            const [payment, transaction] = await prisma.$transaction(async tx => {
                const payment = await PaymentMethods.create.client(tx).execute({
                    params: {
                        ...params,
                        description: 'Innskudd',
                        descriptor: 'Innskudd',
                        provider: 'STRIPE',
                    },
                    session,
                })

                const transaction = await LedgerTransactionMethods.create.client(tx).execute({
                    params: {
                        purpose: 'DEPOSIT',
                        ledgerEntries: [params],
                        paymentId: payment.id,
                    },
                    session,
                })

                return [payment, transaction]
            })

            transaction.payment = await PaymentMethods.initiate.client(prisma).execute({
                params: { paymentId: payment.id },
                session,
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
    export const createPayout = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            amount: z.number().positive(),
            fees: z.number().positive(),
            ledgerAccountId: z.number(),
        }),
        opensTransaction: true,
        method: async ({ prisma, params, session }) => {
            return prisma.$transaction(async tx => {
                const manualTransfer = await ManualTransferMethods.create.client(tx).execute({
                    params: {
                        amount: -params.amount,
                        fees: -params.fees,
                    },
                    session,
                })
    
                const transaction = await LedgerTransactionMethods.create.client(tx).execute({
                    params: {
                        purpose: 'PAYOUT',
                        ledgerEntries: [{
                            ledgerAccountId: params.ledgerAccountId,
                            amount: -params.amount,
                        }],
                        manualTransferId: manualTransfer.id,
                    },
                    session,
                })
    
                return transaction
            })
        }
    })
}
