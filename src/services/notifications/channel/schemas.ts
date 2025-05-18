import { NotificationConfig } from '@/services/notifications/config'
import { SpecialNotificationChannel } from '@prisma/client'
import { z } from 'zod'
import type {
    ExpandedNotificationChannel,
    NotificationMethodGeneral,
    NotificationMethodTypes
} from '@/services/notifications/Types'


export namespace NotificationChannelSchemas {

    export function parseMethods(data: FormData, prefix?: NotificationMethodTypes) {
        return Object.fromEntries(NotificationConfig.methods.filter(m => NotificationConfig.methods.includes(m)).map(m => {
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
        for (let i = 0; i < NotificationConfig.methods.length; i++) {
            const a = availableMethods[NotificationConfig.methods[i]]
            const d = defaultMethods[NotificationConfig.methods[i]]

            if (d && !a) return false
        }

        return true
    }

    export function validateNewParent(
        channelId: number,
        newParentId: number,
        channels: ExpandedNotificationChannel[]
    ): boolean {
        return findValidParents(channelId, channels).map(c => c.id).includes(newParentId)
    }

    export function findValidParents(
        channelId: number,
        channels: ExpandedNotificationChannel[]
    ): ExpandedNotificationChannel[] {
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

    const fields = z.object({
        name: z.string().min(2),
        description: z.string(),
        special: z.nativeEnum(SpecialNotificationChannel),
        parentId: z.number().min(1),
        mailAliasId: z.number().min(1),
    })

    export const create = fields.pick({
        name: true,
        description: true,
        parentId: true,
    })

    export const update = fields.pick({
        name: true,
        description: true,
        parentId: true,
        mailAliasId: true,
    })
}
