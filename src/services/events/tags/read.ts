import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => {
        return await prisma.eventTag.findUnique({
            where: {
                id
            }
        })
    }
})

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => {
        return await prisma.eventTag.findMany()
    }
})