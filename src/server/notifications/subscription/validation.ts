
import { parseMethods as ParseMethods, validateMethods as ValidateMethods } from "../channel/validation";

import { ValidationBase, ValidationTypes } from '@/server/Validation'
import { z } from 'zod'

export const parseMethods = ParseMethods
export const validateMethods = ValidateMethods

export const baseSubscriptionValidation = new ValidationBase({
    type: {
        channelId: z.string().or(z.number()),
        userId: z.string().or(z.number()),
    },
    details: {
        channelId: z.number().min(1),
        userId: z.number().min(1),
    }
})

export const updateSubscriptionActionValidation = baseSubscriptionValidation.createValidation({
    keys: [
        'channelId',
    ],
    transformer: data => ({
        channelId: Number(data.channelId),
    }),
})
export type UpdateSubscriptionActionType = ValidationTypes<typeof updateSubscriptionActionValidation>

export const updateSubscriptionValidation = baseSubscriptionValidation.createValidation({
    keys: [
        'channelId',
        'userId',
    ],
    transformer: data => ({
        channelId: Number(data.channelId),
        userId: Number(data.userId),
    }),
})
export type UpdateSubscriptionType = ValidationTypes<typeof updateSubscriptionValidation>