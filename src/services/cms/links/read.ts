import 'server-only'
import { readSpecialCmsLinkAuther } from './authers'
import logger from '@/lib/logger'
import { ServiceMethod } from '@/services/ServiceMethod'
import { SpecialCmsLink } from '@prisma/client'
import { z } from 'zod'

export const readSpecialCmsLink = ServiceMethod({
    paramsSchema: z.object({
        special: z.nativeEnum(SpecialCmsLink),
    }),
    auther: () => readSpecialCmsLinkAuther.dynamicFields({}),
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
