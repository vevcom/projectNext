import { z } from 'zod'

export namespace ThemeSchemas {
    const themeColorValidation = z.string().regex(
        /^#[0-9A-Fa-f]{6}$/, 'Farge må være en gyldig hex-farge'
    ).transform(value => value.toUpperCase())

    const fields = z.object({
        name: z.string().min(3, 'Navn må ha minst 3 tegn').max(30, 'Navn kan ha maks 30 tegn').trim(),
        primaryLight: themeColorValidation,
        primaryDark: themeColorValidation,
        secondaryLight: themeColorValidation,
        secondaryDark: themeColorValidation,
    })

    export const create = fields.pick({
        name: true,
        primaryLight: true,
        primaryDark: true,
        secondaryLight: true,
        secondaryDark: true,
    })

    export const update = fields.partial().pick({
        name: true,
        primaryLight: true,
        primaryDark: true,
        secondaryLight: true,
        secondaryDark: true,
    })
}