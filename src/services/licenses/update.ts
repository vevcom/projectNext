import 'server-only'
import { updateLicenseValidation } from './validation'
import { ServiceMethodHandler } from '../ServiceMethodHandler'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateLicenseValidation,
    handler: async (prisma, params: { id: number }, data) => {
        await prisma.license.update({
            where: {
                id: params.id
            },
            data
        })
    }
})