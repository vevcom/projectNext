import 'server-only'
import { updateEventTagValidation } from './validation'
import { updateEventTagAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const updateEventTag = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataValidation: updateEventTagValidation,
    auther: updateEventTagAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { id }, data: { color, ...data } }) => {
        const colorR = color ? parseInt(color.slice(1, 3), 16) : undefined
        const colorG = color ? parseInt(color.slice(3, 5), 16) : undefined
        const colorB = color ? parseInt(color.slice(5, 7), 16) : undefined
        return await prisma.eventTag.update({
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
