import '@pn-server-only'
import { schoolAuth } from './auth'
import { SchoolFilteredSelection, SchoolRelationIncluder } from './ConfigVars'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { defineOperation } from '@/services/serviceOperation'
import { cmsImageOperations } from '@/cms/images/operations'
import { cmsLinkOperations } from '@/cms/links/operations'
import { z } from 'zod'

const read = defineOperation({
    authorizer: () => schoolAuth.read.dynamicFields({}),
    paramsSchema: z.object({
        shortName: z.string()
    }),
    operation: ({ params, prisma }) =>
        prisma.school.findUniqueOrThrow({
            where: {
                shortName: params.shortName
            },
            select: {
                ...SchoolFilteredSelection,
                ...SchoolRelationIncluder,
            },
        })
})

const updateCmsParagraphContent = cmsParagraphOperations.updateContent.implement({
    authorizer: () => schoolAuth.updateCmsParagraph.dynamicFields({}),
    implementationParamsSchema: z.object({
        shortName: z.string()
    }),
    ownershipCheck: async ({ params, implementationParams }) => {
        const school = await read({ params: implementationParams })
        return school.cmsParagraph.id === params.id
    }
})

const updateCmsImage = cmsImageOperations.update.implement({
    authorizer: () => schoolAuth.updateCmsImage.dynamicFields({}),
    implementationParamsSchema: z.object({
        shortName: z.string()
    }),
    ownershipCheck: async ({ params, implementationParams }) => {
        const school = await read({ params: implementationParams })
        return school.cmsImage.id === params.id
    }
})

const updateCmsLink = cmsLinkOperations.update.implement({
    authorizer: () => schoolAuth.updateCmsLink.dynamicFields({}),
    implementationParamsSchema: z.object({
        shortName: z.string()
    }),
    ownershipCheck: async ({ params, implementationParams }) => {
        const school = await read({ params: implementationParams })
        return school.cmsLink.id === params.id
    }
})

export const schoolOperations = {
    read,
    updateCmsParagraphContent,
    updateCmsImage,
    updateCmsLink
} as const
