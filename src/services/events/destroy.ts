import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const destroyEvent = ServiceMethod({
    paramsSchema: z.object({
        id: z.number()
    }),
    auther: 'NO_AUTH', // Temp
    method: async ({ prisma, params }) => {
        await prisma.event.delete({
            where: {
                id: params.id
            }
        })
    }
})
