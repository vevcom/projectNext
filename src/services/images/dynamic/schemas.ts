import { imageSchemas, baseSchema } from '@/services/images/subservice/schemas'

export const dynamicImageSchemas = {
    paramsSchemaCollection: imageSchemas.paramsSchemaCollection,
    createCollection: baseSchema.pick({
        collectionName: true,
        collectionDescription: true,
    })
} as const
