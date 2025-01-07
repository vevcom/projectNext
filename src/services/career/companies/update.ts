import 'server-only'
import { updateCompanyValidation } from './validation'
import { UpdateCompanyAuther } from './Authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const updateCompany = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataValidation: updateCompanyValidation,
    auther: UpdateCompanyAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { id }, data }) => {
        await prisma.company.update({
            where: { id },
            data,
        })
    },
})
