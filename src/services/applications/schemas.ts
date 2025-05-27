import { z } from "zod";

export namespace ApplicationSchemas {
    const fields = z.object({
        text: z.string().trim().min(
            1, { message: 'Søknadsteksten kan ikke være tom.' }
        ).max(
            1000, { message: 'Søknadsteksten kan ikke være lengre enn 1000 tegn.' }
        ),
        priority: z.literal('UP').or(z.literal('DOWN'))
    })

    export const create = fields.pick({
        text: true,
    })

    export const update = fields.pick({
        text: true,
        priority: true
    }).partial()
}