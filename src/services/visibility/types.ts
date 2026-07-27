import type { visibilityOperations } from './operations'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { VisibilityRequirementGroupType } from '@/prisma-generated-pn-types'

export type VisibilityCondition = {
    type: Extract<VisibilityRequirementGroupType, 'ORDER'>
    groupId: number
    order: number
} | {
    type: Extract<VisibilityRequirementGroupType, 'ACTIVE'>
    groupId: number
}

export type VisibilityRequirement = {
    conditions: VisibilityCondition[]
}

export type VisibilityMatrix = {
    requirements: VisibilityRequirement[]
}

export type DoubleLevelVisibilityMatrix = {
    regularLevel: VisibilityMatrix,
    adminLevel: VisibilityMatrix
}

/**
 * The shape any owning service's `updateRegularLevel`/`updateAdminLevel` action has once its
 * implementationParams is bound (e.g. a collectionId) - still expecting `params: { visibilityId }`
 * to be bound, which VisibilityAdmin does itself once given the visibilityId.
 */
export type UpdateVisibilityAction = ActionFromSubServiceOperation<typeof visibilityOperations.update>
