import 'server-only'
import { ServiceMethodHandler } from "../ServiceMethodHandler";
import { DOT_BASE_DURATION } from "./ConfigVars";
import { createDotValidation } from "./validation";
import { Dots } from '.';

export const create = ServiceMethodHandler({
    withData: true,
    validation: createDotValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, params: { accuserId: number }, { value, ...data }, session) => {
        const activeDots = await Dots.readActive.client(prisma).execute(
            { params: { userId: params.accuserId }, session }, { withAuth: true }
        )
        
        const dotData : { expiresAt: Date }[] = []
        let prevExpiresAt = activeDots.length > 0 ? activeDots[activeDots.length - 1].expiresAt : new Date()
        for (let i = 0; i < value; i++) {
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
                data: dotData.map(data => ({
                    ...data,
                    dotWrapperId: wrapper.id
                }))
            })
        })
    }
})