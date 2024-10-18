import 'server-only'
import { ServiceMethodHandler } from "@/services/ServiceMethodHandler";
import { SpecialCmsLink } from '@prisma/client';
import logger from '@/logger';

export const readSpecial = ServiceMethodHandler({
    withData: false,
    handler: async (data, { special }: {special: SpecialCmsLink}) => {
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