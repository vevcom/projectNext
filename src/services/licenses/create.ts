import 'server-only'
import { ServiceMethodHandler } from "@/services/ServiceMethodHandler"
import { createLicenseValidation } from './validation'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createLicenseValidation,
    handler: async (prisma, _, data) => {
        return await prisma.license.create({
            data,
        })
    },
})