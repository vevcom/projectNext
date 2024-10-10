
import { notificationMethods } from '@/services/notifications/Types'
import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import { SpecialNotificationChannel } from '@prisma/client'
import type { ValidationTypes } from '@/services/Validation'
import type {
    ExpandedNotificationChannel,
    NotificationMethodGeneral,
    NotificationMethodTypes
} from '@/services/notifications/Types'

export function parseMethods(data: FormData, prefix?: NotificationMethodTypes) {
    return Object.fromEntries(notificationMethods.filter(m => notificationMethods.includes(m)).map(m => {
        const compare = prefix ? `${prefix}_${m}` : m
        const value = data.get(compare)
        if (!value) {
            return [m, false]
        }

        return [m, value === 'on']
    })) as NotificationMethodGeneral
}

/**
 * Validates the available notification methods against the default methods.
 * @param availableMethods - The available notification methods.
 * @param defaultMethods - The default notification methods.
 * @returns A boolean indicating whether the available methods are valid.
 */
export function validateMethods(
    availableMethods: NotificationMethodGeneral,
    defaultMethods: NotificationMethodGeneral
): boolean {
    for (let i = 0; i < notificationMethods.length; i++) {
        const a = availableMethods[notificationMethods[i]]
        const d = defaultMethods[notificationMethods[i]]

        if (d && !a) return false
    }

    return true
}

export function validateNewParent(channelId: number, newParentId: number, channels: ExpandedNotificationChannel[]): boolean {
    return findValidParents(channelId, channels).map(c => c.id).includes(newParentId)
}

export function findValidParents(channelId: number, channels: ExpandedNotificationChannel[]): ExpandedNotificationChannel[] {
    const validParents = channels.filter(c => c.id !== channelId)
    // Remove chrildren of the current channel
    const channelIDS = new Set(validParents.map(c => c.id))
    for (let i = 0; i < 1000; i++) {
        const lengthBeforeReduction = channelIDS.size

        for (let j = validParents.length - 1; j >= 0; j--) {
            if (!channelIDS.has(validParents[j].parentId)) {
                channelIDS.delete(validParents[j].id)
                validParents.splice(j, 1)
            }
        }

        // Quit the loop if the last round didn't remove any more parent
        if (lengthBeforeReduction === channelIDS.size) {
            break
        }

        if (i >= 999) {
            // It's highly unlikely that this wil ever throw
            throw new Error('Stopping infinite loop, while finding valid parents.')
        }
    }

    return validParents
}

export const baseNotificaionChannelValidation = new ValidationBase({
    type: {
        id: z.string().or(z.number()),
        name: z.string(),
        description: z.string(),
        special: z.nativeEnum(SpecialNotificationChannel),
        parentId: z.string().or(z.number()),
        mailAliasId: z.string().or(z.number()),
    },
    details: {
        id: z.number(),
        name: z.string().min(2),
        description: z.string(),
        special: z.nativeEnum(SpecialNotificationChannel),
        parentId: z.number().min(1),
        mailAliasId: z.number().min(1),
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

export const updateNotificaionChannelValidation = baseNotificaionChannelValidation.createValidation({
    keys: [
        'id',
        'name',
        'description',
        'parentId',
        'mailAliasId',
    ],
    transformer: data => ({
        ...data,
        id: Number(data.id),
        parentId: Number(data.parentId),
        mailAliasId: Number(data.mailAliasId),
    }),
})
export type UpdateNotificationChannelType = ValidationTypes<typeof updateNotificaionChannelValidation>

export const destroyNotificaionChannelValidation = baseNotificaionChannelValidation.createValidation({
    keys: [
        'id',
    ],
    transformer: data => ({
        id: Number(data.id),
    }),
})
export type DestroyNotificationChannelType = ValidationTypes<typeof destroyNotificaionChannelValidation>

