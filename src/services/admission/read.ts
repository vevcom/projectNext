import 'server-only'
import { prismaCall } from '@/services/prismaCall'
import type { AdmissionTrial } from '@prisma/client'
import { ServiceMethod } from '../ServiceMethod'
import { z } from 'zod'

export const readUserAdmissionTrials = ServiceMethod({
    auther: 'NO_AUTH',
    paramsSchema: z.object({
        userId: z.number(),
    }),
    method: async ({ prisma, params: { userId } }): Promise<AdmissionTrial[]>  => {
        return await prismaCall(() => prisma.admissionTrial.findMany({
            where: {
                userId,
            }
        }))
    },
})
