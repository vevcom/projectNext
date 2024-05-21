import { prismaCall } from '@/server/prismaCall';
import { AdmissionTrial } from '@prisma/client';
import 'server-only'



export async function readUserAdmissionTrials(userId: number): Promise<AdmissionTrial[]> {

    return await prismaCall(() => prisma.admissionTrial.findMany({
        where: {
            userId,
        }
    }))
}