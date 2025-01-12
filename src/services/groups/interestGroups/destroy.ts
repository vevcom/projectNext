import 'server-only'
import { destroyInterestGroupAuther } from './Auther'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyInterestGroup = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: destroyInterestGroupAuther,
    dynamicAuthFields: () => ({}),
    opensTransaction: true,
    method: async ({ prisma, params: { id } }) => {
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
