import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import logger from '@/logger'
import type { SpecialCmsLink } from '@prisma/client'

export const readSpecial = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { special }: {special: SpecialCmsLink}) => {
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
