import 'server-only'
import { createBadgeValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createBadgeValidation,
    handler: async (prisma, _, { color, ...data }) => {
        const colorR = parseInt(color.slice(1, 3), 16)
        const colorG = parseInt(color.slice(3, 5), 16)
        const colorB = parseInt(color.slice(5, 7), 16)
        return await prisma.badge.create({
            data: {
                ...data,
                colorR,
                colorG,
                colorB,
                cmsImage: {create: {}},
            }
        })
    }
})