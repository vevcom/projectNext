import { ServerError } from '@/services/error'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'


export const deleteReleaseGroup = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number}) => {
        const releaseGroup = await prisma.releaseGroup.findUniqueOrThrow({
            where: {
                id: params.id,
            },
            include: {
                bookingPeriods: {
                    include: {
                        bookings: true
                    }
                }
            }
        })

        if (releaseGroup.releaseTime && releaseGroup.releaseTime < new Date()) {
            throw new ServerError('BAD PARAMETERS', 'Kan ikke sette en plublisert slippgruppe')
        }

        if (releaseGroup.bookingPeriods.map(period => period.bookings).flat().length > 0) {
            throw new ServerError('BAD PARAMETERS', 'Kan ikke slette en slippgruppe som har bookinger')
        }

        return await prisma.releaseGroup.delete({
            where: {
                id: params.id
            }
        })
    }
})
