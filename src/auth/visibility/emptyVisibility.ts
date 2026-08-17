import type { DoubleLevelVisibilityMatrix } from '@/services/visibility/types'

/**
 * A DoubleLevelVisibilityMatrix with one empty requirement on each level. A requirement with no
 * conditions can never be satisfied (see checkVisibility), so an authorizer fed this denies
 * everyone who does not hold the bypass permission - the safe direction to fail in when the real
 * visibility could not be read, and it still lets the rest of an admin panel render.
 *
 * Only ever safe to authorize against: never hand it to an editor, since saving it would overwrite
 * the real requirements with these empty ones.
 */
export const EMPTY_VISIBILITY: DoubleLevelVisibilityMatrix = {
    regularLevel: { requirements: [{ conditions: [] }] },
    adminLevel: { requirements: [{ conditions: [] }] },
}
