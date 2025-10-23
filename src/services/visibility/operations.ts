import '@pn-server-only'
import { visibilitySchemas } from './schemas'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { ServerError } from '@/services/error'
import type { VisibilityMatrix } from './types'

export const visibilityOperations = {
    create: defineOperation({
        authorizer: ServerOnly,
        operation: ({ prisma }) =>
            prisma.visibility.create({ data: {} })
    }),

    destroy: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: visibilitySchemas.params,
        operation: ({ prisma, params }) =>
            prisma.visibility.delete({ where: { id: params.visibilityId } })
    }),

    update: defineSubOperation({
        paramsSchema: () => visibilitySchemas.params,
        dataSchema: () => visibilitySchemas.update,
        operation: () => async ({ prisma, params, data }) => {
            //Remove all current visibilityRequirements (and by cascade all visibilityRequirementGroups)
            await prisma.visibilityRequirement.deleteMany({
                where: { visibilityId: params.visibilityId }
            })

            const currentOrder = await readCurrentOmegaOrder()

            return prisma.visibility.update({
                where: { id: params.visibilityId },
                data: {
                    requirements: {
                        create: data.requirements.map(requirement => ({
                            conditions: {
                                create: requirement.conditions.map(condition => ({
                                    groupId: condition.groupId,
                                    type: condition.type,
                                    order: condition.type === 'ORDER' ? condition.order : currentOrder.order
                                }))
                            }
                        }))
                    }
                }
            })
        }
    }),

    read: defineSubOperation({
        paramsSchema: () => visibilitySchemas.params,
        operation: () => async ({ prisma, params }): Promise<VisibilityMatrix> => {
            const visibility = await prisma.visibility.findUnique({
                where: { id: params.visibilityId },
                include: {
                    requirements: {
                        include: {
                            conditions: true
                        }
                    }
                }
            })
            if (!visibility) throw new ServerError('NOT FOUND', 'Fant ikke synlighet')
            return {
                requirements: visibility.requirements.map(requirement => ({
                    conditions: requirement.conditions.map(condition => (condition.type === 'ORDER' ? {
                        groupId: condition.groupId,
                        type: condition.type,
                        order: condition.order
                    } : {
                        groupId: condition.groupId,
                        type: condition.type,
                    }))
                }))
            }
        }
    })
} as const
