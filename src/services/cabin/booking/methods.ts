import { CabinBookingAuthers } from './authers'
import { CabinBookingConfig } from './config'
import { CabinBookingSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import { UserConfig } from '@/services/users/config'


export namespace CabinBookingMethods {

    const cabinAvailable = ServiceMethod({
        paramsSchema: z.object({
            start: z.date(),
            end: z.date()
        }),
        auther: ServerOnlyAuther,
        method: async ({ prisma, params }) => {
            const results = await prisma.booking.findMany({
                where: {
                    start: {
                        lt: params.end,
                    },
                    end: {
                        gt: params.start,
                    },
                }
            })
            return results.length === 0
        }
    })

    const getLatestReleaseDate = ServiceMethod({
        auther: ServerOnlyAuther,
        method: async ({ prisma }) => {
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
                throw new ServerError('NOT FOUND', 'There are no releasePeriods for the cabin.')
            }
            return results[0].releaseUntil
        }
    })

    export const createCabinBookingUserAttached = ServiceMethod({
        paramsSchema: z.object({
            userId: z.number(),
        }),
        auther: ({ params }) => CabinBookingAuthers.createUserAttached.dynamicFields({
            userId: params.userId,
        }),
        dataSchema: CabinBookingSchemas.createBookingUserAttached,
        method: async ({ prisma, params, data, session }) => {
            // TODO: Prevent Race conditions

            const latestReleaseDate = await getLatestReleaseDate.client(prisma).execute({
                session,
                bypassAuth: true,
            })

            if (latestReleaseDate === null) {
                throw new ServerError('SERVER ERROR', 'Hyttebooking siden er ikke tilgjengelig.')
            }

            if (data.end > latestReleaseDate) {
                throw new ServerError('BAD PARAMETERS', 'Hytta kan ikke bookes etter siste slippdato.')
            }

            if (!await cabinAvailable.client(prisma).execute({
                params: data,
                session,
                bypassAuth: true,
            })) {
                throw new ServerError('BAD PARAMETERS', 'Hytta er ikke tilgjengelig i den perioden.')
            }

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

    export const readAvailability = ServiceMethod({
        auther: () => CabinBookingAuthers.readAvailability.dynamicFields({}),
        method: async ({ prisma }) => {
            const results = await prisma.booking.findMany({
                select: CabinBookingConfig.bookingFilerSelection,
                orderBy: {
                    start: 'asc'
                },
                where: {
                    canceled: null,
                    end: {
                        gte: new Date(),
                    },
                },
            })

            // Anonymize the bookings a bit
            for (let i = results.length - 1; i > 0; i--) {
                if (results[i].start === results[i - 1].end) {
                    results[i - 1].end = results[i].end
                    results.splice(i)
                }
            }

            return results
        }
    })

    export const readMany = ServiceMethod({
        auther: () => CabinBookingAuthers.readMany.dynamicFields({}),
        method: ({ prisma }) => prisma.booking.findMany({
            orderBy: {
                start: 'asc',
            }
        }), // TODO: Pager
    })

    export const read = ServiceMethod({
        auther: () => CabinBookingAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: ({ prisma, params }) => prisma.booking.findUniqueOrThrow({
            where: params,
            include: {
                user: {
                    select: UserConfig.filterSelection,
                },
                BookingProduct: {
                    include: {
                        product: true,
                    }
                },
                event: true,
            }
        })
    })


}
