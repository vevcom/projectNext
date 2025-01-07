import 'server-only'
import { updateJobAdValidation } from './validation'
import { UpdateJobAdAuther } from './Authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const updateJobAd = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataValidation: updateJobAdValidation,
    auther: UpdateJobAdAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params: { id }, data }) => await prisma.jobAd.update({
        where: { id },
        data,
    })
})
