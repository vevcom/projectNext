import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseAccountValidation = new ValidationBase({
    type: {
        userId: z.number().optional(),
        groupId: z.number().optional(),
        payoutAccountNumber: z.string().optional(),
    },
    details: {
        userId: z.number().optional(),
        groupId: z.number().optional(),
        payoutAccountNumber: z.string().optional(),
    },
})

export const createAccountValidation = baseAccountValidation.createValidation({
    keys: ['userId', 'groupId', 'payoutAccountNumber'],
    transformer: data => data,
    refiner: {
        // Only one of userId and groupId can be set
        fcn: data => (data.userId === undefined) !== (data.groupId === undefined),
        message: 'Bruker- eller gruppe-ID må være satt.',
    },
})

export type CreateAccountTypes = ValidationTypes<typeof createAccountValidation>

export const updateAccountValidation = baseAccountValidation.createValidation({
    keys: ['payoutAccountNumber'],
    transformer: data => data,
})

export type UpdateAccountTypes = ValidationTypes<typeof updateAccountValidation>
