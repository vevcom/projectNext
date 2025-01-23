import 'server-only'
import { readAdmissionTrialsAuther } from './auth'
import { ServiceMethod } from '@/services/ServiceMethod'
import { prismaCall } from '@/services/prismaCall'
import { z } from 'zod'
import type { AdmissionTrial } from '@prisma/client'

export const readUserAdmissionTrials = ServiceMethod({
    auther: readAdmissionTrialsAuther,
    dynamicAuthFields: () => ({}),
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
