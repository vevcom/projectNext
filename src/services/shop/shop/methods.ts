import { ShopAuthers } from './authers'
import { ShopSchemas } from './schema'
import { serviceMethod } from '@/services/serviceMethod'
import '@pn-server-only'
import { z } from 'zod'
import type { ExtendedShop } from './Types'

export namespace ShopMethods {
    export const create = serviceMethod({
        dataSchema: ShopSchemas.create,
        authorizer: () => ShopAuthers.create.dynamicFields({}),
        method: async ({ prisma, data }) => prisma.shop.create({
            data
        })
    })

    export const readMany = serviceMethod({
        authorizer: () => ShopAuthers.read.dynamicFields({}),
        method: ({ prisma }) => prisma.shop.findMany(),
    })

    export const read = serviceMethod({
        authorizer: () => ShopAuthers.read.dynamicFields({}),
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

