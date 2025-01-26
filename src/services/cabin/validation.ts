import { dateLessThan, dateLessThanOrEqualTo } from '@/lib/dates/comparison'
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
        start: z.coerce.string().date(),
        end: z.coerce.string().date(),
        firstname: z.string(),
        lastname: z.string(),
        mobile: z.string(),
        amount: z.coerce.number(),
        tenantNotes: z.string().optional(),
        notes: z.string().optional(),
        name: z.string(),
        acceptedTerms: z.literal('on', {
            errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
        }),
    },
    details: {
        id: z.coerce.number(),
        userId: z.coerce.number(),
        releaseTime: z.date(),
        releaseUntil: z.date(),
        type: z.nativeEnum(BookingType),
        start: z.date(),
        end: z.date(),
        firstname: z.string().min(2).max(20),
        lastname: z.string().min(2).max(20),
        mobile: z.string(),
        amount: z.coerce.number().int().min(0),
        tenantNotes: z.string().optional(),
        notes: z.string().optional(),
        name: z.string().min(5),
        acceptedTerms: z.literal('on', {
            errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
        }),
    }
})

const refiner = {
    fcn: (data: { start: Date, end: Date }) =>
        dateLessThan(data.start, data.end) && dateLessThanOrEqualTo(new Date(), data.start),
    message: 'Start dato må være før sluttdato. Start daten må være i ramtiden'
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

export const createCabinBookingUserAttachedValidation = baseCabinValidation.createValidation({
    keys: ['start', 'end', 'tenantNotes', 'acceptedTerms'],
    transformer: data => ({
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
    }),
    refiner,
})

export const createCabinProductValidation = baseCabinValidation.createValidation({
    keys: ['name', 'type', 'amount'],
    transformer: data => data,
})
