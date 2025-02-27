import 'server-only'
import {
    createProductForShopValidation,
    createProductValidation,
    createShopProductConnectionValidation } from '@/services/shop/validation'
import { ServiceMethod } from '@/services/ServiceMethod'
import { createProductAuther, createShopProductConnectionAuther } from '@/services/shop/authers'
import { z } from 'zod'

export function convertBarcode(barcode?: string | number) {
    if (typeof barcode === 'string' || typeof barcode === 'number') {
        const stringBarcode = String(barcode).trim()
        if (stringBarcode.length > 0) {
            return stringBarcode
        }
    }
    return null
}

export const createProduct = ServiceMethod({
    auther: () => createProductAuther.dynamicFields({}),
    dataSchema: createProductValidation,
    method: async ({ prisma, data }) => prisma.product.create({
        data: {
            ...data,
            barcode: convertBarcode(data.barcode),
            name: data.name.toUpperCase()
        }
    })
})

export const createProductForShop = ServiceMethod({
    auther: () => createProductAuther.dynamicFields({}),
    paramsSchema: z.object({
        shopId: z.number(),
    }),
    dataValidation: createProductForShopValidation,
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

export const createShopProductConnection = ServiceMethod({
    auther: () => createShopProductConnectionAuther.dynamicFields({}),
    dataValidation: createShopProductConnectionValidation,
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

