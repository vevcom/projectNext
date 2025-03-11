import { RequireNothing } from "@/auth/auther/RequireNothing";
import { ServiceMethod } from "@/services/ServiceMethod";
import { z } from "zod";
import { LedgerAccountMethods } from "@/services/ledger/ledgerAccount/methods";
import { ServerError } from "@/services/error";
import { createPaymentValidation } from "./validation";

export namespace PaymentMethods {
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            fromAccountId: z.number(),
        }),
        dataValidation: createPaymentValidation,
        opensTransaction: true,
        method: async ({ prisma, session, params, data }) => {
            if (params.fromAccountId === data.toAccountId) {
                throw new ServerError('BAD DATA', 'Overføring til samme konto er ikke tillat.')
            }

            return prisma.$transaction(async (tx) => {
                await tx.transaction.create({
                    data: {
                        transactionType: 'PAYMENT',
                        fromAccountId: params.fromAccountId,
                        toAccountId: data.toAccountId,
                        amount: data.amount,
                    },
                })

                const newBalancee = await LedgerAccountMethods.calculateBalance.client(tx).execute({
                    params: {
                        id: params.fromAccountId,
                    },
                    session,
                })

                if (newBalancee < 0) {
                    throw new ServerError('BAD DATA', 'Kontoen har ikke nok penger for å utføre tranaksjonen.')
                }
            })
        },
    })
}