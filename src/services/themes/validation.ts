import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'

const themeColorValidation = z.string().regex(
            /^#[0-9A-Fa-f]{6}$/, 'Farge må være en gyldig hex-farge'
        ).transform(value => value.toUpperCase())

const baseThemeColorValidation = new ValidationBase({
    type: {
        name: z.string(),
        primaryLight: z.string(),
        primaryDark: z.string(),
        secondaryLight: z.string(),
        secondaryDark: z.string(),
    },
    details: {
        name: z.string().min(3, 'Navn må ha minst 3 tegn').max(30, 'Navn kan ha maks 30 tegn').trim(),
        primaryLight: themeColorValidation,
        primaryDark: themeColorValidation,
        secondaryLight: themeColorValidation,
        secondaryDark: themeColorValidation,
    }
})

export const createThemeColorValidation = baseThemeColorValidation.createValidation({
    keys: ['name', 'primaryLight', 'primaryDark', 'secondaryDark', 'secondaryLight'],
    transformer: data => data,
})

export const updateThemeColorValidation = baseThemeColorValidation.createValidationPartial({
    keys: ['name', 'primaryLight', 'primaryDark', 'secondaryDark', 'secondaryLight'],
    transformer: data => data,
})
