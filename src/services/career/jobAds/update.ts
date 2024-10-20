import 'server-only'
import { updateJobAdValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateJobAdValidation,
    handler: async (prisma, { id }: { id: number }, data) => {
        return await prisma.jobAd.update({
            where: { id },
            data,
        })
    }
})
