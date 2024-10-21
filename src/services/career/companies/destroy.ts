import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: {
        id: number
    }) => {
        await prisma.company.delete({
            where: {
                id
            }
        })
    }
})