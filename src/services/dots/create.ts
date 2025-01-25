import 'server-only'
import { DOT_BASE_DURATION } from './ConfigVars'
import { createDotValidation } from './validation'
import { createDotAuther } from './authers'
import { readDotsForUser } from './read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const createDot = ServiceMethod({
    dataValidation: createDotValidation,
    auther: ({ data }) => createDotAuther.dynamicFields({ userId: data.userId }),
    paramsSchema: z.object({
        accuserId: z.number(),
    }),
    opensTransaction: true,
    method: async ({ prisma, params, data: { value, ...data }, session }) => {
        const activeDots = await readDotsForUser.client(prisma).execute({
            params: { userId: data.userId, onlyActive: true },
            session,
        })

        const dotData : { expiresAt: Date }[] = []
        let prevExpiresAt = activeDots.length > 0 ? activeDots[activeDots.length - 1].expiresAt : new Date()
        for (let i = 0; i < value; i++) {
            //TODO: Take freezes into account
            const expiresAt = new Date(prevExpiresAt.getTime() + DOT_BASE_DURATION)
            dotData.push({ expiresAt })
            prevExpiresAt = expiresAt
        }
        await prisma.$transaction(async tx => {
            const wrapper = await tx.dotWrapper.create({
                data: {
                    ...data,
                    accuserId: params.accuserId
                }
            })
            await tx.dot.createMany({
                data: dotData.map(dd => ({
                    ...dd,
                    dotWrapperId: wrapper.id
                }))
            })
        })
    }
})
