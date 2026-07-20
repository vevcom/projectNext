import { imageSchemas, baseSchema } from '@/services/images/subservice/schemas'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

export const dynamicImageSchemas = {
    paramsSchemaCollection: imageSchemas.paramsSchemaCollection,
    createCollection: baseSchema.pick({
        collectionName: true,
        collectionDescription: true,
    }),
    readCollectionPage: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number()
        }),
        z.undefined()
    ),
} as const
