import { RequireNothing } from "@/auth/auther/RequireNothing"
import { ServiceMethod } from "@/services/ServiceMethod"
import { LedgerTransactionMethods } from "../ledgerTransactions/methods"
import { PaymentMethods } from "../payments/methods"
import { z } from "zod"
import { ManualTransferMethods } from "../manualTransfers/methods"

export namespace LedgerOperationMethods {
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
