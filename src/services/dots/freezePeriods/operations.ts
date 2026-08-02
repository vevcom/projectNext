import '@pn-server-only'
import { dotFreezePeriodAuth } from './auth'
import { dotFreezePeriodSchemas } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { z } from 'zod'

export const dotFreezePeriodOperations = {
    create: defineOperation({
        dataSchema: dotFreezePeriodSchemas.create,
        authorizer: () => dotFreezePeriodAuth.create.dynamicFields({}),
        operation: async ({ prisma, data }) => prisma.dotFreezePeriod.create({ data }),
    }),

    readAll: defineOperation({
        authorizer: () => dotFreezePeriodAuth.readAll.dynamicFields({}),
        operation: async ({ prisma }) => prisma.dotFreezePeriod.findMany({
            orderBy: {
                start: 'desc',
            },
        }),
    }),

    update: defineOperation({
        paramsSchema: z.object({
            id: z.coerce.number(),
        }),
        dataSchema: dotFreezePeriodSchemas.update,
        authorizer: () => dotFreezePeriodAuth.update.dynamicFields({}),
        operation: async ({ prisma, params, data }) => prisma.dotFreezePeriod.update({
            where: {
                id: params.id,
            },
            data,
        }),
    }),

    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.coerce.number(),
        }),
        authorizer: () => dotFreezePeriodAuth.destroy.dynamicFields({}),
        operation: async ({ prisma, params }) => prisma.dotFreezePeriod.delete({
            where: {
                id: params.id,
            },
        }),
    }),
} as const
