import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const sendMailSchema = zfd.formData({
    sender: z.string().email("Ikke en gyldig epost"),
    recipient: z.string().email("Ikke en gyldig epost"),
    subject: z.string().min(2, "Minimum 2 tegn").max(100, "Maksimum 100 tegn"),
    text: z.string().min(2, "Minimum 2 tegn"),
})

export type SendMailSchemaType = z.infer<typeof sendMailSchema>