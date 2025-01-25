import 'server-only'
import { convertBarcode } from './create'
import { updateProductForShopValidation, updateProductValidation } from '@/services/shop/validation'
import { ServiceMethod } from '@/services/ServiceMethod'
import { updateProductAuther } from '@/services/shop/authers'
import { z } from 'zod'


export const updateProduct = ServiceMethod({
    auther: () => updateProductAuther.dynamicFields({}),
    dataValidation: updateProductValidation,
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

export const updateProductForShop = ServiceMethod({
    auther: () => updateProductAuther.dynamicFields({}),
    dataValidation: updateProductForShopValidation,
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
