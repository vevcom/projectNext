import 'server-only'
import { createLicenseValidation } from './validation'
import { createLicenseAuther } from './Authers'
import { ServiceMethod } from '@/services/ServiceMethod'

export const createLicense = ServiceMethod({
    auther: () => createLicenseAuther.dynamicFields({}),
    dataValidation: createLicenseValidation,
    method: async ({ prisma, data }) => await prisma.license.create({
        data,
    }),
})
