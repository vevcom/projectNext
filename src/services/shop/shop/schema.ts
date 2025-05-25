import { z } from 'zod'

export namespace ShopSchemas {

    const fields = z.object({
        name: z.string().min(3),
        description: z.string(),
    })

    export const create = fields.pick({
        name: true,
        description: true,
    })
}

