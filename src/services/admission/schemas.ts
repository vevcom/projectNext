import { z } from 'zod'

export namespace AdmissionSchemas {
    const fields = z.object({
        userId: z.coerce.number(),
    })
    export const createTrial = fields.pick({
        userId: true,
    })
}
