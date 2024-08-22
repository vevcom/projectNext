import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


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


export const createLockerReservationValidation = baseLockerReservationValidation.createValidation({
    keys: [
        'groupId',
        'indefinateDate',
        'endDate'
    ],
    transformer: data => ({
        // -1 is used to indicate that the locker is not being reserved by a group
        groupId: data.groupId === '-1' ? null : parseInt(data.groupId, 10),
        indefinateDate: data.indefinateDate ? data.indefinateDate === 'on' : false,
        endDate: data.endDate ? (new Date(data.endDate)) : null
    })
})

export type CreateLockerReservationTypes = ValidationTypes<typeof createLockerReservationValidation>


export const updateLockerReservationValidation = baseLockerReservationValidation.createValidation({
    keys: [
        'groupId',
        'indefinateDate',
        'endDate'
    ],
    transformer: data => ({
        groupId: parseInt(data.groupId, 10),
        indefinateDate: data.indefinateDate ? data.indefinateDate === 'on' : false,
        endDate: data.endDate ? new Date(data.endDate) : null
    })
})

export type UpdateLockerReservationTypes = ValidationTypes<typeof updateLockerReservationValidation>
