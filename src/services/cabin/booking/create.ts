import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { createCabinBookingUserAttachedAuther } from '@/services/cabin/authers'
import { ServerError } from '@/services/error'
import { createCabinBookingUserAttachedValidation } from '@/services/cabin/validation'
import { z } from 'zod'
import type { Prisma, PrismaClient } from '@prisma/client'

export const createCabinBookingUserAttached = ServiceMethod({
    auther: ({ params }) => createCabinBookingUserAttachedAuther.dynamicFields({
        userId: params.userId,
    }),
    paramsSchema: z.object({
        userId: z.number(),
    }),
    dataValidation: createCabinBookingUserAttachedValidation,
    method: async ({ prisma, params, data }) => {
        // TODO: Prevent Race conditions

        const latestReleaseDate = await getLatestReleaseDate(prisma)
        if (latestReleaseDate === null) {
            throw new ServerError('SERVER ERROR', 'Hyttebooking siden er ikke tilgjengelig.')
        }

        if (data.end > latestReleaseDate) {
            throw new ServerError('BAD PARAMETERS', 'Hytta kan ikke bookes etter siste slippdato.')
        }

        if (!await cabinAvailable(prisma, data.start, data.end)) {
            throw new ServerError('BAD PARAMETERS', 'Hytta er ikke tilgjengelig i den perioden.')
        }

        console.log('asdf')

        await prisma.booking.create({
            data: {
                user: {
                    connect: {
                        id: params.userId,
                    },
                },
                type: 'CABIN',
                start: data.start,
                end: data.end,
                tenantNotes: data.tenantNotes,
                // TODO: Add cabin as a product.
            }
        })
    }
})

async function cabinAvailable(prisma: PrismaClient | Prisma.TransactionClient, startDate: Date, endDate: Date) {
    const results = await prisma.booking.findMany({
        where: {
            start: {
                lt: endDate,
            },
            end: {
                gt: startDate,
            },
        }
    })
    return results.length === 0
}

async function getLatestReleaseDate(prisma: PrismaClient | Prisma.TransactionClient) {
    const results = await prisma.releasePeriod.findMany({
        orderBy: {
            releaseUntil: 'desc'
        },
        take: 1,
        where: {
            releaseTime: {
                lte: new Date(),
            },
        },
    })
    if (results.length === 0) {
        return null
    }
    return results[0].releaseUntil
}
