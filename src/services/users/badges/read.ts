import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => await prisma.badge.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            cmsImage: true,
        }
    })
})

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.badge.findMany({
    include: {
        cmsImage: {include: {image: true}}
    },
    
    })
})
