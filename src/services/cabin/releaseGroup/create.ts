import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'

export const createReleaseGroup = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.releaseGroup.create({})
})
