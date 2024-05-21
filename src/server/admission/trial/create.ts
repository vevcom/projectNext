import 'server-only'
import { CreateAdmissionTrialType, createAdmissionTrialValidation } from './validation';
import { prismaCall } from '@/server/prismaCall';
import { AdmissionTrial } from '@prisma/client';

export async function createAdmissionTrial(
    data: CreateAdmissionTrialType['Detailed']
): Promise<AdmissionTrial> {
    const parse = createAdmissionTrialValidation.detailedValidate(data)

    return await prismaCall(() => prisma.admissionTrial.create({
        data: {
            user: {
                connect: {
                    id: parse.userId,
                },
            },
            registeredBy: {
                connect: {
                    id: parse.registeredBy,
                },
            },
            admission: {
                connect: {
                    id: parse.admissionId,
                },
            },
        }
    }))
}