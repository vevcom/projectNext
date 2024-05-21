import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import type { AdmissionTrial } from '@prisma/client'
import prisma from '@/prisma'


export async function readUserAdmissionTrials(userId: number): Promise<AdmissionTrial[]> {
    return await prismaCall(() => prisma.admissionTrial.findMany({
        where: {
            userId,
        }
    }))
}
