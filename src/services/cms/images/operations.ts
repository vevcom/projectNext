import { ServerOnly } from '@/auth/auther/ServerOnly'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import '@pn-server-only'
import { cmsImageSchemas } from './schemas'
import { z } from 'zod'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'

const create = defineOperation({
    authorizer: ServerOnly,
    dataSchema: cmsImageSchemas.create
})

export const cmsImageOperations = {
    create,

    readSpecial: defineSubOperation({
        paramsSchema: () => z.object({
            special: z.nativeEnum(SpecialCmsImage)
        }),
        operation: () => async ({ prisma, params }) => {
            
        }
    })
} as const
