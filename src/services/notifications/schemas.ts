import { z } from 'zod'

export const notificationMethodSchema = z.object({
    email: z.boolean(),
    emailWeekly: z.boolean(),
})

const baseSchema = z.object({
    channelId: z.coerce.number().min(1),
    title: z.string().min(2),
    message: z.string().min(10),
    email: z.string().email(),
    userIdList: z.number().array().optional(),
})

export const notificationSchemas = {
    create: baseSchema.pick({
        channelId: true,
        title: true,
        message: true,
        userIdList: true,
    }),

    createSpecial: baseSchema.pick({
        title: true,
        message: true,
        userIdList: true,
    }),

    sendMail: baseSchema.pick({
        email: true,
    }),

    sendEmail: baseSchema.pick({
        title: true,
        message: true,
    }),
}
