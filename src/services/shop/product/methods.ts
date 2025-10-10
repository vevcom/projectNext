import { serviceMethod } from '@/services/serviceMethod'
import '@pn-server-only'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import type { ExtendedProduct } from './Types'
import { productAuthers } from './authers'
import { productSchemas } from './schemas'

export const productMethods = {
    create: serviceMethod({
        authorizer: () => productAuthers.create.dynamicFields({}),
        dataSchema: productSchemas.create,
        method: async ({ prisma, data }) => prisma.product.create({
            data: {
                ...data,
                barcode: convertBarcode(data.barcode),
                name: data.name.toUpperCase()
            }
        })
    }),

    createForShop: serviceMethod({
        authorizer: () => productAuthers.create.dynamicFields({}),
        paramsSchema: z.object({
            shopId: z.number(),
        }),
        dataSchema: productSchemas.createForShop,
        method: async ({ prisma, params, data }) => prisma.product.create({
            data: {
                name: data.name.toUpperCase(),
                description: data.description,
                barcode: convertBarcode(data.barcode),
                ShopProduct: {
                    create: {
                        price: data.price,
                        shop: {
                            connect: {
                                id: params.shopId,
                            },
                        },
                    },
                },
            },
        })
    }),

    createShopConnection: serviceMethod({
        authorizer: () => productAuthers.createShopConnection.dynamicFields({}),
        dataSchema: productSchemas.createShopConnection,
        method: async ({ prisma, data }) => prisma.shopProduct.create({
            data: {
                shop: {
                    connect: {
                        id: data.shopId,
                    }
                },
                product: {
                    connect: {
                        id: data.productId,
                    },
                },
                price: data.price,
            }
        })
    }),

    readMany: serviceMethod({
        authorizer: () => productAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => await prisma.product.findMany()
    }),

    read: serviceMethod({
        authorizer: () => productAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            productId: z.number(),
        }),
        method: async ({ prisma, params }) => await prisma.product.findUniqueOrThrow({
            where: {
                id: params.productId
            },
            include: {
                ShopProduct: {
                    include: {
                        shop: true
                    }
                }
            }
        })
    }),

    readByBarCode: serviceMethod({
        authorizer: () => productAuthers.read.dynamicFields({}),
        dataSchema: productSchemas.readByBarCode,
        method: async ({ prisma, data }): Promise<ExtendedProduct | null> => {
            if (!data.barcode) {
                throw new ServerError('BAD PARAMETERS', 'Barcode is required.')
            }

            const results = await prisma.product.findUnique({
                where: {
                    barcode: data.barcode.toString()
                },
                include: {
                    ShopProduct: {
                        where: {
                            shopId: data.shopId,
                            active: true,
                        }
                    }
                }
            })

            if (!results || results.ShopProduct.length === 0) {
                throw new ServerError(
                    'NOT FOUND',
                    `Could not find any prduct with barcode ${data.barcode} in shop ${data.shopId}.`
                )
            }

            const ret = {
                ...results,
                price: 0,
                active: true,
            }
            Reflect.deleteProperty(ret, 'ShopProduct')
            ret.price = results.ShopProduct[0].price
            ret.active = results.ShopProduct[0].active

            return ret
        }
    }),

    update: serviceMethod({
        authorizer: () => productAuthers.update.dynamicFields({}),
        dataSchema: productSchemas.update,
        method: async ({ prisma, data }) => prisma.product.update({
            where: {
                id: data.productId,
            },
            data: {
                name: data.name.toUpperCase(),
                description: data.description,
                barcode: convertBarcode(data.barcode),
            },
        })
    }),

    updateForShop: serviceMethod({
        authorizer: () => productAuthers.update.dynamicFields({}),
        dataSchema: productSchemas.updateForShop,
        paramsSchema: z.object({
            shopId: z.number(),
            productId: z.number(),
        }),
        method: async ({ prisma, params, data }) => prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name: data.name.toUpperCase(),
                description: data.description,
                barcode: convertBarcode(data.barcode),
                ShopProduct: {
                    update: {
                        where: {
                            shopId_productId: {
                                shopId: params.shopId,
                                productId: params.productId,
                            },
                        },
                        data: {
                            price: data.price,
                            active: data.active,
                        },
                    },
                },
            },
        })
    }),
}

export function convertBarcode(barcode?: string | number) {
    if (typeof barcode === 'string' || typeof barcode === 'number') {
        const stringBarcode = String(barcode).trim()
        if (stringBarcode.length > 0) {
            return stringBarcode
        }
    }
    return null
}

