import { z } from 'zod'

const baseSchema = z.object({
    from: z.string().email('Ikke en gyldig e-post'),
    to: z.string().email('Ikke en gyldig e-post'),
    subject: z.string().min(2, 'Minimum 2 tegn').max(100, 'Maksimum 100 tegn'),
    text: z.string().min(2, 'Minimum 2 tegn'),
})

export const emailSchemas = {
    sendMail: baseSchema.pick({
        from: true,
        to: true,
        subject: true,
        text: true,
    })
} as const
