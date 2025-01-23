import 'server-only'
import { createAdmissionTrialValidation } from './validation'
import { readUserAdmissionTrials } from './read'
import { createAdmissionTrialAuther } from './auth'
import { ServiceMethod } from '@/services/ServiceMethod'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { userFilterSelection } from '@/services/users/ConfigVars'
import { Admission } from '@prisma/client'
import { z } from 'zod'
import type { ExpandedAdmissionTrail } from './Types'

export const createAdmissionTrial = ServiceMethod({
    auther: createAdmissionTrialAuther,
    dynamicAuthFields: () => ({}),
    paramsSchema: z.object({
        admission: z.nativeEnum(Admission),
    }),
    dataValidation: createAdmissionTrialValidation,
    method: async ({ prisma, session, params, data }): Promise<ExpandedAdmissionTrail> => {
        const results = await prisma.admissionTrial.create({
            data: {
                user: {
                    connect: {
                        id: data.userId,
                    },
                },
                registeredBy: {
                    connect: {
                        id: session.user?.id,
                    },
                },
                admission: params.admission,
            },
            include: {
                user: {
                    select: userFilterSelection
                }
            }
        })

        // check if user has taken all admissions
        const userTrials = await readUserAdmissionTrials.newClient().execute({
            session,
            params: {
                userId: data.userId
            },
        })

        if (Object.keys(Admission).length === userTrials.length) {
            updateUserOmegaMembershipGroup(data.userId, 'MEMBER', true)
        }

        return results
    }
})
