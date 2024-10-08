import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => await prisma.eventTag.findUniqueOrThrow({
        where: {
            id
        }
    })
})

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.eventTag.findMany()
})
