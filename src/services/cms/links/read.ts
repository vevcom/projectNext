import '@pn-server-only'
import { readSpecialCmsLinkAuther } from './authers'
import logger from '@/lib/logger'
import { defineOperation } from '@/services/serviceOperation'
import { SpecialCmsLink } from '@prisma/client'
import { z } from 'zod'

export const readSpecialCmsLink = defineOperation({
    paramsSchema: z.object({
        special: z.nativeEnum(SpecialCmsLink),
    }),
    authorizer: () => readSpecialCmsLinkAuther.dynamicFields({}),
    operation: async ({ prisma, params: { special } }) => {
        const cmsLink = await prisma.cmsLink.findUnique({
            where: { special }
        })
        if (!cmsLink) {
            logger.error(`Could not find special cms link with special ${special} - creating it!`)
            return await prisma.cmsLink.create({
                data: { special }
            })
        }
        return cmsLink
    }
})
