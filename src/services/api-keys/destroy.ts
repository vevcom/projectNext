import 'server-only'
import { adminApiKeyAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerError } from '@/services/error'
import { z } from 'zod'

export const destroyApiKey = ServiceMethod({
    auther: () => adminApiKeyAuther.dynamicFields({}),
    paramsSchema: z.number(),
    opensTransaction: true,
    method: async ({ prisma, params: id }): Promise<void> => {
        await prisma.$transaction(async (tx) => {
            const apiKey = await tx.apiKey.findUniqueOrThrow({
                where: { id },
                select: { active: true }
            })

            if (apiKey.active) {
                throw new ServerError('BAD PARAMETERS', 'Du kan ikke slette en aktiv nøkkel - deaktiver den først')
            }

            await tx.apiKey.delete({
                where: { id }
            })
        })
    }
})
