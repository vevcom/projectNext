

import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseNotificaionValidation = new ValidationBase({
    type: {
        channelId: z.string().or(z.number()),
        title: z.string(),
        message: z.string()
    },
    details: {
        channelId: z.number().min(1),
        title: z.string().min(2),
        message: z.string().min(10),
    }
})

export const createNotificaionValidation = baseNotificaionValidation.createValidation({
    keys: [
        'channelId',
        'title',
        'message',
    ],
    transformer: data => ({
        ...data,
        channelId: Number(data.channelId),
    }),
})
export type CreateNotificationType = ValidationTypes<typeof createNotificaionValidation>
