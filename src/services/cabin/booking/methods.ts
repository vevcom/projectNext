import { CabinBookingAuthers } from './authers'
import { CabinBookingConfig } from './config'
import { CabinBookingSchemas } from './schemas'
import { calculateCabinBookingPrice, calculateTotalCabinBookingPrice } from './cabinPriceCalculator'
import { CabinPricePeriodMethods } from '@/services/cabin/pricePeriod/methods'
import { CabinProductConfig } from '@/services/cabin/product/config'
import { serviceMethod } from '@/services/serviceMethod'
import 'server-only'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { ServerError } from '@/services/error'
import { CabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'
import { sendSystemMail } from '@/services/notifications/email/send'
import { NotificationMethods } from '@/services/notifications/methods'
import { z } from 'zod'
import { BookingType } from '@prisma/client'

const mailData = {
    title: 'Bekreftelse på hyttebooking',
    message: `Takk for din hyttebooking.
Dette skal være en bookingbekreftelse, så det bør nok komme noe nyttig info her snart.`,
}

export namespace CabinBookingMethods {

    const cabinAvailable = serviceMethod({
        paramsSchema: z.object({
            start: z.date(),
            end: z.date()
        }),
        authorizer: ServerOnlyAuther,
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

    const bookingProductParams = z.array(z.object({
        cabinProductId: z.number(),
        quantity: z.number().int().min(1),
    }))


    const create = serviceMethod({
        paramsSchema: z.object({
            bookingType: z.nativeEnum(BookingType),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ServerOnlyAuther,
        dataSchema: CabinBookingSchemas.createBookingUserAttached,
        method: async ({ prisma, params, data }) => {
            // TODO: Prevent Race conditions

            const latestReleaseDate = await CabinReleasePeriodMethods.getCurrentReleasePeriod({
                bypassAuth: true,
            })

            if (latestReleaseDate === null) {
                throw new ServerError('SERVER ERROR', 'Hyttebooking siden er ikke tilgjengelig.')
            }

            if (data.end > latestReleaseDate.releaseUntil) {
                throw new ServerError('BAD PARAMETERS', 'Hytta kan ikke bookes etter siste slippdato.')
            }

            if (!await cabinAvailable({
                params: data,
                bypassAuth: true,
            })) {
                throw new ServerError('BAD PARAMETERS', 'Hytta er ikke tilgjengelig i den perioden.')
            }

            const products = await prisma.cabinProduct.findMany({
                where: {
                    id: {
                        in: params.bookingProducts.map(product => product.cabinProductId),
                    }
                },
                include: CabinProductConfig.includer
            })
            if (products.length !== params.bookingProducts.length) {
                throw new ServerError('BAD PARAMETERS', 'Kunne ikke finne alle hytta produktene. Duplikater er ikke tillat.')
            }

            const productsInOrder: CabinProductConfig.CabinProductExtended[] = []

            for (const paramProduct of params.bookingProducts) {
                const product = products.find(prodItem => prodItem.id === paramProduct.cabinProductId)
                if (!product) {
                    throw new ServerError('UNKNOWN ERROR', 'Kunne ikke finne mengden av produktet.')
                }
                productsInOrder.push(product)

                if (product.type !== params.bookingType) {
                    throw new ServerError('BAD PARAMETERS', 'Alle produktene må ha samme type som bookingen.')
                }

                if (product.amount < paramProduct.quantity) {
                    throw new ServerError('BAD PARAMETERS', 'Det er ikke nok av produktet til å oppfylle bookingen.')
                }
            }

            if (params.bookingType === 'EVENT' && params.bookingProducts.length !== 0) {
                throw new ServerError('BAD PARAMETERS', 'Hvad der hender bookinger kan ikke inneholde produkter.')
            }

            if (params.bookingType === 'CABIN' &&
                params.bookingProducts.length !== 1 &&
                params.bookingProducts[0].quantity !== 1
            ) {
                throw new ServerError('BAD PARAMETERS', 'Hyttebookinger kan bare inneholde ett produkt med mengde 1.')
            }

            if (params.bookingType === 'BED' && params.bookingProducts.length === 0) {
                throw new ServerError('BAD PARAMETERS', 'Sengebookinger må inneholde minst ett produkt.')
            }

            const pricePeriods = await CabinPricePeriodMethods.readMany({ bypassAuth: true })

            const priceObjects = calculateCabinBookingPrice({
                pricePeriods,
                products: productsInOrder,
                productAmounts: params.bookingProducts.map(prod => prod.quantity),
                startDate: data.start,
                endDate: data.end,
                numberOfMembers: data.numberOfMembers,
                numberOfNonMembers: data.numberOfNonMembers
            })

            const totalPrice = calculateTotalCabinBookingPrice(priceObjects)
            console.log('TOTAL PRICE FOR THE BOOKING:', totalPrice)

            return await prisma.booking.create({
                data: {
                    type: params.bookingType,
                    start: data.start,
                    end: data.end,
                    tenantNotes: data.tenantNotes,
                    numberOfMembers: data.numberOfMembers,
                    numberOfNonMembers: data.numberOfNonMembers,
                    BookingProduct: {
                        create: params.bookingProducts.map(product => ({
                            cabinProductId: product.cabinProductId,
                            quantity: product.quantity,
                        }))
                    }
                }
            })
        }
    })

    const createBookingWithUser = serviceMethod({
        paramsSchema: z.object({
            userId: z.number(),
            bookingType: z.nativeEnum(BookingType),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ServerOnlyAuther,
        dataSchema: CabinBookingSchemas.createBookingUserAttached,
        method: async ({ prisma, params, data }) => {
            const result = await create({
                params,
                data,
                bypassAuth: true,
            })

            await prisma.booking.update({
                where: {
                    id: result.id,
                },
                data: {
                    user: {
                        connect: {
                            id: params.userId,
                        }
                    }
                }
            })

            await NotificationMethods.createSpecial({
                params: {
                    special: 'CABIN_BOOKING_CONFIRMATION',
                },
                data: {
                    ...mailData,
                    userIdList: [params.userId],
                },
                bypassAuth: true,
            })
        }
    })

    export const createCabinBookingUserAttached = serviceMethod({
        paramsSchema: z.object({
            userId: z.number(),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ({ params }) => CabinBookingAuthers.createCabinBookingUserAttached.dynamicFields({
            userId: params.userId,
        }),
        dataSchema: CabinBookingSchemas.createBookingUserAttached,
        method: async ({ params, data }) =>
            createBookingWithUser({
                params: {
                    userId: params.userId,
                    bookingType: BookingType.CABIN,
                    bookingProducts: params.bookingProducts,
                },
                data,
                bypassAuth: true,
            })
    })

    export const createBedBookingUserAttached = serviceMethod({
        paramsSchema: z.object({
            userId: z.number(),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ({ params }) => CabinBookingAuthers.createBedBookingUserAttached.dynamicFields({
            userId: params.userId,
        }),
        dataSchema: CabinBookingSchemas.createBookingUserAttached,
        method: async ({ params, data }) =>
            createBookingWithUser({
                params: {
                    userId: params.userId,
                    bookingType: BookingType.BED,
                    bookingProducts: params.bookingProducts,
                },
                data,
                bypassAuth: true,
            })
    })

    const createBookingNoUser = serviceMethod({
        paramsSchema: z.object({
            bookingType: z.nativeEnum(BookingType),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ServerOnlyAuther,
        dataSchema: CabinBookingSchemas.createBookingNoUser,
        method: async ({ prisma, params, data }) => {
            const result = await create({
                params,
                data: {
                    ...data,
                    numberOfMembers: 0,
                    numberOfNonMembers: 0,
                },
                bypassAuth: true,
            })

            await prisma.booking.update({
                where: {
                    id: result.id,
                },
                data: {
                    guestUser: {
                        create: {
                            firstname: data.firstname,
                            lastname: data.lastname,
                            email: data.email,
                            mobile: data.mobile,
                        }
                    }
                }
            })

            await sendSystemMail(
                data.email,
                mailData.title,
                mailData.message
            )
        }
    })

    export const createCabinBookingNoUser = serviceMethod({
        paramsSchema: z.object({
            bookingProducts: bookingProductParams,
        }),
        authorizer: () => CabinBookingAuthers.createCabinBookingNoUser.dynamicFields({}),
        dataSchema: CabinBookingSchemas.createBookingNoUser,
        method: async ({ params, data }) => createBookingNoUser({
            params: {
                bookingType: BookingType.CABIN,
                bookingProducts: params.bookingProducts,
            },
            data,
            bypassAuth: true,
        })
    })

    export const createBedBookingNoUser = serviceMethod({
        paramsSchema: z.object({
            bookingProducts: bookingProductParams,
        }),
        authorizer: () => CabinBookingAuthers.createBedBookingNoUser.dynamicFields({}),
        dataSchema: CabinBookingSchemas.createBookingNoUser,
        method: async ({ params, data }) => createBookingNoUser({
            params: {
                bookingType: BookingType.BED,
                bookingProducts: params.bookingProducts,
            },
            data,
            bypassAuth: true,
        })
    })

    export const readAvailability = serviceMethod({
        authorizer: () => CabinBookingAuthers.readAvailability.dynamicFields({}),
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

    export const readMany = serviceMethod({
        authorizer: () => CabinBookingAuthers.readMany.dynamicFields({}),
        method: ({ prisma }) => prisma.booking.findMany({
            orderBy: {
                start: 'asc',
            },
            include: CabinBookingConfig.bookingIncluder,
        }), // TODO: Pager
    })

    export const read = serviceMethod({
        authorizer: () => CabinBookingAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: ({ prisma, params }) => prisma.booking.findUniqueOrThrow({
            where: params,
            include: CabinBookingConfig.bookingIncluder,
        })
    })


}
