import { defineOperation } from '@/services/serviceOperation'
import '@pn-server-only'
import { z } from 'zod'
import type { ExtendedShop } from './Types'
import { shopSchemas } from './schema'
import { shopAuth } from './auth'

export const shopOperations = {
    create: defineOperation({
        dataSchema: shopSchemas.create,
        authorizer: () => shopAuth.create.dynamicFields({}),
        operation: async ({ prisma, data }) => prisma.shop.create({
            data
        })
    }),

    readMany: defineOperation({
        authorizer: () => shopAuth.read.dynamicFields({}),
        operation: ({ prisma }) => prisma.shop.findMany(),
    }),

    read: defineOperation({
        authorizer: () => shopAuth.read.dynamicFields({}),
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

