import { dateLessThan } from '@/lib/dates/comparison'
import { ValidationBase } from '@/services/Validation'
import { BookingPeriodType } from '@prisma/client'
import { z } from 'zod'

const baseCabinValidation = new ValidationBase({
    type: {
        id: z.number(),
        userId: z.coerce.number(),
        releaseTime: z.string().datetime(),
        type: z.nativeEnum(BookingPeriodType),
        start: z.string().date(),
        end: z.string().date(),
        name: z.string(),
        capacity: z.coerce.number(),
        notes: z.string().optional(),
    },
    details: {
        id: z.number(),
        userId: z.coerce.number(),
        releaseTime: z.string().datetime(),
        type: z.nativeEnum(BookingPeriodType),
        start: z.date(),
        end: z.date(),
        name: z.string().min(2).max(20),
        capacity: z.coerce.number().int().min(0),
        notes: z.string().optional(),
    }
})

const refiner = {
    fcn: (data: { start: Date, end: Date }) => dateLessThan(data.start, data.end),
    message: 'Start dato må være før sluttdato.'
}

export const createRoomValidation = baseCabinValidation.createValidation({
    keys: ['name', 'capacity'],
    transformer: data => data,
})

export const createBookingPeriodValidation = baseCabinValidation.createValidation({
    keys: ['start', 'end', 'type', 'notes'],
    transformer: data => ({
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
    }),
    refiner,
})

