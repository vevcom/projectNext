import 'server-only'
import { createAdmissionTrialValidation } from './validation'
import { readUserAdmissionTrials } from './read'
import { prismaCall } from '@/server/prismaCall'
import { readAdmissions } from '@/server/admission/read'
import { updateUserOmegaMembershipGroup } from '@/server/groups/omegaMembershipGroups/update'
import prisma from '@/prisma'
import type { AdmissionTrial } from '@prisma/client'
import type { CreateAdmissionTrialType } from './validation'

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
    const [admissions, userTrials] = await Promise.all([
        readAdmissions({
            archived: false
        }),
        readUserAdmissionTrials(parse.userId),
    ])

    if (admissions.length === userTrials.length) {
        updateUserOmegaMembershipGroup(parse.userId, 'MEMBER', true)
    }

    return results
}
