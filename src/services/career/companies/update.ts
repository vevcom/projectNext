import 'server-only'
import { updateCompanyValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateCompanyValidation,
    handler: async (prisma, { id }: { id: number }, data) => {
        await prisma.company.update({
            where: { id },
            data,
        })
    }
})
