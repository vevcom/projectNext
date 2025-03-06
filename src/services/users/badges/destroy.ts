import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'
import { AdminBadgeAuther } from './Authers'

export const destroyBadge = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: () => AdminBadgeAuther.dynamicFields({}),
    method: async ({prisma, params: { id }}) => {
        await prisma.badge.delete({
            where: { id }
        })
    }
})