import { z } from 'zod'

export namespace LockersSchemas {
    const fields = z.object({
        building: z.string(),
        floor: z.coerce.number(),
        id: z.coerce.number()
    })
    export const create = fields.pick({
        building: true,
        floor: true,
        id: true
    })

    export const createLocation = fields.pick({
        building: true,
        floor: true,
    })
}
