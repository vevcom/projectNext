import { Zpn } from '@/lib/fields/zpn'
import { imageSchemas } from '@/services/images/subservice/schemas'
import { z } from 'zod'

const baseSchema = z.object({
    title: z.string().min(2, 'min length is 2').max(80, 'max length is 80'),
    text: z.string().min(2, 'min length is 2').max(300, 'max length is 300'),
    link: z.string().min(1, 'link kan ikke være tom'),
    startDate: Zpn.date({ label: 'Fra dato' }),
    endDate: Zpn.date({ label: 'Til dato' }),
})

export const promoSchema = {
    create: baseSchema.merge(imageSchemas.uploadImage),
    update: baseSchema.partial(),
    updateImage: imageSchemas.uploadImage,
} as const
