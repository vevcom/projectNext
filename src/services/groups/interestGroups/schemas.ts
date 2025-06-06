import { z } from 'zod'

export namespace InterestGroupSchemas {
    const fields = z.object({
        name: z.string().min(
            3, 'Navn må ha minst 3 tegn'
        ).max(
            30, 'Navn kan ha maks 30 tegn'
        ).trim(),
        shortName: z.string().min(
            3, 'Kortnavn må ha minst 3 tegn'
        ).max(
            10, 'Kortnavn kan ha maks 10 tegn'
        ).trim(),
    })

    export const create = fields.pick({
        name: true,
        shortName: true,
    })

    export const update = fields.partial().pick({
        name: true,
        shortName: true,
    })
}
