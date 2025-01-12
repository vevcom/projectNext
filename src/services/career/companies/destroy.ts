import 'server-only'
import { destroyCompanyAuther } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyCompany = ServiceMethod({
    paramsSchema: z.object({
        id: z.number()
    }),
    auther: destroyCompanyAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { id } }) => {
        await prisma.company.delete({
            where: {
                id
            }
        })
    }
})
