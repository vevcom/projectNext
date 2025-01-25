import 'server-only'
import { updateInterestGroupValidation } from './validation'
import { updateInterestGroupAuther } from './Auther'
import { readInterestGroup } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const updateInterestGroup = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataValidation: updateInterestGroupValidation,
    auther: async ({ params }) => updateInterestGroupAuther.dynamicFields({
        groupId: (
            await readInterestGroup.newClient().execute({
                params: { id: params.id },
                session: null,
            })
        ).groupId,
    }),
    method: async ({ prisma, params: { id }, data }) => prisma.interestGroup.update({
        where: { id },
        data,
    }),
})
