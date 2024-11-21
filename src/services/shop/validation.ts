import { convertPrice } from '@/lib/money/convert'
import { ValidationBase, type ValidationTypes } from '@/services/Validation'
import { z } from 'zod'

const productsZodObject = z.array(z.object({
    id: z.number().int(),
    quantity: z.number().int().min(1)
}))

const baseShopValidation = new ValidationBase({
    type: {
        shopId: z.coerce.number().int(),
        name: z.string(),
        description: z.string(),
        price: z.number().or(z.string()),
        studentCard: z.string(),
        products: productsZodObject,
        barcode: z.string().or(z.number()).optional(),
        active: z.boolean().or(z.enum(['on'])).optional(),
        productId: z.coerce.number().int(),
    },
    details: {
        shopId: z.coerce.number().int(),
        name: z.string().min(3),
        description: z.string(),
        price: z.number().int().min(1),
        studentCard: z.string(),
        products: productsZodObject,
        barcode: z.string().or(z.number()).optional(),
        active: z.boolean(),
        productId: z.coerce.number().int(),
    }
})

export const createShopValidation = baseShopValidation.createValidation({
    keys: ['name', 'description'],
    transformer: data => data,
})

export const updateShopValidation = createShopValidation

export const createProductValidation = baseShopValidation.createValidation({
    keys: ['name', 'description', 'barcode'],
    transformer: data => data,
})

export const updateProductValidation = createShopValidation

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
export type CreatePurchaseFromStudnetCardType = ValidationTypes<typeof createPurchaseFromStudentCardValidation>

export const createShopProductConnectionValidation = baseShopValidation.createValidation({
    keys: ['shopId', 'productId', 'price'],
    transformer: data => ({
        ...data,
        price: convertPrice(data.price)
    })
})
