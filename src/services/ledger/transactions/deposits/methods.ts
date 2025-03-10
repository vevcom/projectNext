import { RequireNothing } from "@/auth/auther/RequireNothing";
import { ServiceMethod } from "@/services/ServiceMethod";
import { z } from "zod";
import { createDepositValidation } from "./validation";

export namespace Deposits {
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            accountId: z.number(),
        }),
        dataValidation: createDepositValidation,
        method: async ({ prisma, params, data }) => {
            return prisma.transaction.create({
                data: {
                    transactionType: 'DEPOSIT',
                    toAccountId: params.accountId,
                    amount: data.amount,
                }
            })
        },
    })
}