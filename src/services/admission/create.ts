import 'server-only'
import { createAdmissionTrialValidation } from './validation'
import { readUserAdmissionTrials } from './read'
import { userFilterSelection } from '@/services/users/ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import prisma from '@/prisma'
import { Admission } from '@prisma/client'
import type { CreateAdmissionTrialType } from './validation'
import type { ExpandedAdmissionTrial } from './Types'

export async function createAdmissionTrial(
    data: CreateAdmissionTrialType['Detailed']
): Promise<ExpandedAdmissionTrial> {
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
            admission: parse.admission,
        },
        include: {
            user: {
                select: userFilterSelection
            }
        }
    }))

    // check if user has taken all admissions
    const userTrials = await readUserAdmissionTrials(parse.userId)

    if (Object.keys(Admission).length === userTrials.length) {
        updateUserOmegaMembershipGroup(parse.userId, 'MEMBER', true)
    }

    return results
}
