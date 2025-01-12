import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { prismaCall } from '@/services/prismaCall'
import { z } from 'zod'
import type { AdmissionTrial } from '@prisma/client'

export const readUserAdmissionTrials = ServiceMethod({
    auther: 'NO_AUTH',
    paramsSchema: z.object({
        userId: z.number(),
    }),
    method: async ({ prisma, params: { userId } }): Promise<AdmissionTrial[]> =>
        await prismaCall(() => prisma.admissionTrial.findMany({
            where: {
                userId,
            }
        })),
})
