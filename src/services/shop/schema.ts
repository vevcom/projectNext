import { studentCardZodValidation } from '@/services/users/validation'
import { convertPrice } from '@/lib/money/convert'
import { ValidationBase, type ValidationTypes } from '@/services/Validation'
import { z } from 'zod'

export const createProductValidation = baseShopValidation.createValidation({
    keys: ['name', 'description', 'barcode'],
    transformer: data => data,
})

export const updateProductValidation = baseShopValidation.createValidation({
    keys: ['productId', 'name', 'description', 'barcode'],
    transformer: data => data,
})

export const readProductByBarcodeValidation = baseShopValidation.createValidation({
    keys: ['barcode', 'shopId'],
    transformer: data => data,
})

export const createProductForShopValidation = baseShopValidation.createValidation({
    keys: ['name', 'description', 'price', 'barcode'],
    transformer: data => ({
        ...data,
        price: convertPrice(data.price)
    })
})

export const updateProductForShopValidation = baseShopValidation.createValidation({
    keys: ['name', 'description', 'price', 'barcode', 'active'],
    transformer: data => ({
        ...data,
        price: convertPrice(data.price),
        active: data.active === 'on' || data.active === true
    })
})

export const createPurchaseFromStudentCardValidation = baseShopValidation.createValidation({
    keys: ['shopId', 'products', 'studentCard'],
    transformer: data => data,
})

export const createShopProductConnectionValidation = baseShopValidation.createValidation({
    keys: ['shopId', 'productId', 'price'],
    transformer: data => ({
        ...data,
        price: convertPrice(data.price)
    })
})

export namespace ShopSchemas {
    const productsZodObject = z.array(z.object({
        id: z.number().int(),
        quantity: z.number().int().min(1)
    }))
    const fields = z.object({
        shopId: z.coerce.number().int(),
        name: z.string().min(3),
        description: z.string(),
        price: z.number().int().min(1),
        studentCard: studentCardZodValidation,
        products: productsZodObject,
        barcode: z.string().or(z.number()).optional(),
        active: z.boolean().or(z.enum(['on'])).optional().transform((val) => val === 'on' || val === true),
        productId: z.coerce.number().int(),
    })

    export const createShop = fields.pick({
        name: true,
        description: true,
    })

    export const updateShop = fields.pick({
        name: true,
        description: true,
    })
}