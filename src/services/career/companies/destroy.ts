import 'server-only'
import { DestroyCompanyAuther } from './Authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyCompany = ServiceMethod({
    paramsSchema: z.object({
        id: z.number()
    }),
    auther: DestroyCompanyAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { id } }) => {
        await prisma.company.delete({
            where: {
                id
            }
        })
    }
})
