import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createProductForShopValidation, createProductValidation } from '@/services/shop/validation'

export function convertBarcode(barcode?: string | number) {
    if (typeof barcode === 'string' || typeof barcode === 'number') {
        const stringBarcode = String(barcode).trim()
        if (stringBarcode.length > 0) {
            return stringBarcode
        }
    }
    return null
}

export const createProduct = ServiceMethodHandler({
    withData: true,
    validation: createProductValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, _, data) => prisma.product.create({
        data: {
            ...data,
            barcode: convertBarcode(data.barcode),
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
            barcode: convertBarcode(data.barcode),
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

