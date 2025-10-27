import type { VisibilityMatrix, VisibilityRequirement } from '@/services/visibility/types'

/**
 * This function checks if any session (user) satisfying `visibilitySub` is also necessarily
 * satisfies `visibilitySuper`
 * session element in visibilitySub => session element in visibilitySuper
 * If the return is true the implication holds else it does not (necessarily) hold
 *
 * For this to be true every requirement in the `visibilitySuper` must be a super-requirement of
 * some requirement in the `visibilitySub`
 * @param visibilitySub
 * @param visibilitySuper
 */
export function isSubVisibility(visibilitySub: VisibilityMatrix, visibilitySuper: VisibilityMatrix): boolean {
    return visibilitySuper.requirements.every(
        superRequirement => visibilitySub.requirements.some(
            subRequirement => isSubRequirement(subRequirement, superRequirement)
        )
    )
}

function isSubRequirement(requirementSub: VisibilityRequirement, requirementSuper: VisibilityRequirement): boolean {
    return requirementSub.conditions.every(
        conditionSub => requirementSuper.conditions.some(
            conditionSuper => {
                if (conditionSub.groupId !== conditionSuper.groupId) return false
                if (conditionSub.type === 'ACTIVE' && conditionSuper.type === 'ACTIVE') return true
                if (conditionSub.type === 'ORDER' && conditionSuper.type === 'ORDER') {
                    return conditionSub.order === conditionSuper.order
                }
                // Condition types do not match....
                return false
            }
        )
    )
}
