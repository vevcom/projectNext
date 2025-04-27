import { z } from 'zod'

export namespace PaymentSchemas {
    export const create = z.object({
        amount: z.coerce.number().int().positive(),
        toAccountId: z.coerce.number().int(),
    })
}
