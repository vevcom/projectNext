import { ShopAuthers } from './authers'
import { ShopSchemas } from './schema'
import { ServiceMethod } from '@/services/ServiceMethod'
import 'server-only'
import { z } from 'zod'
import type { ExtendedShop } from './Types'

export namespace ShopMethods {
    export const create = ServiceMethod({
        dataSchema: ShopSchemas.create,
        auther: () => ShopAuthers.create.dynamicFields({}),
        method: async ({ prisma, data }) => prisma.shop.create({
            data
        })
    })

    export const readMany = ServiceMethod({
        auther: () => ShopAuthers.read.dynamicFields({}),
        method: ({ prisma }) => prisma.shop.findMany(),
    })

    export const read = ServiceMethod({
        auther: () => ShopAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shopId: z.number(),
        }),
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
}

