import 'server-only'
import { readProductByBarcodeValidation } from '@/services/shop/validation'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readProductAuther } from '@/services/shop/authers'
import { z } from 'zod'
import type { ExtendedProduct } from './Types'

export const readProducts = ServiceMethod({
    auther: () => readProductAuther.dynamicFields({}),
    method: async ({ prisma }) => await prisma.product.findMany()
})

export const readProduct = ServiceMethod({
    auther: () => readProductAuther.dynamicFields({}),
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

export const readProductByBarCode = ServiceMethod({
    auther: () => readProductAuther.dynamicFields({}),
    dataValidation: readProductByBarcodeValidation,
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
