import 'server-only'
import { updateBadgeValidation } from './validation'
import { ServiceMethod } from '@/services/ServiceMethod'
import { AdminBadgeAuther } from './Authers'
import { z } from 'zod'

export const updateBadge = ServiceMethod({
    dataValidation: updateBadgeValidation,
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: () => AdminBadgeAuther.dynamicFields({}),
    method: async ({ prisma, params: { id }, data: { color, ...data }}) => {
        const colorR = color ? parseInt(color.slice(1, 3), 16) : undefined
        const colorG = color ? parseInt(color.slice(3, 5), 16) : undefined
        const colorB = color ? parseInt(color.slice(5, 7), 16) : undefined
        return await prisma.badge.update({
            where: {
                id
            },
            data: {
                ...data,
                colorR,
                colorG,
                colorB,
            }
        })
    }
})