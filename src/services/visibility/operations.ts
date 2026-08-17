import '@pn-server-only'
import { visibilitySchemas } from './schemas'
import { defineSubOperation } from '@/services/serviceOperation'
import { omegaOrderOperations } from '@/services/omegaOrder/operations'
import type { VisibilityRequirementGroupType } from '@/prisma-generated-pn-types'

type VisibilityCondition = {
    groupId: number,
    type: VisibilityRequirementGroupType,
    order: number,
}

/**
 * Drops conditions that are identical in every field, so that a requirement listing the same group
 * twice does not collide on @@unique([visibilityRequirementId, groupId, order]).
 *
 * Note this cannot remove every possible collision: an ACTIVE and an ORDER condition on the same
 * group resolve to the same (groupId, order) row when the order is the current one, yet mean
 * different things to checkVisibility. Those still hit the unique index and roll the transaction
 * back, which is the safe outcome.
 */
function dedupeConditions(conditions: VisibilityCondition[]): VisibilityCondition[] {
    const seen = new Map<string, VisibilityCondition>()
    conditions.forEach(condition => {
        seen.set(`${condition.groupId}-${condition.type}-${condition.order}`, condition)
    })
    return Array.from(seen.values())
}

export const visibilityOperations = {
    create: defineSubOperation({
        operation: () => ({ prisma }) =>
            prisma.visibility.create({ data: {} })
    }),

    destroy: defineSubOperation({
        paramsSchema: () => visibilitySchemas.params,
        operation: () => ({ prisma, params }) =>
            prisma.visibility.delete({ where: { id: params.visibilityId } })
    }),

    update: defineSubOperation({
        paramsSchema: () => visibilitySchemas.params,
        dataSchema: () => visibilitySchemas.update,
        opensTransaction: true,
        operation: () => async ({ prisma, params, data }) => {
            const currentOrder = await omegaOrderOperations.readCurrent({ bypassAuth: true })

            const requirements = data.requirements.map(requirement => ({
                conditions: {
                    create: dedupeConditions(requirement.conditions.map(condition => ({
                        groupId: condition.groupId,
                        type: condition.type,
                        order: condition.type === 'ORDER' ? condition.order : currentOrder.order
                    })))
                }
            }))

            return await prisma.$transaction(async (tx) => {
                //Remove all current visibilityRequirements (and by cascade all visibilityRequirementGroups)
                await tx.visibilityRequirement.deleteMany({
                    where: { visibilityId: params.visibilityId }
                })

                return await tx.visibility.update({
                    where: { id: params.visibilityId },
                    data: { requirements: { create: requirements } }
                })
            })
        }
    })
} as const
