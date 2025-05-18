import { z } from 'zod'


export namespace NotificationSchemas {

    export const notificationMethodFields = z.object({
        email: z.boolean(),
        emailWeekly: z.boolean(),
        push: z.boolean(),
    })

    const fields = z.object({
        channelId: z.number().min(1),
        title: z.string().min(2),
        message: z.string().min(10),
        email: z.string().email(),
    })

    export const dispatch = fields.pick({
        channelId: true,
        title: true,
        message: true,
    })

    export const sendMail = fields.pick({
        email: true,
    })
}
