import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseLockerReservationValidation = new ValidationBase({
    type: {
        committeeId: z.string(),
        indefinateDate: z.string().optional(),
        endDate: z.string().optional()
    },
    details: {
        committeeId: z.number(),
        indefinateDate: z.boolean(),
        endDate: z.date().nullable()
    }
})


export const createLockerReservationValidation = baseLockerReservationValidation.createValidation({
    keys: [
        'committeeId',
        'indefinateDate',
        'endDate'
        ],
    transformer: data => ({
        committeeId: parseInt(data.committeeId),
        indefinateDate: data.indefinateDate ? data.indefinateDate === "on" : false,
        endDate: data.endDate ? new Date(data.endDate) : null
    })
})

export type CreateLockerReservationTypes = ValidationTypes<typeof createLockerReservationValidation>


export const updateLockerReservationValidation = baseLockerReservationValidation.createValidation({
    keys: [
        'committeeId',
        'indefinateDate',
        'endDate'
    ],
    transformer: data => ({
        committeeId: parseInt(data.committeeId),
        indefinateDate: data.indefinateDate ? data.indefinateDate === "on" : false,
        endDate: data.endDate ? new Date(data.endDate) : null
    })
})
export type UpdateLockerReservationTypes = ValidationTypes<typeof updateLockerReservationValidation>