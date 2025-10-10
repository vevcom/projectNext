import '@pn-server-only'
import { admissionSchemas } from './schemas'
import { admissionAuthers } from './authers'
import { userFilterSelection } from '@/services/users/config'
import { serviceMethod } from '@/services/serviceMethod'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { Admission } from '@prisma/client'
import { z } from 'zod'
import type { ExpandedAdmissionTrail } from './Types'

export const admissionMethods = {
    readTrial: serviceMethod({
        authorizer: () => admissionAuthers.readTrial.dynamicFields({}),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ prisma, params: { userId } }) => await prisma.admissionTrial.findMany({
            where: {
                userId,
            }
        })
    }),
    createTrial: serviceMethod({
        authorizer: () => admissionAuthers.createTrial.dynamicFields({}),
        paramsSchema: z.object({
            admission: z.nativeEnum(Admission),
        }),
        dataSchema: admissionSchemas.createTrial,
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
                        select: userFilterSelection,
                    }
                }
            })

            // check if user has taken all admissions
            const userTrials = await admissionMethods.readTrial({
                params: {
                    userId: data.userId
                },
            })

            if (Object.keys(Admission).length === userTrials.length) {
                updateUserOmegaMembershipGroup(data.userId, 'MEMBER', true)
            }

            return results
        }
    }),
}
