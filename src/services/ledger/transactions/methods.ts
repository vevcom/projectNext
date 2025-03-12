import { RequireNothing } from "@/auth/auther/RequireNothing";
import { cursorPageingSelection } from "@/lib/paging/cursorPageingSelection";
import { readPageInputSchemaObject } from "@/lib/paging/schema";
import { ServiceMethod } from "@/services/ServiceMethod";
import { z } from "zod";

export namespace TransactionMethods {
    export const readPage = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                accountId: z.number(),
            }),
        ),
        method: async ({ prisma, params }) => {
            return prisma.transaction.findMany({
                where: {
                    OR: [
                        { fromAccountId: params.paging.details.accountId },
                        { toAccountId: params.paging.details.accountId },
                    ]
                },  
                orderBy: {
                    createdAt: 'desc',
                },
                ...cursorPageingSelection(params.paging.page)
            })
        }
    })
}