import 'server-only'
import { updateLicenseValidation } from './validation'
import { updateLicenseAuther } from './Authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const updateLicense = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataValidation: updateLicenseValidation,
    auther: () => updateLicenseAuther.dynamicFields({}),
    method: async ({ prisma, params, data }) => {
        await prisma.license.update({
            where: {
                id: params.id
            },
            data
        })
    }
})
