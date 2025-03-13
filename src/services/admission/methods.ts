import 'server-only'
import { AdmissionSchemas } from './schemas'
import { AdmissionAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { UserConfig } from '@/services/users/config'
import { Admission } from '@prisma/client'
import { z } from 'zod'
import type { ExpandedAdmissionTrail } from './Types'

export namespace AdmissionMethods {
    export const readTrial = ServiceMethod({
        auther: () => AdmissionAuthers.readTrial.dynamicFields({}),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ prisma, params: { userId } }) => await prisma.admissionTrial.findMany({
            where: {
                userId,
            }
        })
    })
    export const createTrial = ServiceMethod({
        auther: () => AdmissionAuthers.createTrial.dynamicFields({}),
        paramsSchema: z.object({
            admission: z.nativeEnum(Admission),
        }),
        dataSchema: AdmissionSchemas.createTrial,
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
                        select: UserConfig.filterSelection
                    }
                }
            })

            // check if user has taken all admissions
            const userTrials = await readTrial.newClient().execute({
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
}
