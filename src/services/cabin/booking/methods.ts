import 'server-only'
import { calculateCabinBookingPrice, calculateTotalCabinBookingPrice } from './cabinPriceCalculator'
import { cabinBookingSchemas } from './schemas'
import { cabinBookingAuthers } from './authers'
import { cabinBookingFilerSelection, cabinBookingIncluder } from './config'
import { cabinPricePeriodMethods } from '@/services/cabin/pricePeriod/methods'
import { cabinProductPriceIncluder } from '@/services/cabin/product/config'
import { defineOperation } from '@/services/serviceOperation'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { ServerError } from '@/services/error'
import { cabinReleasePeriodMethods } from '@/services/cabin/releasePeriod/methods'
import { sendSystemMail } from '@/services/notifications/email/send'
import { notificationMethods } from '@/services/notifications/methods'
import { z } from 'zod'
import { BookingType } from '@prisma/client'
import type { CabinProductExtended } from '@/services/cabin/product/config'

const mailData = {
    title: 'Bekreftelse på hyttebooking',
    message: `Takk for din hyttebooking.
Dette skal være en bookingbekreftelse, så det bør nok komme noe nyttig info her snart.`,
}

const cabinAvailable = defineOperation({
    paramsSchema: z.object({
        start: z.date(),
        end: z.date()
    }),
    authorizer: ServerOnlyAuther,
    operation: async ({ prisma, params }) => {
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


const create = defineOperation({
    paramsSchema: z.object({
        bookingType: z.nativeEnum(BookingType),
        bookingProducts: bookingProductParams,
    }),
    authorizer: ServerOnlyAuther,
    dataSchema: cabinBookingSchemas.createBookingUserAttached,
    operation: async ({ prisma, params, data }) => {
        // TODO: Prevent Race conditions

        const latestReleaseDate = await cabinReleasePeriodMethods.getCurrentReleasePeriod({
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
            include: cabinProductPriceIncluder,
        })
        if (products.length !== params.bookingProducts.length) {
            throw new ServerError('BAD PARAMETERS', 'Kunne ikke finne alle hytta produktene. Duplikater er ikke tillat.')
        }

        const productsInOrder: CabinProductExtended[] = []

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

        const pricePeriods = await cabinPricePeriodMethods.readMany({ bypassAuth: true })

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

const createBookingWithUser = defineOperation({
    paramsSchema: z.object({
        userId: z.number(),
        bookingType: z.nativeEnum(BookingType),
        bookingProducts: bookingProductParams,
    }),
    authorizer: ServerOnlyAuther,
    dataSchema: cabinBookingSchemas.createBookingUserAttached,
    operation: async ({ prisma, params, data }) => {
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

        await notificationMethods.createSpecial({
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

const createBookingNoUser = defineOperation({
    paramsSchema: z.object({
        bookingType: z.nativeEnum(BookingType),
        bookingProducts: bookingProductParams,
    }),
    authorizer: ServerOnlyAuther,
    dataSchema: cabinBookingSchemas.createBookingNoUser,
    operation: async ({ prisma, params, data }) => {
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

export const cabinBookingMethods = {
    createCabinBookingUserAttached: defineOperation({
        paramsSchema: z.object({
            userId: z.number(),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ({ params }) => cabinBookingAuthers.createCabinBookingUserAttached.dynamicFields({
            userId: params.userId,
        }),
        dataSchema: cabinBookingSchemas.createBookingUserAttached,
        operation: async ({ params, data }) =>
            createBookingWithUser({
                params: {
                    userId: params.userId,
                    bookingType: BookingType.CABIN,
                    bookingProducts: params.bookingProducts,
                },
                data,
                bypassAuth: true,
            })
    }),

    createBedBookingUserAttached: defineOperation({
        paramsSchema: z.object({
            userId: z.number(),
            bookingProducts: bookingProductParams,
        }),
        authorizer: ({ params }) => cabinBookingAuthers.createBedBookingUserAttached.dynamicFields({
            userId: params.userId,
        }),
        dataSchema: cabinBookingSchemas.createBookingUserAttached,
        operation: async ({ params, data }) =>
            createBookingWithUser({
                params: {
                    userId: params.userId,
                    bookingType: BookingType.BED,
                    bookingProducts: params.bookingProducts,
                },
                data,
                bypassAuth: true,
            })
    }),

    createCabinBookingNoUser: defineOperation({
        paramsSchema: z.object({
            bookingProducts: bookingProductParams,
        }),
        authorizer: () => cabinBookingAuthers.createCabinBookingNoUser.dynamicFields({}),
        dataSchema: cabinBookingSchemas.createBookingNoUser,
        operation: async ({ params, data }) => createBookingNoUser({
            params: {
                bookingType: BookingType.CABIN,
                bookingProducts: params.bookingProducts,
            },
            data,
            bypassAuth: true,
        })
    }),

    createBedBookingNoUser: defineOperation({
        paramsSchema: z.object({
            bookingProducts: bookingProductParams,
        }),
        authorizer: () => cabinBookingAuthers.createBedBookingNoUser.dynamicFields({}),
        dataSchema: cabinBookingSchemas.createBookingNoUser,
        operation: async ({ params, data }) => createBookingNoUser({
            params: {
                bookingType: BookingType.BED,
                bookingProducts: params.bookingProducts,
            },
            data,
            bypassAuth: true,
        })
    }),

    readAvailability: defineOperation({
        authorizer: () => cabinBookingAuthers.readAvailability.dynamicFields({}),
        operation: async ({ prisma }) => {
            const results = await prisma.booking.findMany({
                select: cabinBookingFilerSelection,
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
    }),

    readMany: defineOperation({
        authorizer: () => cabinBookingAuthers.readMany.dynamicFields({}),
        operation: ({ prisma }) => prisma.booking.findMany({
            orderBy: {
                start: 'asc',
            },
            include: cabinBookingIncluder,
        }), // TODO: Pager
    }),

    read: defineOperation({
        authorizer: () => cabinBookingAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: ({ prisma, params }) => prisma.booking.findUniqueOrThrow({
            where: params,
            include: cabinBookingIncluder,
        })
    })
}
