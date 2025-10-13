import { notificationMethodSchema } from '@/services/notifications/schemas'
import { z } from 'zod'

const baseSchema = z.object({
    subscriptions: z.array(z.object({
        channelId: z.number().min(1),
        methods: notificationMethodSchema,
    })),
})

export const subscriptionSchemas = {
    update: baseSchema.pick({
        subscriptions: true,
    }),
}
