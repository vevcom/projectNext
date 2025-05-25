import { z } from 'zod'


export namespace NotificationSchemas {

    export const notificationMethodFields = z.object({
        email: z.boolean(),
        emailWeekly: z.boolean(),
        push: z.boolean(),
    })

    const fields = z.object({
        channelId: z.coerce.number().min(1),
        title: z.string().min(2),
        message: z.string().min(10),
        email: z.string().email(),
        userIdList: z.number().array().optional(),
    })

    export const create = fields.pick({
        channelId: true,
        title: true,
        message: true,
        userIdList: true,
    })

    export const createSpecial = fields.pick({
        title: true,
        message: true,
        userIdList: true,
    })

    export const sendMail = fields.pick({
        email: true,
    })

    export const sendEmail = fields.pick({
        title: true,
        message: true,
    })
}
