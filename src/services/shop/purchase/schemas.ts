import { z } from 'zod'
import { studentCardZodValidation } from '@/services/users/validation'

export namespace PurchaseSchemas {
    const productsZodObject = z.array(z.object({
        id: z.number().int(),
        quantity: z.number().int().min(1)
    }))

    const fields = z.object({
        shopId: z.coerce.number().int(),
        studentCard: studentCardZodValidation,
        products: productsZodObject,
    })

    export const createFromStudentCard = fields.pick({
        shopId: true,
        products: true,
        studentCard: true,
    })
}

