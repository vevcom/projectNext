import { z } from 'zod'

export namespace LicenseSchemas {
    const schemaFields = z.object({
        name: z.string().min(
            5, 'Navn må være minst 5 tegn langt'
        ).max(
            50, 'Navn kan maks være 50 tegn langt'
        ),
        link: z.string().min(
            1, 'Link må være minst 1 tegn langt'
        )
    })
    export const create = schemaFields.pick({
        name: true,
        link: true,
    })
    export const update = schemaFields.partial().pick({
        name: true,
        link: true,
    })
}
