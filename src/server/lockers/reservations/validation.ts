import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseLockerReservationValidation = new ValidationBase({
    type: {
        committeeId: z.string().transform(value => parseFloat(value)),
        lockerId: z.string().transform(value => parseFloat(value)),
        endDate: z.string().pipe( z.coerce.date() )
    },
    details: {
        committeeId: z.string().transform(value => parseFloat(value)),
        lockerId: z.string().transform(value => parseFloat(value)),
        endDate: z.string().pipe( z.coerce.date() )
    }
})

export const createLockerReservationValidation = baseLockerReservationValidation.createValidation({
    keys: ['lockerId', 'committeeId', 'endDate'],
    transformer: data => data
})

export type CreateLockerReservationTypes = ValidationTypes<typeof createLockerReservationValidation>
