import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import type { ExtendedShop } from './Types'

export const readShops = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => prisma.shop.findMany()
})

export const readShop = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { shopId }: { shopId: number }): Promise<ExtendedShop | null> => {
        const results = await prisma.shop.findFirst({
            where: {
                id: shopId
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
            ...shopProduct.product,
        }))

        return ret
    }
})
