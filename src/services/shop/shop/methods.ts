import { defineOperation } from '@/services/serviceOperation'
import '@pn-server-only'
import { z } from 'zod'
import type { ExtendedShop } from './Types'
import { shopSchemas } from './schema'
import { shopAuthers } from './authers'

export const shopMethods = {
    create: defineOperation({
        dataSchema: shopSchemas.create,
        authorizer: () => shopAuthers.create.dynamicFields({}),
        operation: async ({ prisma, data }) => prisma.shop.create({
            data
        })
    }),

    readMany: defineOperation({
        authorizer: () => shopAuthers.read.dynamicFields({}),
        operation: ({ prisma }) => prisma.shop.findMany(),
    }),

    read: defineOperation({
        authorizer: () => shopAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shopId: z.number(),
        }),
        operation: async ({ prisma, params }): Promise<ExtendedShop | null> => {
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
    }),
}

