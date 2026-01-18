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
