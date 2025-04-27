import { z } from 'zod'

export namespace PayoutSchemas {
    export const create = z.object({
        amount: z.coerce.number().int().positive(),
    })
}
