import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { updateReleaseGroupValidation } from '@/services/cabin/validation'
import { ServerError } from '@/services/error'

export const updateReleaseGroup = ServiceMethodHandler({
    withData: true,
    validation: updateReleaseGroupValidation,
    handler: async (prisma, _, data) => await prisma.releaseGroup.update({
        where: {
            id: data.id,
        },
        data: {
            releaseTime: data.releaseTime
        }
    })
})

export const updateReleaseGroupBookingPeriods = ServiceMethodHandler({
    withData: false, // TODO: Maybe the date should be verified?
    wantsToOpenTransaction: true,
    handler: async (_prisma, params: {
        releaseId: number,
        bookingPeriodIds: number[]
    }) => await _prisma.$transaction(async (prisma) => {
        for (const bookingId of params.bookingPeriodIds) {
            const currentBooking = await prisma.bookingPeriod.findFirstOrThrow({
                where: {
                    id: bookingId,
                },
                include: {
                    releaseGroup: true,
                }
            })

            if (currentBooking.releaseGroup?.releaseTime && currentBooking.releaseGroup.releaseTime < new Date()) {
                throw new ServerError('BAD PARAMETERS', 'Kan ikke flytte en booking periode som allerede er publisert.')
            }

            await prisma.bookingPeriod.update({
                where: {
                    id: bookingId,
                },
                data: {
                    releaseGroup: {
                        connect: {
                            id: params.releaseId
                        },
                    }
                }
            })
        }

        const currentReleaseGroup = await prisma.releaseGroup.findUnique({
            where: {
                id: params.releaseId,
            },
            include: {
                bookingPeriods: {
                    select: {
                        id: true,
                    }
                }
            }
        })
        const currentPeriodIds = new Set(currentReleaseGroup?.bookingPeriods.map(period => period.id))
        const periodsToRemove = currentPeriodIds.difference(new Set(params.bookingPeriodIds))

        await prisma.bookingPeriod.updateMany({
            where: {
                OR: Array.from(periodsToRemove).map(id => ({
                    id
                }))
            },
            data: {
                releaseGroupId: null
            }
        })
    })
})
