import '@pn-server-only'
import { readSpecialCmsLinkAuther } from './authers'
import logger from '@/lib/logger'
import { serviceMethod } from '@/services/serviceMethod'
import { SpecialCmsLink } from '@prisma/client'
import { z } from 'zod'

export const readSpecialCmsLink = serviceMethod({
    paramsSchema: z.object({
        special: z.nativeEnum(SpecialCmsLink),
    }),
    authorizer: () => readSpecialCmsLinkAuther.dynamicFields({}),
    method: async ({ prisma, params: { special } }) => {
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
