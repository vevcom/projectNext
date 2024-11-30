import { dateLessThan } from '@/lib/dates/comparison'
import { ValidationBase } from '@/services/Validation'
import { BookingType } from '@prisma/client'
import { z } from 'zod'

const baseCabinValidation = new ValidationBase({
    type: {
        id: z.coerce.number(),
        userId: z.coerce.number(),
        releaseTime: z.string(),
        releaseUntil: z.string(),
        type: z.nativeEnum(BookingType),
        start: z.string().date(),
        end: z.string().date(),
        name: z.string(),
        capacity: z.coerce.number(),
        notes: z.string().optional(),
    },
    details: {
        id: z.coerce.number(),
        userId: z.coerce.number(),
        releaseTime: z.date(),
        releaseUntil: z.date(),
        type: z.nativeEnum(BookingType),
        start: z.date(),
        end: z.date(),
        name: z.string().min(2).max(20),
        capacity: z.coerce.number().int().min(0),
        notes: z.string().max(20).optional(),
    }
})

const refiner = {
    fcn: (data: { start: Date, end: Date }) => dateLessThan(data.start, data.end),
    message: 'Start dato må være før sluttdato.'
}

const releasePeriodRefiner = {
    fcn: (data: { releaseTime: Date, releaseUntil: Date}) => dateLessThan(data.releaseTime, data.releaseUntil),
    message: 'Slipp tiden må være før slutten av perioden som slippes.'
}


export const createReleasePeriodValidation = baseCabinValidation.createValidation({
    keys: ['releaseTime', 'releaseUntil'],
    transformer: data => ({
        releaseUntil: new Date(data.releaseUntil),
        releaseTime: new Date(data.releaseTime),
    }),
    refiner: releasePeriodRefiner,
})

export const updateReleasePeriodValidation = baseCabinValidation.createValidation({
    keys: ['id', 'releaseTime', 'releaseUntil'],
    transformer: data => ({
        ...data,
        releaseUntil: new Date(data.releaseUntil),
        releaseTime: new Date(data.releaseTime),
    }),
    refiner: releasePeriodRefiner,
})

