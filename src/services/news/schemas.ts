import { Zpn } from '@/lib/fields/zpn'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    endDateTime: Zpn.date({ label: 'Avsluttning' }).optional()
})

export const newsSchemas = {
    params: z.object({
        id: z.number()
    }),
    create: baseSchema.pick({
        name: true,
        description: true,
        endDateTime: true
    }),
    update: baseSchema.pick({
        name: true,
        description: true,
        endDateTime: true
    }).partial(),
    readOldPage: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.undefined()
    ),
} as const
