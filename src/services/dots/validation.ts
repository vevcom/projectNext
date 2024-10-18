import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'

const baseDotValidation = new ValidationBase({
    type: {
        value: z.coerce.number(),
        reason: z.string(),
        userId: z.coerce.number(),
    },
    details: {
        value: z.coerce.number().int().min(
            1, 'Verdi må være et positivt heltall'
        ).max(
            100, 'Verdi kan ikke være større enn 100'
        ),
        reason: z.string().max(200, 'Begrunnelse kan ha maks 200 tegn').trim(),
        userId: z.coerce.number().int(),
    }
})

export const createDotValidation = baseDotValidation.createValidation({
    keys: ['value', 'reason', 'userId'],
    transformer: data => data,
})

export const updateDotValidation = baseDotValidation.createValidationPartial({
    keys: ['value', 'reason'],
    transformer: data => data,
})
