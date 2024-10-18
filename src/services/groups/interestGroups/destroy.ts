import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const destroy = ServiceMethodHandler({
    withData: false,
    wantsToOpenTransaction: true,
    handler: async (prisma, { id }: { id: number }) => {
        prisma.$transaction([
            prisma.interestGroup.deleteMany({
                where: { groupId: id }
            }),
            prisma.group.delete({
                where: { id }
            })
        ])
        
    }
})
