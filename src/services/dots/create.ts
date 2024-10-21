import 'server-only'
import { Dots } from '.'
import { DOT_BASE_DURATION } from './ConfigVars'
import { createDotValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createDotValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, params: { accuserId: number }, { value, ...data }, session) => {
        const activeDots = await Dots.readForUser.client(prisma).execute(
            { params: { userId: data.userId, onlyActive: true }, session }, { withAuth: true }
        )

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
