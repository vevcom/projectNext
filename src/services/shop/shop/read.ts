import 'server-only'
import type { ExtendedShop } from './Types'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readShopAuther, readShopsAuther } from '../authers'
import { z } from 'zod'

export const readShops = ServiceMethod({
    auther: () => readShopsAuther.dynamicFields({}),
    method: async ({ prisma }) => prisma.shop.findMany()
})

export const readShop = ServiceMethod({
    paramsSchema: z.object({
        shopId: z.number(),
    }),
    auther: () => readShopAuther.dynamicFields({}),
    method: async ({ prisma, params }): Promise<ExtendedShop | null> => {
        const results = await prisma.shop.findFirst({
            where: {
                id: params.shopId
            },
            include: {
                ShopProduct: {
                    include: {
                        product: true,
                    },
                },
            },
        })
        if (results === null) return null

        const ret: ExtendedShop = {
            ...results,
            products: []
        }
        Reflect.deleteProperty(ret, 'ShopProduct')
        ret.products = results.ShopProduct.map(shopProduct => ({
            price: shopProduct.price,
            active: shopProduct.active,
            ...shopProduct.product,
        }))

        return ret
    }
})
