import { RequireNothing } from '@/auth/auther/RequireNothing'
import { serviceMethod } from '@/services/serviceMethod'
import { z } from 'zod'

export namespace ManualTransferMethods {
    export const create = serviceMethod({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Fix
        paramsSchema: z.object({
            amount: z.number().int(),
            fees: z.number().int(),
            bankAccountNumber: z.string().optional(),
            comment: z.string().optional(),
        }),
        method: ({ prisma, params }) => prisma.manualTransfer.create({ data: params }),
    })
}
