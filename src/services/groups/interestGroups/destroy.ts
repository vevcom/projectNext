import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const destroy = ServiceMethodHandler({
    withData: false,
    wantsToOpenTransaction: true,
    handler: async (prisma, { id }: { id: number }) => {
        await prisma.$transaction(async tx => {
            const intrestGroup = await tx.interestGroup.delete({
                where: { id }
            })
            await tx.group.delete({
                where: { id: intrestGroup.groupId }
            })
        })
    }
})
