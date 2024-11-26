import { ValidationBase } from '@/services/Validation'
import { BookingPeriodType } from '@prisma/client'
import { z } from 'zod'

const baseCabinValidation = new ValidationBase({
    type: {
        id: z.number(),
        userId: z.coerce.number(),
        releaseTime: z.string().datetime(),
        type: z.nativeEnum(BookingPeriodType),
        start: z.string().datetime(),
        end: z.string().datetime(),
        name: z.string(),
        capacity: z.coerce.number(),
    },
    details: {
        id: z.number(),
        userId: z.coerce.number(),
        releaseTime: z.string().datetime(),
        type: z.nativeEnum(BookingPeriodType),
        start: z.string().datetime(),
        end: z.string().datetime(),
        name: z.string().min(2).max(20),
        capacity: z.coerce.number().int().min(0),
    }
})

export const createRoomValidation = baseCabinValidation.createValidation({
    keys: ['name', 'capacity'],
    transformer: data => data,
})

