import 'server-only'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { AdmissionTrial } from '@prisma/client'


export async function readUserAdmissionTrials(userId: number): Promise<AdmissionTrial[]> {
    return await prismaCall(() => prisma.admissionTrial.findMany({
        where: {
            userId,
        }
    }))
}
