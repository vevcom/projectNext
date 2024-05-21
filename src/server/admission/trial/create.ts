import 'server-only'
import { CreateAdmissionTrialType, createAdmissionTrialValidation } from './validation';
import { prismaCall } from '@/server/prismaCall';
import { AdmissionTrial } from '@prisma/client';
import { readAllAdmissions } from '@/server/admission/read';
import { readUserAdmissionTrials } from './read';
import { updateUserOmegaMembershipGroup } from '@/server/groups/omegaMembershipGroups/update';

export async function createAdmissionTrial(
    data: CreateAdmissionTrialType['Detailed']
): Promise<AdmissionTrial> {
    const parse = createAdmissionTrialValidation.detailedValidate(data)

    const results = await prismaCall(() => prisma.admissionTrial.create({
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

    // check if user has taken all admissions
    const [ admissions, userTrials ] = await Promise.all([
        readAllAdmissions(),
        readUserAdmissionTrials(parse.userId),
    ])

    if (admissions.length === userTrials.length) {
        updateUserOmegaMembershipGroup(parse.userId, "MEMBER", true)
    }

    return results
}