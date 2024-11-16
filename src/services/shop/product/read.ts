import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { readProductByBarcodeValidation } from '@/services/shop/validation'
import { ServerError } from '@/services/error'
import type { ExtendedProduct } from './Types'

export const readProducts = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.product.findMany()
})

export const readProductByBarCode = ServiceMethodHandler({
    withData: true,
    validation: readProductByBarcodeValidation,
    handler: async (prisma, _, data): Promise<ExtendedProduct | null> => {
        const results = await prisma.product.findUnique({
            where: {
                barcode: data.barcode.toString()
            },
            include: {
                ShopProduct: {
                    where: {
                        shopId: data.shopId,
                        active: true,
                    }
                }
            }
        })

        if (!results || results.ShopProduct.length === 0) {
            throw new ServerError(
                'NOT FOUND',
                `Could not find any prduct with barcode ${data.barcode} in shop ${data.shopId}.`
            )
        }

        const ret = {
            ...results,
            price: 0,
        }
        Reflect.deleteProperty(ret, 'ShopProduct')
        ret.price = results.ShopProduct[0].price

        return ret
    }
})
