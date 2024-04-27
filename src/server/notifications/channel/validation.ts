
import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'
import { SpecialNotificationChannel } from '@prisma/client'
import { notificationMethodTypes, notificationMethods } from '../Types'
import type { NotificationMethod, NotificationMethodTypes, NotificationMethods } from '../Types'
import { ServerError } from '@/server/error'

export function parseMethods(data: FormData , prefix: undefined | NotificationMethodTypes) {
    console.log(data)

    return Object.fromEntries(notificationMethods.map(m => {
        const compare = prefix ? `${prefix}_${m}` : m
        const value = data.get(compare)
        if (!value) {
            return [m, false]
        }

        return [m, value === "on"]
    })) as NotificationMethod
}

export const baseNotificaionChannelValidation = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string(),
        special: z.nativeEnum(SpecialNotificationChannel),
        parentId: z.string().or(z.number()),
    },
    details: {
        name: z.string().min(2),
        description: z.string(),
        special: z.nativeEnum(SpecialNotificationChannel),
        parentId: z.number().min(1),
    }
})

export const createNotificaionChannelValidation = baseNotificaionChannelValidation.createValidation({
    keys: [
        'name',
        'description',
        'parentId',
    ],
    transformer: data => ({
        ...data,
        parentId: Number(data.parentId),
    }),
})
export type CreateNotificationChannelType = ValidationTypes<typeof createNotificaionChannelValidation>


