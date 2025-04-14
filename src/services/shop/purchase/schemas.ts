import { UserSchemas } from '@/services/users/schemas'
import { z } from 'zod'

export namespace PurchaseSchemas {
    const productsZodObject = z.array(z.object({
        id: z.number().int(),
        quantity: z.number().int().min(1)
    }))

    const fields = z.object({
        shopId: z.coerce.number().int(),
        studentCard: UserSchemas.studentCardZodValidation,
        products: productsZodObject,
    })

    export const createFromStudentCard = fields.pick({
        shopId: true,
        products: true,
        studentCard: true,
    })
}

