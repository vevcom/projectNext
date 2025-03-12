import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseLockerReservationValidation = new ValidationBase({
    type: {
        groupId: z.string(),
        indefinateDate: z.string().optional(),
        endDate: z.string().optional()
    },
    details: {
        groupId: z.number().nullable(),
        indefinateDate: z.boolean(),
        endDate: z.date().nullable()
    }
})

export const lockerReservationValidation = baseLockerReservationValidation.createValidation({
    keys: [
        'groupId',
        'indefinateDate',
        'endDate'
    ],
    transformer: data => ({
        groupId: data.groupId === 'null' ? null : parseInt(data.groupId, 10),
        indefinateDate: data.indefinateDate ? data.indefinateDate === 'on' : false,
        endDate: data.endDate ? (new Date(data.endDate)) : null
    })
})

export type LockerReservationValidationTypes = ValidationTypes<typeof lockerReservationValidation>

