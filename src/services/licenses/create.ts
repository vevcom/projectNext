import 'server-only'
import { createLicenseValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createLicenseValidation,
    handler: async (prisma, _, data) => await prisma.license.create({
        data,
    }),
})
