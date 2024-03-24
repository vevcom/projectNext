import { GroupMatrix, VisibilityCollapsed } from '@/server/visibility/Types';
import { BasicMembership } from '@/server/groups/Types';
import { Permission, VisibilityLevel } from '@prisma/client';

type MembershipAndPermission = {
    memberships: BasicMembership[],
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
 */
export function checkVisibility({ 
    memberships, 
    permissions
} : MembershipAndPermission, 
    visibility: VisibilityCollapsed, 
    level: 'REGULAR' | 'ADMIN'
) {
    if (visibility.type === 'REGULAR' && !visibility.published) return false
    if (visibility.type === 'SPECIAL') {
        if (level === 'REGULAR') {
            return visibility.regular ? permissions.includes(visibility.regular) : true //null permission means no permission required
        }
        return visibility.admin ? permissions.includes(visibility.admin) : true //null permission means no permission required
    }
    return checkVisibilityATLevel(memberships, visibility[level === 'REGULAR' ? 'regular' : 'admin'])
}

function checkVisibilityATLevel(memberships: BasicMembership[], visibilityLevel: GroupMatrix) {
    if (!visibilityLevel.length) return true
    visibilityLevel.every(requirement => 
        requirement.some(
            groupId => memberships.some(
                membership => membership.groupId === groupId
            )
        )
    )
}