import 'server-only'
import { convertBarcode } from './create'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { updateProductForShopValidation, updateProductValidation } from '@/services/shop/validation'


export const updateProduct = ServiceMethodHandler({
    withData: true,
    validation: updateProductValidation,
    handler: async (prisma, _, data) => prisma.product.update({
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

export const updateProductForShop = ServiceMethodHandler({
    withData: true,
    validation: updateProductForShopValidation,
    wantsToOpenTransaction: true,
    handler: async (prisma, { shopId, productId }: { shopId: number, productId: number }, data) => prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            name: data.name.toUpperCase(),
            description: data.description,
            barcode: convertBarcode(data.barcode),
            ShopProduct: {
                update: {
                    where: {
                        shopId_productId: {
                            shopId,
                            productId
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
