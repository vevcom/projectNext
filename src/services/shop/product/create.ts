import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createProductForShopValidation, createProductValidation } from '@/services/shop/validation'


export const createProduct = ServiceMethodHandler({
    withData: true,
    validation: createProductValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, _, data) => prisma.product.create({
        data: {
            ...data,
            name: data.name.toUpperCase()
        }
    })
})

export const createProductForShop = ServiceMethodHandler({
    withData: true,
    validation: createProductForShopValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, { shopId }: { shopId: number }, data) => prisma.product.create({
        data: {
            name: data.name.toUpperCase(),
            description: data.description,
            ShopProduct: {
                create: {
                    price: data.price,
                    shop: {
                        connect: {
                            id: shopId,
                        },
                    },
                },
            },
        },
    })
})

