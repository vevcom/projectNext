import { NotificationSchemas } from '@/services/notifications/schemas'
import { z } from 'zod'


export namespace SubscriptionSchemas {

    const fields = z.object({
        subscriptions: z.array(z.object({
            channelId: z.number().min(1),
            methods: NotificationSchemas.notificationMethodFields,
        })),
    })

    export const update = fields.pick({
        subscriptions: true,
    })
}
