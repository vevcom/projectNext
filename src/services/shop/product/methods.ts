import { ProductAuthers } from './authers'
import { ProductSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import type { ExtendedProduct } from './Types'

export namespace ProductMethods {
    export const create = ServiceMethod({
        auther: () => ProductAuthers.create.dynamicFields({}),
        dataSchema: ProductSchemas.create,
        method: async ({ prisma, data }) => prisma.product.create({
            data: {
                ...data,
                barcode: convertBarcode(data.barcode),
                name: data.name.toUpperCase()
            }
        })
    })

    export const createForShop = ServiceMethod({
        auther: () => ProductAuthers.create.dynamicFields({}),
        paramsSchema: z.object({
            shopId: z.number(),
        }),
        dataSchema: ProductSchemas.createForShop,
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
    })

    export const createShopConnection = ServiceMethod({
        auther: () => ProductAuthers.createShopConnection.dynamicFields({}),
        dataSchema: ProductSchemas.createShopConnection,
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
    })

    export const readMany = ServiceMethod({
        auther: () => ProductAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => await prisma.product.findMany()
    })

    export const read = ServiceMethod({
        auther: () => ProductAuthers.read.dynamicFields({}),
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
    })

    export const readByBarCode = ServiceMethod({
        auther: () => ProductAuthers.read.dynamicFields({}),
        dataSchema: ProductSchemas.readByBarCode,
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
    })

    export const update = ServiceMethod({
        auther: () => ProductAuthers.update.dynamicFields({}),
        dataSchema: ProductSchemas.update,
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
    })

    export const updateForShop = ServiceMethod({
        auther: () => ProductAuthers.update.dynamicFields({}),
        dataSchema: ProductSchemas.updateForShop,
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
    })
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

