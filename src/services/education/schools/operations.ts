import '@pn-server-only'
import { schoolAuth } from './auth'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { z } from 'zod'

export const schoolOperations = {
    updateSchoolCmsParagraphContent: cmsParagraphOperations.updateContent.implement({
        authorizer: () => schoolAuth.updateSchoolCmsParagraph.dynamicFields({}),
        implementationParamsSchema: z.object({
            schoolId: z.number()
        }),
        ownershipCheck: ({ params, implementationParams }) => {
            console.log(params, implementationParams)
            return true
        }
    })
} as const
