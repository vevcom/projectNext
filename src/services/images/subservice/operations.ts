import '@pn-server-only'
import { defineSubOperation } from '@/services/serviceOperation'
import { z } from 'zod'
import { imageSchemas } from './schemas'

export const imageOperations = {
    createCollection: defineSubOperation({

    }),
    updateCollection: defineSubOperation({
        paramsSchema: () => z.object({
            collectionId: z.number(),
        }),
        dataSchema: () => imageSchemas.updateCollection,
        operation: () => ({ params, data }) => {

        }
    }),
    uploadOneImage: defineSubOperation({

    }),
    uploadManyImages: defineSubOperation({

    }),
    readImagePage: defineSubOperation({

    }),
} as const
