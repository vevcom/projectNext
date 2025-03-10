import { RequireNothing } from "@/auth/auther/RequireNothing";
import { ServiceMethod } from "@/services/ServiceMethod";
import { z } from "zod";
import { createPayoutValidation } from "./validation";

export namespace Payouts {
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            accountId: z.number(),
        }),
        dataValidation: createPayoutValidation,
        method: async ({ prisma, params, data }) => {
            return prisma.transaction.create({
                data: {
                    transactionType: 'PAYOUT',
                    fromAccountId: params.accountId,
                    amount: data.amount,
                }
            })
        },
    })
}