import { BypassPermissions } from '@/server/visibility/ConfigVars'
import type { MembershipFiltered } from '@/server/groups/memberships/Types'
import type { Permission } from '@prisma/client'
import type { GroupMatrix, VisibilityCollapsed, VisibilityLevelType } from '@/server/visibility/Types'

type MembershipAndPermission = {
    memberships: MembershipFiltered[],
    permissions: Permission[]
}

/**
 * Check if a user meets the visibility requirements of a visibility
 * @param memberships - the memberships of the user. Remember if using getUser and there is no user
 * getUser and useUser will return an empty array
 * @param permissions - the permissions of the user. Remember if using getUser and there is no usee
 * getUser and useUser will return an empty array. Used if type of visibility is SPECIAL
 * @param visibility - the visibility to require
 * @param level - the level of visibility to require
 * @returns - true if the user meets the visibility requirements, false otherwise
 */
export function checkVisibility({
    memberships,
    permissions
}: MembershipAndPermission,
visibility: VisibilityCollapsed,
level: VisibilityLevelType,
) {
    const bypassPermission = BypassPermissions[visibility.purpose]
    if (bypassPermission && permissions.includes(bypassPermission)) return true
    if (visibility.type === 'REGULAR' && !visibility.published) return false
    if (visibility.type === 'SPECIAL') {
        if (level === 'REGULAR') {
            //null permission means no permission required
            return visibility.regular ? permissions.includes(visibility.regular) : true
        }
        //null permission means no permission required
        return visibility.admin ? permissions.includes(visibility.admin) : true
    }
    return checkVisibilityATLevel(memberships, visibility[level === 'REGULAR' ? 'regular' : 'admin'])
}

function checkVisibilityATLevel(memberships: MembershipFiltered[], visibilityLevel: GroupMatrix) {
    if (!visibilityLevel.length) return true
    return visibilityLevel.every(requirement =>
        requirement.some(
            groupId => memberships.some(
                membership => membership.groupId === groupId
            )
        )
    )
}
