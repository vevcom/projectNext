import 'server-only'
import { createEventTagValidation } from './validation'
import { CreateEventTagAuther } from './Authers'
import { ServiceMethod } from '@/services/ServiceMethod'

export const createEventTag = ServiceMethod({
    dataValidation: createEventTagValidation,
    auther: CreateEventTagAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, data: { color, ...data } }) => {
        const colorR = parseInt(color.slice(1, 3), 16)
        const colorG = parseInt(color.slice(3, 5), 16)
        const colorB = parseInt(color.slice(5, 7), 16)
        return await prisma.eventTag.create({
            data: {
                ...data,
                colorR,
                colorG,
                colorB,
            }
        })
    }
})
