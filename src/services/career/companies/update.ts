import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { updateCompanyValidation } from './validation'

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